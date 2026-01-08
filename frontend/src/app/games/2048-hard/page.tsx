import Collapsible from "@/components/ui/Collapsible";
import Game2048 from "@/components/sections/games/2048GameHard";
import {
  HardArticle2048,
  EasyArticle2048,
} from "@/components/lib/data/2048";

export default function HardPage2048() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100">

      <h1 className="text-3xl font-bold mb-6">
        2048: Gas Laws
      </h1>

      <Collapsible
        title="Learn More!"
        className="max-w-7xl"
        defaultOpen={true}
      >
        <HardArticle2048 />
      </Collapsible>

      <EasyArticle2048 />

      <Game2048 />

    </div>
  );
}
