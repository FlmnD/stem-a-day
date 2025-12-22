import Collapsible from "@/components/ui/Collapsible";
import SnakeGame from "@/components/sections/games/SnakeGameHard";
import {
  SnakeHardArticle,
  SnakeHardLesson,
} from "@/components/lib/data/snake";

export default function SnakeHardPage() {
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
        <SnakeHardArticle />
      </Collapsible>

      <SnakeHardLesson />

      <SnakeGame />

    </div>
  );
}
