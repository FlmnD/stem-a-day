import { CarbleHardArticle, CarbleHardLesson } from "@/components/lib/data/carble";
import CarbleGame from "@/components/sections/games/CarbleGame";
import { Guess } from "@/structures/CarbleStructures";

export default function EasyCarble(): React.JSX.Element {
  const yellowRange = { electronegativity: 2, electronAffinity: 25, ionizationEnergy: 50, atomicRadius: 25 };
  return <CarbleGame yellowRange={yellowRange} guessFormat={Guess.HardGuess} carbleLesson={CarbleHardLesson()} carbleArticle={CarbleHardArticle()}></CarbleGame>
}
