import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// The data structure our form will submit
interface IssueFormData {
  title: string;
  description: string;
  // We'll add categoryId later
}

// Props the componenzzt expects
interface IssueFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addIssue: (data: any) => Promise<void>;
  issue?: any; 
}

export const IssueForm = ({ open, onOpenChange, issue, addIssue }: IssueFormProps) => {
  const { categories } = useData(); // Get categories for the dropdown
  const { user } = useAuth(); // Get user info to send to backend
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
  });

  // This useEffect will reset the form when it opens
  useEffect(() => {
    if (open) {
      // TODO: Populate form for editing if an 'issue' prop is passed
      setFormData({ title: '', description: '' });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create an issue.");
      return;
    }
    setLoading(true);

    try {
      // Construct the final data object for the backend
      const issuePayload = {
        ...formData,
        roomNumber: user.roomNo || 'N/A',
        createdBy: user.name,
      };
      
      await addIssue(issuePayload);
      onOpenChange(false); // Close the modal on success
       // Refresh the issues list

    } catch (error)
    {
      toast.error("Failed to submit issue.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{issue ? 'Edit Issue' : 'Raise New Issue'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="issue-form" className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.title} // <== store category name in title
              onValueChange={(value) => setFormData({ ...formData, title: value })} 
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please provide details about the issue."
              rows={5}
              required
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="issue-form" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Issue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};