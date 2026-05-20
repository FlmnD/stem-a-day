
import Collapsible from "@/components/ui/Collapsible";
import WheresMyWaterGameHard from "@/components/sections/games/WheresMyWaterGameHard";
import {
  WheresMyWaterHardArticle,
  WheresMyWaterHardLesson,
} from "@/components/lib/data/wheresmywater";

export default function WheresMyWaterHardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100 dark:bg-slate-950">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Where&apos;s My Water?: Net Ionic Equations
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <WheresMyWaterHardArticle />
      </Collapsible>

      <WheresMyWaterHardLesson />

      <WheresMyWaterGameHard />
    </div>
  );
}
