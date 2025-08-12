'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="mx-auto max-w-4xl text-center">
      <h1 className="from-primary to-primary/60 mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
        Find a time to Be
        <br />
        <span className="text-foreground">Together</span>
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl leading-relaxed">
        Stop the endless back-and-forth polls. Issho makes scheduling group
        meetings effortless...
      </p>
      <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
        <div className="relative">
          <Button size="lg" className="group px-8 py-6 text-lg">
            Create event
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <span className="text-muted-foreground absolute top-13 left-0 w-full text-xs">
            It&apos;s free! No login required.
          </span>
        </div>
      </div>
    </section>
  );
}
