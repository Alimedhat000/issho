'use client';
import Link from 'next/link';

import { ThemeToggle } from '@/app/_components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <Link href={paths.home.getHref()}>
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-xl">緒</span>
            </div>
            <span className="text-xl font-bold">Ishho</span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Give feedback
          </a>

          <Link
            href={paths.auth.login.getHref()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>

          <Link href={paths.auth.register.getHref()}>
            <Button size="sm" className="ml-2">
              Sign up
            </Button>
          </Link>

          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href={paths.auth.register.getHref()}>
            <Button size="sm">Sign up</Button>
          </Link>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
