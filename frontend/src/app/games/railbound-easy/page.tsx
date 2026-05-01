
import Collapsible from "@/components/ui/Collapsible";
import RailboundGame from "@/components/sections/games/RailboundGame";
import {
  RailboundEasyArticle,
  RailboundEasyLesson,
} from "@/components/lib/data/railbound";

export default function RailboundEasyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100 dark:bg-slate-950">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Railbound: Dimensional Analysis
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <RailboundEasyArticle />
      </Collapsible>

      <RailboundEasyLesson />

      <RailboundGame />
    </div>
  );
}