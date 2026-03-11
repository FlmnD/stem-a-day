
import Collapsible from "@/components/ui/Collapsible";
import EasyPips from "@/components/sections/games/PipsGameEasy";
import {
  EasyArticlePips,
  EasyLessonPips,
} from "@/components/lib/data/pips";

export default function EasyPagePips() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100 dark:bg-black dark:text-slate-100">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Pips: Molarity
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <EasyArticlePips />
      </Collapsible>

      <EasyLessonPips />

      <EasyPips />
    </div>
  );
}