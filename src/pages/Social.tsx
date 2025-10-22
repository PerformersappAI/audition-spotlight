import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Social() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Social Features Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            Connect with other filmmakers, share your work, and discover new opportunities.
          </p>
          <p className="text-sm text-muted-foreground">
            This feature is currently under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
