"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {/* <Users className="h-8 w-8 text-primary" /> */}
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-xl">緒</span>
          </div>
          <span className="text-2xl font-bold">Issho</span>
        </div>

        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary/20">404</div>
          <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground text-lg">
            Oops! The page you&apos;re looking for couldn&apos;t make it to the
            group meeting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Need help? Check our{" "}
            <Link href="/" className="text-primary hover:underline">
              homepage
            </Link>{" "}
            or create a new event to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
