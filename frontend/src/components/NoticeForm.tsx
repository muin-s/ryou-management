import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Notice } from "@/contexts/DataContext";

interface NoticeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addNotice: (data: { title: string; content: string; author: string }) => Promise<void>;
  updateNotice?: (noticeId: number, updates: Partial<Notice>) => Promise<boolean>;
  editingNotice?: Notice | null;
}

export const NoticeForm = ({ open, onOpenChange, addNotice, updateNotice, editingNotice }: NoticeFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  // Prefill when editingNotice is provided (or clear when opening for create)
  useEffect(() => {
    if (open) {
      if (editingNotice) {
        setFormData({
          title: editingNotice.title || "",
          content: editingNotice.content || "",
        });
      } else {
        setFormData({ title: "", content: "" });
      }
    }
  }, [open, editingNotice]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      if (editingNotice) {
        // Update flow
        if (!updateNotice) {
          throw new Error("updateNotice not provided");
        }
        const success = await updateNotice(editingNotice.id, {
          title: formData.title,
          content: formData.content,
        });
        if (!success) throw new Error("Update failed");
        toast.success("Notice updated");
        onOpenChange(false);
      } else {
        // Create flow
        await addNotice({
          title: formData.title,
          content: formData.content,
          author: user?.name || "Admin",
        });
        toast.success("Notice created");
        onOpenChange(false);
      }
    } catch (err: any) {
      console.error("NoticeForm submit error:", err);
      toast.error(err?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingNotice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
        </DialogHeader>
        <form id="notice-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="notice-form" disabled={loading}>
            {loading ? (editingNotice ? "Updating..." : "Creating...") : editingNotice ? "Update Notice" : "Create Notice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeForm;
