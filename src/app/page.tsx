import { Hero } from "@/components/layout/hero"
import { Features } from "@/components/layout/features"
import { Testimonials } from "@/components/layout/testimonials"
import { Pricing } from "@/components/layout/pricing"
import { Contact } from "@/components/layout/contact"

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Contact />
    </div>
  );
}
