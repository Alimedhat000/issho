import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, Edit3, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/app/_components/ThemeToggle';

export default function EventPage() {
  const timeSlots = [
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
  ];

  const days = ['Mon', 'Tue', 'Wed'];

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-background/80 container mx-auto border-b px-4 py-6 backdrop-blur-sm">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              {/* <Users className="w-5 h-5 text-primary-foreground" /> */}
              <span className="text-primary-foreground text-xl">緒</span>
            </div>
            <span className="text-xl font-bold">Ishho</span>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Create an event
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </a>
            <Button size="sm" className="ml-2">
              Sign up
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Button size="sm">Sign up</Button>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="mb-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-4xl font-bold">Event Name</h1>
              <div className="text-muted-foreground flex items-center gap-4">
                <span>Mon, Tue, Wed</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 h-auto p-0"
                >
                  <Edit3 className="mr-1 h-4 w-4" />
                  Edit event
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Copy className="h-4 w-4" />
                Copy link
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Add availability
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="grid grid-cols-4 gap-0 overflow-hidden rounded-lg border">
                {/* Header Row */}
                <div className="bg-muted/50 border-r border-b p-3">
                  <span className="text-muted-foreground text-sm font-medium">
                    Time
                  </span>
                </div>
                {days.map((day) => (
                  <div
                    key={day}
                    className="bg-muted/50 border-r border-b p-3 text-center last:border-r-0"
                  >
                    <span className="font-medium">{day}</span>
                  </div>
                ))}

                {/* Time Slots */}
                {timeSlots.map((time, timeIndex) => (
                  <div key={time} className="contents">
                    <div className="bg-muted/20 text-muted-foreground border-r border-b p-3 text-sm">
                      {time}
                    </div>
                    {days.map((day) => (
                      <div
                        key={`${day}-${time}`}
                        className="hover:bg-muted/30 relative min-h-[60px] cursor-pointer border-r border-b p-3 transition-colors last:border-r-0"
                      >
                        {/* Sample event block */}
                        {day === 'Tue' && timeIndex === 0 && (
                          <div className="bg-muted-foreground text-primary-foreground absolute inset-1 flex items-center justify-center rounded p-2 text-xs">
                            Tue 10:45 AM to 11:00 AM
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Timezone Selector */}
              <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
                <span>Shown in</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-auto p-1"
                >
                  (GMT+3:00) Cairo
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-auto p-1"
                >
                  12h
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Responses Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Responses (0/0)</h3>
              <p className="text-muted-foreground text-sm">No responses yet!</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 mt-20 border-t">
        <div className="container mx-auto px-4 py-8 text-center">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
