import Collapsible from "@/components/ui/Collapsible";
import Easy2048 from "@/components/sections/games/2048GameEasy";
import {
  EasyArticle2048,
  EasyLesson2048,
} from "@/components/lib/data/2048";

export default function SnakeEasyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100">

      <h1 className="text-3xl font-bold mb-6">
        2048: Molarity
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <EasyArticle2048 />
      </Collapsible>

      <EasyLesson2048 />

      <Easy2048 />

    </div>
  );
}
