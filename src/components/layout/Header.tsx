'use client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-xl">緒</span>
          </div>
          <span className="text-xl font-bold">Ishho</span>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Give feedback
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
  );
}
