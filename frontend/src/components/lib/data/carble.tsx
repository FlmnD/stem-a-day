import { Article, Lesson } from "@/structures/GameStructures";

export function CarbleEasyArticle(): Article {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Carble: Common Characteristics</h1>

            <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
                <h2 className="text-xl font-bold mb-3">Learn About the Essentials!</h2>

                <p className="mb-4">
                    Learn about elements, atoms, atomic number, atomic mass, and ionic charge here!
                    These hints will help you play the game successfully, so don’t skip them.
                    You should spend at least <strong>6–7 minutes</strong> learning before starting the game.
                    If you need more help, feel free to explore the external links.
                    <strong> Enjoy learning and playing!</strong>
                </p>

                <h3 className="font-semibold">Element</h3>
                <p className="mb-3">
                    An <strong>element</strong> is a pure substance that cannot be broken down or transformed
                    into another substance.
                </p>

                <h3 className="font-semibold">Atom</h3>
                <p className="mb-1">
                    An <strong>atom</strong> is the smallest chemical particle of an element. It includes:
                </p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Positive <strong>protons</strong></li>
                    <li>Negative <strong>electrons</strong></li>
                    <li>Neutral <strong>neutrons</strong></li>
                </ul>
                <p className="italic text-gray-600 mb-4">
                    <img src="/atomic and mass number.jpg" alt="atomic and mass number example" height="300" width="200" />
                </p>

                <h3 className="font-semibold">Atomic Number</h3>
                <p className="mb-2">
                    The <strong>atomic number</strong> is the number of protons in an atom.
                    On the periodic table, assume protons ≈ electrons ≈ neutrons (simplified model).
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Hydrogen → 1</li>
                    <li>Helium → 2</li>
                    <li>Carbon → 6</li>
                </ul>
                <p className="mb-4">
                    It increases by one as you move <strong>left → right</strong> across a period
                    and increases dramatically as you move <strong>top → bottom</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <img src="/4 protons diagram.png" alt="atom diagram example" height="300" width="200" />
                </p>

                <h3 className="font-semibold">Atomic Mass</h3>
                <p className="mb-2">
                    Atomic mass (or mass number) is the mass of an atom.
                    Approximate values:
                </p>
                <ul className="list-disc ml-6 mb-3">
                    <li>1 proton (p⁺) ≈ 1 amu</li>
                    <li>1 neutron ≈ 1 amu</li>
                    <li>1 electron (e⁻) ≈ 0 amu (so electrons barely affect mass)</li>
                </ul>

                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Hydrogen: 1 p + 1 e⁻ → ~1 amu</li>
                    <li>Helium: 2 p + 2 n + 2 e⁻ → ~4 amu</li>
                    <li>Carbon: 6 p + 6 n + 6 e⁻ → ~12 amu</li>
                </ul>

                <p className="mb-4">
                    Mass increases across each row (<strong>left → right</strong>)
                    and increases significantly down a group (<strong>top → bottom</strong>).
                </p>
                <p className="italic text-gray-600 mb-4">
                    <img src="/the structure of atom.jpg" alt="the structure of atom diagram" height="300" width="200" />
                </p>

                <h3 className="font-semibold">Ionic Charge</h3>
                <p className="mb-2">
                    The <strong>ionic charge</strong> is the charge an atom gets when it loses or gains electrons.
                </p>
                <p className="mb-3 italic text-gray-700">Reminder: electrons have a negative charge!</p>

                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Hydrogen → +</li>
                    <li>Carbon → 0</li>
                    <li>Fluorine → –</li>
                    <li>Neon → 0</li>
                </ul>

                <p className="font-semibold mb-2">General Patterns:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Metals → positive charge</li>
                    <li>Nonmetals → negative charge</li>
                    <li>Transition metals → variable charges</li>
                    <li>Noble gases → 0 charge</li>
                </ul>

                <p className="font-semibold mb-2">Charge by Group:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Group 1 → +</li>
                    <li>Group 2 → 2+</li>
                    <li>Groups 3–12 → varies</li>
                    <li>Group 13 → 3+</li>
                    <li>Group 14 → 4+ or 0</li>
                    <li>Group 15 → 3–</li>
                    <li>Group 16 → 2–</li>
                    <li>Group 17 → –</li>
                    <li>Group 18 → 0</li>
                </ul>
                <p className="italic text-gray-600">
                    <img src="/4 diagrams ionic charge.gif" alt="4 atom diagrams" height="400" width="300" />
                </p>
            </div>
        </>
    );
}

export function CarbleHardArticle(): Article {

    const learnDefinitions = [
        { term: "Electronegativity", definition: "Measure of how strongly an atom attracts electrons in a bond." },
        { term: "Electron Affinity", definition: "Energy released when an atom gains an electron." },
        { term: "1st Ionization Energy", definition: "Energy required to remove the first electron from a neutral atom." },
        { term: "Atomic Radius", definition: "Approximate size of an atom." },
    ];

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Carble: Periodic Trends</h1>

            <div className="w-full max-w-5xl mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Learn:</h2>
                <ul className="list-disc list-inside">
                    {learnDefinitions.map(ld => <li key={ld.term}><strong>{ld.term}:</strong> {ld.definition}</li>)}
                </ul>
            </div>

        </>
    );
}


export function CarbleEasyLesson(): Lesson {

    return (
        <>
            <div className="w-full max-w-4xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">Play our original game!</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        <strong>Goal</strong> — Find the correct element which is randomly picked as
                        one of the pink elements in the periodic table.
                    </li>
                    <li>
                        <strong>Guess an element</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>8 guesses maximum</li>
                            <li>Click on an element box in the periodic table</li>
                            <li>Use the search bar by selecting an element from the dropdown or by typing an element name or symbol and clicking it</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Access element properties</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Hover your mouse over any element to view its name, atomic number, atomic mass, and ionic charge</li>
                            <li>After you guess an element, its properties will appear in the game table with color hints that help you win</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Reading the game table</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li><span className="text-yellow-600 font-semibold">Yellow cell</span> = the value is close to the correct element’s value</li>
                            <li><span className="text-green-600 font-semibold">Green cell</span> = the value matches the correct element exactly</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    );
}


export function CarbleHardLesson(): Lesson {

    return (
        <>
            <div className="w-full max-w-4xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">Play our original game!</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        <strong>Goal</strong> — Find the correct element which is randomly picked as
                        one of the pink elements in the periodic table.
                    </li>
                    <li>
                        <strong>Guess an element</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>8 guesses maximum</li>
                            <li>Click on an element box in the periodic table</li>
                            <li>Use the search bar by selecting an element from the dropdown or by typing an element name or symbol and clicking it</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Access element properties</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Hover your mouse over any element to view its name, atomic number, atomic mass, and ionic charge</li>
                            <li>After you guess an element, its properties will appear in the game table with color hints that help you win</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Reading the game table</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li><span className="text-yellow-600 font-semibold">Yellow cell</span> = the value is close to the correct element’s value</li>
                            <li><span className="text-green-600 font-semibold">Green cell</span> = the value matches the correct element exactly</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    );
}