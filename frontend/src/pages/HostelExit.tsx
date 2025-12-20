import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const API_BASE = "http://localhost:5000";

interface ExitRow {
    id: number;
    exit_type: string;
    leave_datetime: string;
    return_datetime: string;
    risk_level: string;
    calculated_fee: number;
    status: string;
}

export default function HostelExit() {
    const { user } = useAuth();
    const token = localStorage.getItem("access_token");

    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [rows, setRows] = useState<ExitRow[]>([]);

    // ---------------- FETCH STUDENT HISTORY ----------------
    const fetchMy = async () => {
        const res = await fetch(`${API_BASE}/api/hostel-exit/my`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            setRows(await res.json());
        }
    };

    // ---------------- SUBMIT REQUEST ----------------
    const submit = async () => {
        if (!description.trim()) {
            toast({ title: "Error", description: "Please enter a description", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/hostel-exit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ description }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast({
                    title: "Error",
                    description: data.error || "Unable to process request",
                    variant: "destructive"
                });
                return;
            }

            toast({ title: "Success", description: "Exit request submitted successfully" });
            setDescription("");
            await fetchMy();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit request",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role !== "student") return;

        fetchMy();
        const t = setInterval(fetchMy, 5000); // poll every 5s

        return () => clearInterval(t);
    }, [user]);


    if (user?.role !== "student") return null;

    // ================= UI =================
    return (
        <div className="space-y-6">
            <textarea
                className="w-full border p-3 rounded min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example:
I am leaving hostel on 21 Dec at 10 AM and will return on 24 Dec at 6 PM.
I stay in a 2 seater room. Emergency contact is 9XXXXXXXXX."
            />

            <Button onClick={submit} disabled={loading}>
                {loading ? "Processing..." : "Submit"}
            </Button>


            {/* ---------------- HISTORY TABLE ---------------- */}
            <table className="w-full border text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Dates</th>
                         

                        <th className="p-2 border">Fee</th>
                        <th className="p-2 border">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-t">
                            <td className="p-2">{r.exit_type}</td>
                            <td className="p-2">
                                {r.leave_datetime} → {r.return_datetime}
                            </td>
                             
                            <td className="p-2">₹{r.calculated_fee}</td>
                            <td className="p-2 font-semibold">{r.status}</td>
                        </tr>
                    ))}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                No exit requests submitted yet
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
