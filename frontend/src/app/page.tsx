import Features from "@/components/sections/home/Features";
import Hero from "@/components/sections/home/Hero";
import DailyPreview from "@/components/sections/home/DailyPreview";
import Stats from "@/components/sections/home/Stats";
import Testimonials from "@/components/sections/home/Testimonials";
import FAQ from "@/components/sections/home/FAQ";
import LogoStrip from "@/components/sections/home/LogoStrip";
import CallToAction from "@/components/sections/home/CallToAction";

export default function Home() {
  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-gradient-to-b from-sky-50 via-white to-white">
      <Hero />
      <LogoStrip />
      <Features />
      <DailyPreview />
      <Stats />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </main>
  );
}
