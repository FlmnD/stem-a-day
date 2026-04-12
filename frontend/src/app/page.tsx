import SignedInHome from "@/components/sections/home/SignedInHome";
import Features from "@/components/sections/home/Features";
import Hero from "@/components/sections/home/Hero";
import DailyPreview from "@/components/sections/home/DailyPreview";
import Stats from "@/components/sections/home/Stats";
import Testimonials from "@/components/sections/home/Testimonials";
import FAQ from "@/components/sections/home/FAQ";
import LogoStrip from "@/components/sections/home/LogoStrip";
import CallToAction from "@/components/sections/home/CallToAction";
import { asSessionUser, type SessionUser } from "@/lib/session-user";
import { fetchBackendWithSession } from "@/lib/server-session";

export default async function Home() {
  let sessionUser: SessionUser | null = null;

  try {
    const result = await fetchBackendWithSession("/users/me");
    if (result.response?.ok) {
      sessionUser = asSessionUser(result.data);
    }
  } catch {}

  if (sessionUser) {
    return (
      <main className="min-h-[calc(100dvh-3.5rem)] bg-linear-to-b from-sky-50 via-white to-white dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]">
        <SignedInHome user={sessionUser} />
        <DailyPreview />
        <Features />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-linear-to-b from-sky-50 via-white to-white dark:from-black dark:via-[#0b0b0b] dark:to-[#0b0b0b]">
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
