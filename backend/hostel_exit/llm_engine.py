import os
import json
import threading
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

USE_REAL_LLM = os.getenv("USE_REAL_LLM", "false").lower() == "true"
MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"

_tokenizer = None
_model = None
_lock = threading.Lock()


def _load():
    global _tokenizer, _model
    _tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
    _model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        trust_remote_code=True,
        low_cpu_mem_usage=True
    ).to("cpu").eval()


def run_llm(prompt: str) -> dict:
    if not USE_REAL_LLM:
        return {
    "intent": "REGULAR_EXIT",
    "reason": "Personal work",
    "leave_datetime": "2025-12-21T10:00:00",
    "return_datetime": "2025-12-21T18:00:00",
    "room_type": "4_seater",
    "emergency_contact": "9999999999"
}


    global _model
    if _model is None:
        with _lock:
            if _model is None:
                print("Loading Qwen model (one-time)...")
                _load()

    # Use the tokenizer's chat template if available, otherwise use simple format
    try:
        # Qwen2.5 uses apply_chat_template
        messages = [
            {"role": "system", "content": "You are a helpful assistant that extracts information and returns only valid JSON."},
            {"role": "user", "content": prompt}
        ]
        formatted_prompt = _tokenizer.apply_chat_template(
            messages, 
            tokenize=False, 
            add_generation_prompt=True
        )
    except Exception:
        # Fallback to simple format
        formatted_prompt = prompt
    
    inputs = _tokenizer(formatted_prompt, return_tensors="pt")
    with torch.no_grad():
        outputs = _model.generate(
            **inputs,
            max_new_tokens=256,
            temperature=0.1,
            do_sample=True,
            top_p=0.9
        )

    text = _tokenizer.decode(outputs[0], skip_special_tokens=True)
    # Remove the prompt from the response - try multiple methods
    if formatted_prompt in text:
        text = text.split(formatted_prompt)[-1]
    # Also try removing just the user message part
    if prompt in text and prompt != text:
        # Find where the actual response starts (after the prompt)
        prompt_end = text.rfind(prompt)
        if prompt_end != -1:
            text = text[prompt_end + len(prompt):].strip()
    
    print("RAW LLM TEXT:", text[:500])  # Print first 500 chars for debugging

    # ✅ STRICT JSON EXTRACTION - Find the first complete JSON object
    start = text.find("{")
    if start == -1:
        raise ValueError("LLM did not return JSON")
    
    # Find the matching closing brace by counting braces
    brace_count = 0
    end = start
    for i in range(start, len(text)):
        if text[i] == '{':
            brace_count += 1
        elif text[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end = i + 1
                break
    
    if brace_count != 0:
        raise ValueError("LLM returned incomplete JSON")
    
    json_str = text[start:end]
    print("EXTRACTED JSON STRING:", json_str)
    
    # Try to parse the JSON
    try:
        result = json.loads(json_str)
        # Validate that we got actual values, not placeholders
        if result.get("leave_datetime") == "..." or result.get("return_datetime") == "...":
            raise ValueError("LLM returned placeholder values instead of actual dates")
        return result
    except json.JSONDecodeError as e:
        # If parsing fails, try to clean up common issues
        # Remove any trailing commas before closing braces
        import re
        json_str = re.sub(r',\s*}', '}', json_str)
        json_str = re.sub(r',\s*]', ']', json_str)
        try:
            result = json.loads(json_str)
            # Validate that we got actual values, not placeholders
            if result.get("leave_datetime") == "..." or result.get("return_datetime") == "...":
                raise ValueError("LLM returned placeholder values instead of actual dates")
            return result
        except json.JSONDecodeError:
            raise ValueError(f"LLM returned invalid JSON: {str(e)}")
