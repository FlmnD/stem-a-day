"use client";

import { CarbleEasyArticle, CarbleEasyLesson } from "@/components/lib/data/carble";
import CarbleGame from "@/components/sections/games/CarbleGame";
import { Guess } from "@/structures/CarbleStructures";

export default function EasyCarble(): React.JSX.Element {
  const yellowRange = { atomicNumber: 5, atomicMass: 15, ionCharge: 2 };
  return <CarbleGame yellowRange={yellowRange} guessFormat={Guess.EasyGuess} CarbleLesson={CarbleEasyLesson} CarbleArticle={CarbleEasyArticle}></CarbleGame>
}
