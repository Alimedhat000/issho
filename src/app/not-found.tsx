'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {/* <Users className="h-8 w-8 text-primary" /> */}
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-xl">緒</span>
          </div>
          <span className="text-2xl font-bold">Issho</span>
        </div>

        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-primary/20 text-8xl font-bold">404</div>
          <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground text-lg">
            Oops! The page you&apos;re looking for couldn&apos;t make it to the
            group meeting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="border-border/50 border-t pt-8">
          <p className="text-muted-foreground text-sm">
            Need help? Check our{' '}
            <Link href="/" className="text-primary hover:underline">
              homepage
            </Link>{' '}
            or create a new event to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
