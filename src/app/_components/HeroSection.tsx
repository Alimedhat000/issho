"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Find a time to Be
        <br />
        <span className="text-foreground">Together</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
        Stop the endless back-and-forth polls. Issho makes scheduling group
        meetings effortless...
      </p>
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
      </div>
    </section>
  );
}
