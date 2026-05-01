
import Collapsible from "@/components/ui/Collapsible";
import RailboundGameHard from "@/components/sections/games/RailboundGameHard";
import {
  RailboundHardArticle,
  RailboundHardLesson,
} from "@/components/lib/data/railbound";

export default function RailboundHardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100 dark:bg-slate-950">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Railbound: Stoichiometry
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <RailboundHardArticle />
      </Collapsible>

      <RailboundHardLesson />

      <RailboundGameHard />
    </div>
  );
}