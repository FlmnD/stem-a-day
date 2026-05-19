
import Collapsible from "@/components/ui/Collapsible";
import WheresMyWaterGame from "@/components/sections/games/WheresMyWaterGame";
import {
  WheresMyWaterEasyArticle,
  WheresMyWaterEasyLesson,
} from "@/components/lib/data/wheresmywater";

export default function WheresMyWaterEasyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100 dark:bg-slate-950">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Where's My Water?: Electron Configuration
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <WheresMyWaterEasyArticle />
      </Collapsible>

      <WheresMyWaterEasyLesson />

      <WheresMyWaterGame />
    </div>
  );
}