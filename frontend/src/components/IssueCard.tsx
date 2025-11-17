import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { UpvoteButton } from './UpvoteButton';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Issue } from '@/contexts/DataContext';

interface IssueCardProps {
  issue: Issue;
  onView: (issue: Issue) => void;
  onEdit?: (issue: Issue) => void;
  onDelete?: (id: number) => void; 
  showActions?: boolean;
}

export const IssueCard = ({ issue, onView, onEdit, onDelete, showActions = false }: IssueCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{issue.title}</h3>
             <p className="text-sm text-muted-foreground mt-1">
                 {issue.createdBy} • Room {issue.roomNumber}
             </p>
          </div>
          <StatusBadge status={issue.status as any} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground line-clamp-2">{issue.description}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Posted: {new Date(issue.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <UpvoteButton issueId={issue.id} upvotes={issue.upvotes} voters={issue.voters} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(issue)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {showActions && (
            <>
              {onEdit && issue.status !== 'Resolved' && (
                <Button variant="outline" size="sm" onClick={() => onEdit(issue)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(issue.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};