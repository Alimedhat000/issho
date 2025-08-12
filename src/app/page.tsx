"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, ArrowRight, Quote } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary  rounded-lg flex items-center justify-center">
              {/* <Users className="w-5 h-5 text-primary-foreground" /> */}
              <span className="text-primary-foreground text-xl">緒</span>
            </div>
            <span className="text-xl font-bold">Ishho</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Give feedback
            </a>
            {/* <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Donate
            </a> */}
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Find a time to Be
            <br />
            <span className="text-foreground">Together</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop the endless back-and-forth pols. Issho makes scheduling group
            meetings effortless with smart availability tracking and seamless
            collaboration tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <div className="relative">
              <Button size="lg" className="text-lg px-8 py-6 group">
                Create event
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <span className="absolute top-13 left-0 w-full text-xs text-muted-foreground">
                It&apos;s free! No login required.
              </span>
            </div>
            {/* <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent"
            >
              Watch Demo
            </Button> */}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-muted-foreground">
                AI-powered scheduling finds the perfect time for everyone
                automatically.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Group Coordination</h3>
              <p className="text-muted-foreground">
                Manage multiple participants with real-time availability
                tracking.
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Time Zone Magic</h3>
              <p className="text-muted-foreground">
                Seamlessly coordinate across different time zones without
                confusion.
              </p>
            </Card>
          </div>

          {/* Quote Section */}
          <Card className="p-8 bg-muted/50 border-l-4 border-l-primary">
            <Quote className="w-8 h-8 text-primary mx-auto mb-4" />
            <blockquote className="text-2xl font-medium text-foreground mb-4 italic">
              &quot;Issho transformed how our remote team coordinates. What used
              to take hours of planning now happens in minutes.&quot;
            </blockquote>
            <cite className="text-muted-foreground font-medium">
              — Sarah Chen, Some Random Girl never met
            </cite>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary  rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-xl">緒</span>
                </div>
                <span className="font-bold">Issho</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making group meetings simple and efficient for teams worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Issho. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
