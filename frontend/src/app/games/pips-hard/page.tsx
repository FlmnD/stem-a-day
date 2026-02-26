import Collapsible from "@/components/ui/Collapsible";
import HardPips from "@/components/sections/games/PipsGameHard";
import {
  HardArticlePips,
  HardLessonPips,
} from "@/components/lib/data/pips";

export default function HardPagePips() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100">

      <h1 className="text-3xl font-bold mb-6">
        Pips: Gas Laws
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <HardArticlePips />
      </Collapsible>

      <HardLessonPips />

      <HardPips />

    </div>
  );
}
