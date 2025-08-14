import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Response {
  id: string;
  name: string;
  avatarUrl?: string;
}

export default function ResponseSideBar({
  responses,
}: {
  responses: Response[];
}) {
  return (
    <div className="lg:col-span-1">
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">
          {/* Todo replace X Dynamically with how much responses is on the hovered cell And also highlight the corrisponding avatars*/}
          Responses ({responses.length}/{responses.length}){' '}
          {/* Replace X with max participants if needed */}
        </h3>
        {responses.length === 0 ? (
          <p className="text-muted-foreground text-sm">No responses yet!</p>
        ) : (
          <div className="space-y-3">
            {responses.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <Avatar>
                  {r.avatarUrl ? (
                    <AvatarImage src={r.avatarUrl} alt={r.name} />
                  ) : (
                    <AvatarFallback>{r.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium">{r.name}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
