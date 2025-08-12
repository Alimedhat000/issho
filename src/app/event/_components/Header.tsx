import { ThemeToggle } from '@/app/_components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-background/80 container mx-auto border-b px-4 py-6 backdrop-blur-sm">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-xl">緒</span>
          </div>
          <span className="text-xl font-bold">Ishho</span>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Create an event
          </Link>
          <a
            href={paths.auth.login.getHref()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </a>
          <Link href={paths.auth.login.getHref()}>
            <Button size="sm" className="ml-2">
              Sign up
            </Button>
          </Link>
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
