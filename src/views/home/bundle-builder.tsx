"use client";

import BuilderProvider from "@/state/builder-context";
import Builder from "./builder";
import ReviewPanel from "./review-panel";

export default function BundleBuilder() {
  return (
    <BuilderProvider>
      <main className="px-(--page-pad) pt-7.75 [--page-pad:0.9375rem] sm:pt-8 sm:pb-20 sm:[--page-pad:clamp(1rem,4vw,3rem)] xl:pt-12.25">
        <div className="mx-auto max-w-299">
          <h1 className="text-hero text-charcoal mb-5 text-center font-bold sm:sr-only">
            Let&rsquo;s get started!
          </h1>
          <div className="grid grid-cols-1 sm:gap-10 xl:grid-cols-[minmax(0,1fr)_24.9375rem] xl:items-start xl:gap-7.25">
            <Builder />
            <div className="min-w-0 xl:sticky xl:top-6">
              <ReviewPanel />
            </div>
          </div>
        </div>
      </main>
    </BuilderProvider>
  );
}
