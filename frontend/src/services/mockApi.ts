// API service using real Flask backend
// Replaces in-memory mock data

import { User, Issue, Notice } from "./mockData";

const BASE_URL = "http://localhost:5000/api"; // 👈 change if your backend runs elsewhere

// ------------------- Auth API -------------------
export const authApi = {
  async login(email: string, password: string): Promise<User | null> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async signup(userData: Omit<User, "id">): Promise<User> {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Signup failed");
    return res.json();
  },
};

// ------------------- Issues API -------------------
export const issuesApi = {
  async getAll(): Promise<Issue[]> {
    const res = await fetch(`${BASE_URL}/issues`);
    if (!res.ok) throw new Error("Failed to fetch issues");
    return res.json();
  },

  async getById(id: string): Promise<Issue | null> {
    const res = await fetch(`${BASE_URL}/issues/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async getByStudentId(studentId: string): Promise<Issue[]> {
    const res = await fetch(`${BASE_URL}/issues?student_id=${studentId}`);
    if (!res.ok) throw new Error("Failed to fetch student issues");
    return res.json();
  },

  async getByRepairerId(repairerId: string): Promise<Issue[]> {
    const res = await fetch(`${BASE_URL}/issues?repairer_id=${repairerId}`);
    if (!res.ok) throw new Error("Failed to fetch repairer issues");
    return res.json();
  },

  async create(issueData: Omit<Issue, "id" | "upvotes" | "voters" | "postedDate">): Promise<Issue> {
    const res = await fetch(`${BASE_URL}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issueData),
    });
    if (!res.ok) throw new Error("Failed to create issue");
    return res.json();
  },

  async update(id: string, updates: Partial<Issue>): Promise<Issue | null> {
    const res = await fetch(`${BASE_URL}/issues/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/issues/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  },

  async upvote(issueId: string, userId: string): Promise<Issue | null> {
    const res = await fetch(`${BASE_URL}/issues/${issueId}/upvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async downvote(issueId: string, userId: string): Promise<Issue | null> {
    const res = await fetch(`${BASE_URL}/issues/${issueId}/downvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return null;
    return res.json();
  },
};

// ------------------- Notices API -------------------
export const noticesApi = {
  async getAll(): Promise<Notice[]> {
    const res = await fetch(`${BASE_URL}/notices`);
    if (!res.ok) throw new Error("Failed to fetch notices");
    return res.json();
  },

  async getById(id: string): Promise<Notice | null> {
    const res = await fetch(`${BASE_URL}/notices/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async create(noticeData: Omit<Notice, "id" | "postedDate">): Promise<Notice> {
    const res = await fetch(`${BASE_URL}/notices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noticeData),
    });
    if (!res.ok) throw new Error("Failed to create notice");
    return res.json();
  },

  async update(id: string, updates: Partial<Notice>): Promise<Notice | null> {
    const res = await fetch(`${BASE_URL}/notices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/notices/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  },
};

// ------------------- Users API -------------------
export const usersApi = {
  async getAll(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  async getRepairers(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/users?role=repairer`);
    if (!res.ok) throw new Error("Failed to fetch repairers");
    return res.json();
  },
};

// ------------------- Categories API -------------------
export const categoriesApi = {
  async getAll() {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },
};
