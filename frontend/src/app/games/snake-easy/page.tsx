import Collapsible from "@/components/ui/Collapsible";
import SnakeGame from "@/components/sections/games/SnakeGame";
import {
  SnakeEasyArticle,
  SnakeEasyLesson,
} from "@/components/lib/data/snake";

export default function SnakeEasyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100">

      <h1 className="text-3xl font-bold mb-6">
        Snake: Chemical Nomenclature
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <SnakeEasyArticle />
      </Collapsible>

      <SnakeEasyLesson />

      <SnakeGame />

    </div>
  );
}
