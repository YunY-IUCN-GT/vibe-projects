
import { Hero } from "@/components/layout/hero"
import { Features } from "@/components/layout/features"
import { Testimonials } from "@/components/layout/testimonials"
import { Pricing } from "@/components/layout/pricing"

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />

      <section id="contact" className="h-screen flex items-center justify-center bg-muted/80">
        <h1 className="text-4xl font-bold">Contact Section</h1>
      </section>
    </div>
  );
}
