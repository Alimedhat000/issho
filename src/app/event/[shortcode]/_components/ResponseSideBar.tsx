import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface Response {
  id: string;
  name: string;
  avatarUrl?: string;
}

export default function ResponseSideBar({
  responses,
  isEditActive,
}: {
  isEditActive: boolean;

  responses: Response[];
}) {
  return (
    <div className="flex flex-col gap-5 lg:col-span-1">
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
        {isEditActive && (
          <div className="flex flex-col gap-2">
            <span className="font-bold">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded border border-green-500 bg-green-200"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded border border-rose-500 bg-rose-400"></div>
              <span>Unavailable</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
