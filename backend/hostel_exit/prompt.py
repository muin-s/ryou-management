from datetime import datetime, timedelta

def build_prompt(text):
    now = datetime.now()
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    current_year = now.year
    current_date = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%H:%M:%S")
    
    # Calculate examples for relative times
    in_2_hours = (now + timedelta(hours=2)).strftime("%Y-%m-%dT%H:%M:%S")
    tomorrow_same_time = (now + timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S")

    return f"""The input message may be in English or Japanese.
First understand the meaning correctly.
Then extract the information and return ONLY valid JSON in English.

Extract information from this message and return ONLY valid JSON with no explanations:

Message: {text}

CURRENT CONTEXT:
- Current date/time: {now_str} (Year: {current_year}, Timezone: Asia/Kolkata)
- Current date: {current_date}
- Current time: {current_time}

RELATIVE TIME EXAMPLES:
- "now" or "today now" = {now_str[:19].replace(' ', 'T')}
- "after 2 hours" = {in_2_hours}
- "tomorrow" = {tomorrow_same_time}
- "same day" means the same date as leave date

Extract and return JSON with these exact keys:
- "intent": Calculate based on time difference (<=1 day = "REGULAR_EXIT", >1 day = "HOSTEL_LEAVE")
- "leave_datetime": ISO format "YYYY-MM-DDTHH:MM:SS" - extract from message, resolve relative times using current context
- "return_datetime": ISO format "YYYY-MM-DDTHH:MM:SS" - extract from message, resolve relative times using current context
- "room_type": Extract from message if mentioned ("2_seater", "4_seater", "2-seater", "4-seater", "2 seater", "4 seater"), otherwise use "unknown"
- "emergency_contact": Extract phone number (digits only, no spaces, no + or -), if not mentioned use empty string ""

CRITICAL RULES:
- For relative times: "now" = current time, "after X hours" = current time + X hours, "same day" = same date as leave
- Convert AM/PM to 24-hour: 10 AM = 10:00, 2 PM = 14:00, 7 PM = 19:00
- If year missing, use {current_year}
- Extract REAL values from the message, never use "..." or placeholders
- If room_type not mentioned, use "unknown"
- If phone not mentioned, use ""

Return only the JSON object, nothing else."""
