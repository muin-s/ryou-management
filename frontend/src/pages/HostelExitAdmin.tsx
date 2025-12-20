import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = "http://localhost:5000";

interface ExitRequest {
    id: number;
    student_id: number;
    exit_type: string;
    leave_datetime: string;
    return_datetime: string;
    risk_level: string;
    calculated_fee: number;
    status: string;
}

export default function HostelExitAdmin() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<ExitRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const getToken = () => {
        return localStorage.getItem("access_token") || "";
    };

    const fetchAll = async () => {
        const token = getToken();
        if (!token) {
            console.error("No access token found");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/hostel-exit`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            } else {
                console.error("Failed to fetch exit requests:", res.status, await res.text());
            }
        } catch (error) {
            console.error("Error fetching exit requests:", error);
        }
    };

    useEffect(() => {
        if (!user) return;
        if (user.role !== "admin") return;

        fetchAll();
    }, [user]);


    const exportPDF = async () => {
        const token = getToken();

        if (!token) {
            alert("Authentication token missing. Please login again.");
            return;
        }

        const res = await fetch(`${API_BASE}/api/hostel-exit/export/pdf`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const err = await res.text();
            alert("Failed to export PDF: " + err);
            return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "hostel_exit_report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const updateStatus = async (id: number, action: "approve" | "reject") => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("No access token found. Please login again.");
            return;
        }

        const res = await fetch(
            `${API_BASE}/api/hostel-exit/${id}/${action}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.ok) {
            fetchAll(); // refresh admin list
        } else {
            const errorText = await res.text();
            alert(`Failed to update status: ${errorText}`);
        }
    };


    if (user?.role !== "admin") return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={exportPDF} disabled={loading}>
                    {loading ? "Exporting..." : "Export PDF"}
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border bg-white dark:bg-gray-800">
                    <thead>
                        <tr>
                            <th className="p-3 border">Student ID</th>
                            <th className="p-3 border">Type</th>
                            <th className="p-3 border">Dates</th>
                            <th className="p-3 border">Risk</th>
                            <th className="p-3 border">Fee</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="p-3">{r.student_id}</td>
                                <td className="p-3">{r.exit_type}</td>
                                <td className="p-3">
                                    {r.leave_datetime} → {r.return_datetime}
                                </td>
                                <td className="p-3">{r.risk_level}</td>
                                <td className="p-3">₹{r.calculated_fee}</td>
                                <td className="p-3">{r.status}</td>
                                <td className="p-3 flex gap-2">
                                    {r.status === "pending" && (
                                        <>
                                            <Button size="sm" onClick={() => updateStatus(r.id, "approve")}>
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, "reject")}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    No exit requests
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
