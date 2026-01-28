import CarbleLink from "@/components/ui/StemLink";
import { Article, Lesson } from "@/structures/GameStructures";
import Image from "next/image";

export const CarbleEasyArticle: Article = () => {
    return (
        <>

            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
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
                <div className="mb-7 mt-3">
                    <CarbleLink url="https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Atomic_Theory/The_Atom" text="Learn more about atoms and elements!"></CarbleLink>
                </div>

                <p className="italic text-gray-600 mb-4">
                    <Image src="/atomic and mass number.jpg" alt="atomic and mass number example" height={300} width={200} />
                </p>

                <h3 className="font-semibold">Atomic Number</h3>
                <p className="mb-2">
                    The <strong>atomic number</strong> is the number of protons in an atom.
                    On the periodic table, assume protons ≈ electrons ≈ neutrons (simplified model).
                    The atomic number increases by one as one proton is added to create the next element on the periodic table.
                    An element is defined by there number of protons it has. One proton is always a Hydrogen atom. Two protons is always a Helium atom and so on.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Hydrogen: 1</li>
                    <li>Helium: 2</li>
                    <li>Carbon: 6</li>
                </ul>
                <p className="mb-4">
                    It <strong>increases by one</strong> as you move left → right <strong>across a period</strong>
                    and <strong> increases dramatically</strong> as you move top → bottom <strong> down a group</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <Image src="/4 protons diagram.png" alt="atom diagram example" height={300} width={200} />
                </p>

                <h3 className="font-semibold">Atomic Mass</h3>
                <p className="mb-2">
                    Atomic mass (or mass number) is the mass of an atom.
                    Mass number should increase by about 1-3 amu for each proceeding element to account for an additional proton and neutron (and practically weightless electron).
                    (Be aware that the periodic table is an average based on the probability of atoms for each element, so <strong>values will vary from theoretical</strong> and experimental values.)
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
                    It <strong>increases</strong> as you move left → right <strong>across a period</strong>
                    and <strong>increases dramatically</strong> as you move top → bottom <strong>down a group</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <Image src="/the structure of atom.jpg" alt="the structure of atom diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink url="https://chem.libretexts.org/Courses/Furman_University/CHM101%3A_Chemistry_and_Global_Awareness_(Gordon)/03%3A_Atoms_and_the_Periodic_Table/3.04%3A_Atomic_Mass_and_Atomic_Number" text="Learn more about atomic mass and atomic number!"></CarbleLink>
                </div>

                <h3 className="font-semibold">Ionic Charge</h3>
                <p className="mb-2">
                    The <strong>ionic charge</strong> is the charge an atom gets when it loses or gains electrons.
                    Charge is only depends on how many valence (outermost) electrons an atom originally has.
                    It can then lose all those electrons or gain more electrons in order to have a full valence shell (typically of 8 electrons but 2 for H and He).
                </p>
                <p className="mb-3 italic text-gray-700">Reminder: electrons have a negative charge!</p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Hydrogen: +</li>
                    <li>Carbon: 0</li>
                    <li>Fluorine: –</li>
                    <li>Neon: 0</li>
                </ul>
                <p className="font-semibold mb-2">General Patterns:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Metals: positive charge</li>
                    <li>Nonmetals: negative charge</li>
                    <li>Transition metals: variable charges</li>
                    <li>Noble gases: 0 charge</li>
                </ul>
                <p className="font-semibold mb-2">Charge by Group:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Group 1: +</li>
                    <li>Group 2: 2+</li>
                    <li>Groups 3–12: varies</li>
                    <li>Group 13: 3+</li>
                    <li>Group 14: 4+ or 0</li>
                    <li>Group 15: 3–</li>
                    <li>Group 16: 2–</li>
                    <li>Group 17: –</li>
                    <li>Group 18: 0</li>
                </ul>
                <p className="italic text-gray-600">
                    <Image src="/4 diagrams ionic charge.gif" alt="4 atom diagrams" height={400} width={300} />
                </p>
                <div className="mb-7 mt-5">
                    <CarbleLink url="https://chem.libretexts.org/Courses/Portland_Community_College/CH151%3A_Preparatory_Chemistry/06%3A_Ions_Ionic_Bonding_and_the_Nomenclature_of_Ionic_Compounds/6.01%3A_Ions" text="Learn more about ions and ionic charge!"></CarbleLink>
                </div>
            </div>
        </>
    );
}

export const CarbleHardArticle: Article = () => {

    return (
        <>

            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
                <h2 className="text-xl font-bold mb-3">Learn About the Essentials!</h2>

                <p className="mb-4">
                    Learn about elements, atoms, electronegativity, ionization energy, and atomic radius here!
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
                <ul className="list-disc ml-6">
                    <li>Positive <strong>protons</strong></li>
                    <li>Negative <strong>electrons</strong></li>
                    <li>Neutral <strong>neutrons</strong></li>
                </ul>
                <div className="mb-7 mt-3">
                    <CarbleLink url="https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Atomic_Theory/The_Atom" text="Learn more about atoms and elements!"></CarbleLink>
                </div>

                <h3 className="font-semibold">Atomic Radius</h3>
                <p className="mb-2">
                    Atomic radius (similar to ionic radius) is the distance between the nucleus and valence (outermost) shell of an atom. It is the approximate size of an atom.
                    As more protons are added to the nucleus to create new elements, forces between the nucleus and electrons are strengthened due to opposite charge attractions, pulling electrons closer into the atom and reducing the atomic radius.
                    But atoms with more electron shells have larger atomic radii because the outermost shell is farther from the nucleus.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Hydrogen: 53</li>
                    <li>Sodium: 190</li>
                    <li>Carbon: 67</li>
                </ul>
                <p className="mb-4">
                    It <strong>decreases</strong> as you move left → right <strong>across a period</strong>
                    and <strong>increases</strong> as you move top → bottom <strong>down a group</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <Image src="https://general.chemistrysteps.com/wp-content/uploads/2023/11/Atomic-Radius-and-periodic-table.png" alt="Atomic Radius Diagram" height={500} width={300} />
                </p>

                <h3 className="font-semibold">(1st) Ionization Energy</h3>
                <p className="mb-2">
                    The <strong>ionization energy</strong> is the energy is takes to <strong>remove an electron</strong> from a neutral atom.
                    There are multiple ionization energies for each atom, but we will only focus on the first ionization energy. This is the energy it takes to remove the FIRST electron. Second refers to the next electron removed and so on.
                    As more protons are added to the nucleus to create new elements, forces between increased electrons and the nucleus strengthen due to opposite charge attractions, increasing ionization energy, the energy needed to break these forces.
                    But atoms with more electron shells have lower ionization energies because the outermost shell is farther from the nucleus, weakening these forces.
                    Examples:
                </p>
                <p className="mb-3 italic text-gray-700">Note: Noble gases (group 18) have super high ionization energies because they want to keep and not lose ANY electrons from their full valence shell! </p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Hydrogen: 1312</li>
                    <li>Helium: 2372.3</li>
                    <li>Carbon: 1086.5</li>
                    <li>Neon: 2080.7</li>
                </ul>
                <p className="mb-4">
                    It <strong>increases dramatically</strong> as you move left → right <strong> across a period </strong>
                    and <strong>decreases</strong> as you move top → bottom <strong> down a group</strong>.
                </p>
                <p className="italic text-gray-600">
                    <Image src="https://media.geeksforgeeks.org/wp-content/uploads/20230310125901/ionization-energy-trend.png" alt="First Ionization Energy Diagram" height={500} width={350} />
                </p>

                <h3 className="font-semibold mt-5">Electronegativity</h3>
                <p className="mb-2">
                    The <strong>electronegativity</strong> is a measure of how well an atom attracts electrons. It is the strength of attraction forces between external electrons and the nucleus of an atom.
                    As more protons are added to the nucleus to create new elements, forces between the nucleus and electrons are strengthened due to opposite charge attractions, more easily attracting electrons to join the atom and increasing electronegativity.
                    But atoms with more electron shells have less electronegativity because the force of attraction of the nucleus is less effective on electrons farther away, outside the many electron shells of an atom.
                    (Fun and common fact: Flourine is the most electronegative element!)
                </p>
                <p className="mb-3 italic text-gray-700">Note: Noble gases (group 18) do not have electronegativities! They want to keep their full valence shell, not attract new electrons. </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Hydrogen: 2.2</li>
                    <li>Helium: null</li>
                    <li>Carbon: 2.55</li>
                    <li>Flourine: 3.98</li>
                </ul>
                <p className="mb-4">
                    It <strong>increases dramatically</strong> as you move left → right <strong>across a period </strong>
                    and <strong>decreases</strong> as you move top → bottom <strong>down a group</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <Image src="https://media.geeksforgeeks.org/wp-content/uploads/20231207124854/Periodic-Table-Electronegativity-1.png" alt="Electronegativity Diagram" height={500} width={300} />
                </p>
                <div className="mb-7 mt-3">
                    <CarbleLink url="https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Supplemental_Modules_and_Websites_(Inorganic_Chemistry)/Descriptive_Chemistry/Periodic_Trends_of_Elemental_Properties/Periodic_Trends" text="Learn more about atomic radius, electronegativity, 1st ionization energy, and other periodic trends!"></CarbleLink>
                </div>
            </div>
        </>
    );
}


export const CarbleEasyLesson: Lesson = () => {

    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow">
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
                            <li>Hover your mouse over any element to view its name, symbol, atomic number, atomic mass, and ionic charge</li>
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


export const CarbleHardLesson: Lesson = () => {

    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">Play our original game!</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        <strong>Goal</strong> — Find the correct element which is randomly picked as
                        one of the pink elements in the periodic table.
                    </li>
                    <li>
                        <strong>Guess an element</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>16 guesses maximum</li>
                            <li>Click on an element box in the periodic table</li>
                            <li>Use the search bar by selecting an element from the dropdown or by typing an element name or symbol and clicking it</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Access element properties</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Hover your mouse over any element to view its name, symbol, electronegativity, ionization energy, and atomic radius</li>
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