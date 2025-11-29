import { CarbleHardArticle, CarbleHardLesson } from "@/components/lib/data/carble";
import CarbleGame from "@/components/sections/games/CarbleGame";
import { Guess } from "@/structures/CarbleStructures";

export default function EasyCarble(): React.JSX.Element {
  const yellowRange = { atomicRadius: 25, ionizationEnergy: 50, electronegativity: 2 };
  return <CarbleGame yellowRange={yellowRange} guessFormat={Guess.HardGuess} carbleLesson={CarbleHardLesson()} carbleArticle={CarbleHardArticle()}></CarbleGame>
}
