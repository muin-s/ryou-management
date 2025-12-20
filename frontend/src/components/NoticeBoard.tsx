import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Notice } from '@/contexts/DataContext';
import { Megaphone } from 'lucide-react';

interface NoticeBoardProps {
  notices: Notice[];
}

export const NoticeBoard = ({ notices }: NoticeBoardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Notice Board</h2>
      </div>
      <div className="grid gap-4">
        {notices.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No notices available
            </CardContent>
          </Card>
        ) : (
          notices.map((notice) => (
            <Card key={notice.id}>
              <CardHeader>
                <CardTitle className="text-lg">{notice.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Posted on {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{notice.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
