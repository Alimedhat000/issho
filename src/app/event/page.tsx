import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Edit3, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function EventPage() {
  const timeSlots = [
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
  ];

  const days = ["Mon", "Tue", "Wed"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-background/80 backdrop-blur-sm">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary  rounded-lg flex items-center justify-center">
              {/* <Users className="w-5 h-5 text-primary-foreground" /> */}
              <span className="text-primary-foreground text-xl">緒</span>
            </div>
            <span className="text-xl font-bold">Ishho</span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
          <div className="md:hidden flex items-center gap-2">
            <Button size="sm">Sign up</Button>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Event Name</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>Mon, Tue, Wed</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 p-0 h-auto"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit event
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Copy className="w-4 h-4" />
                Copy link
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Add availability
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="grid grid-cols-4 gap-0 border rounded-lg overflow-hidden">
                {/* Header Row */}
                <div className="bg-muted/50 p-3 border-r border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    Time
                  </span>
                </div>
                {days.map((day) => (
                  <div
                    key={day}
                    className="bg-muted/50 p-3 border-r last:border-r-0 border-b text-center"
                  >
                    <span className="font-medium">{day}</span>
                  </div>
                ))}

                {/* Time Slots */}
                {timeSlots.map((time, timeIndex) => (
                  <div key={time} className="contents">
                    <div className="p-3 border-r border-b bg-muted/20 text-sm text-muted-foreground">
                      {time}
                    </div>
                    {days.map((day) => (
                      <div
                        key={`${day}-${time}`}
                        className="p-3 border-r last:border-r-0 border-b hover:bg-muted/30 transition-colors cursor-pointer relative min-h-[60px]"
                      >
                        {/* Sample event block */}
                        {day === "Tue" && timeIndex === 0 && (
                          <div className="absolute inset-1 bg-muted-foreground text-primary-foreground rounded text-xs p-2 flex items-center justify-center">
                            Tue 10:45 AM to 11:00 AM
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Timezone Selector */}
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>Shown in</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  (GMT+3:00) Cairo
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  12h
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Responses Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Responses (0/0)</h3>
              <p className="text-muted-foreground text-sm">No responses yet!</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
