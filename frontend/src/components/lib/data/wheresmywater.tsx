import CarbleLink from "@/components/ui/StemLink";
import { Article, Lesson } from "@/structures/GameStructures";
import Image from "next/image";

export const WheresMyWaterEasyArticle: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6 dark:bg-slate-950/60 dark:border dark:border-slate-800 dark:text-slate-200">
                <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                    Learn About Electron Configuration!
                </h2>

                <p className="mb-4 text-slate-700 dark:text-slate-200">
                    Learn about orbitals, electron filling order, Hund's rule, the Aufbau principle,
                    and noble gas shorthand here! These concepts are essential for understanding
                    how electrons are arranged in atoms.
                    You should spend at least <strong>6–7 minutes</strong> reviewing this information before playing.
                    <strong> Take your time — it will help you succeed!</strong>
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Electron Configuration</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    An <strong>electron configuration</strong> shows how electrons are arranged
                    in an atom's <strong>orbitals and subshells</strong>.
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">Examples:</p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>H : 1s¹</li>
                    <li>O : 1s² 2s² 2p⁴</li>
                    <li>Na : 1s² 2s² 2p⁶ 3s¹</li>
                </ul>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/electron-config-chart.jpg" alt="electron configuration examples" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Quantum_Mechanics/10%3A_Multi-electron_Atoms/Electron_Configuration"
                        text="Learn more about electron configurations!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Energy Levels & Subshells</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    Electrons are organized into <strong>energy levels</strong> and
                    <strong> subshells</strong>.
                    The main subshells are <strong>s, p, d,</strong> and <strong>f</strong>.
                </p>

                <p className="mb-2 text-slate-700 dark:text-slate-200">Maximum electrons:</p>

                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>s subshell → 2 electrons</li>
                    <li>p subshell → 6 electrons</li>
                    <li>d subshell → 10 electrons</li>
                    <li>f subshell → 14 electrons</li>
                </ul>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/subshells.png" alt="s p d f subshell diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/The_Basics_of_General_Organic_and_Biological_Chemistry_(Ball_et_al.)/02%3A_Elements_Atoms_and_the_Periodic_Table/2.06%3A_Arrangements_of_Electrons"
                        text="Learn more about subshells and orbitals!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Aufbau Principle</h3>

                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    The <strong>Aufbau principle</strong> states that electrons fill the
                    <strong> lowest-energy orbitals first</strong>.
                </p>

                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    Filling order:
                </p>

                <p className="font-mono mb-4 text-slate-800 dark:text-slate-200">
                    1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p
                </p>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/aufbau.png" alt="aufbau filling order diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/05%3A_Electrons_in_Atoms/5.15%3A_Aufbau_Principle"
                        text="Learn more about the Aufbau principle!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Pauli Exclusion Principle</h3>

                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    The <strong>Pauli exclusion principle</strong> states that an orbital can hold
                    a maximum of <strong>2 electrons</strong>, and they must have
                    <strong> opposite spins</strong>.
                </p>

                <p className="mb-2 text-slate-700 dark:text-slate-200">Examples:</p>

                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>1s¹ is allowed</li>
                    <li>1s² is allowed</li>
                    <li>1s³ is impossible</li>
                </ul>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/pauli.png" alt="pauli exclusion principle diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Electronic_Structure_of_Atoms_and_Molecules/Electronic_Configurations/Pauli_Exclusion_Principle"
                        text="Learn more about the Pauli exclusion principle!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Hund's Rule</h3>

                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    <strong>Hund's rule</strong> states that electrons fill equal-energy orbitals
                    <strong> one at a time before pairing up</strong>.
                </p>

                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    This mainly affects <strong>p</strong> and <strong>d</strong> subshells.
                </p>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/hunds-rule.png" alt="hunds rule orbital diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Electronic_Structure_of_Atoms_and_Molecules/Electronic_Configurations/Hund's_Rules"
                        text="Learn more about Hund's rule!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Orbital Notation</h3>

                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    <strong>Orbital notation</strong> uses boxes or lines to represent orbitals
                    and arrows to represent electrons.
                </p>

                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    Opposite arrows mean opposite electron spins.
                </p>

                <p className="font-mono mb-4 text-slate-800 dark:text-slate-200">
                    ↑↓    ↑    ↑
                </p>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/orbital-notation.png" alt="orbital notation example" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Electronic_Structure_of_Atoms_and_Molecules/Atomic_Orbitals"
                        text="Learn more about orbital notation!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Noble Gas Shorthand</h3>

                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    <strong>Noble gas shorthand</strong> replaces filled inner shells with
                    the symbol of a noble gas in brackets.
                </p>

                <p className="mb-2 text-slate-700 dark:text-slate-200">Examples:</p>

                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>Na : [Ne] 3s¹</li>
                    <li>Ca : [Ar] 4s²</li>
                    <li>Cl : [Ne] 3s² 3p⁵</li>
                </ul>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/noble-gas.jpg" alt="noble gas shorthand examples" height={300} width={200} />
                </p>

                <div className="mb-3">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/Fullerton_College/Beginning_Chemistry_(Chan)/04%3A_Electronic_Structure/4.14%3A_Noble_Gas_Configuration"
                        text="Learn more about noble gas shorthand!"
                    />
                </div>
            </div>
        </>
    );
};

export const WheresMyWaterHardArticle: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto mb-8 rounded-lg bg-white p-4 text-sm leading-6 shadow dark:border dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
                <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                    Learn About Net Ionic Equations!
                </h2>

                <p className="mb-4 text-slate-700 dark:text-slate-200">
                    Learn about precipitation reactions, spectator ions, complete ionic equations,
                    and net ionic equations here! These concepts are essential for understanding
                    reactions in aqueous solutions and predicting when solids form.
                    You should spend at least <strong>6–7 minutes</strong> reviewing this information before playing.
                    <strong> Take your time — it will help you succeed!</strong>
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Aqueous Solutions</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    An <strong>aqueous solution</strong> contains substances dissolved in
                    <strong> water</strong>. In equations, aqueous substances are labeled
                    <strong> (aq)</strong>.
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">Examples:</p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>NaCl(aq)</li>
                    <li>AgNO₃(aq)</li>
                    <li>HCl(aq)</li>
                </ul>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/aqueous.png" alt="aqueous solution diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/University_of_Arkansas_Little_Rock/Chem_1402%3A_General_Chemistry_1_(Belford)/Text/04%3A_Chemical_Reactions/4.04%3A_Aqueous_Reactions"
                        text="Learn more about aqueous reactions!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Precipitation Reaction</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    A <strong>precipitation reaction</strong> occurs when two aqueous ionic compounds react
                    to form an <strong>insoluble solid</strong> called a
                    <strong> precipitate</strong>.
                </p>

                <p className="mb-2 font-mono text-slate-800 dark:text-slate-200">
                    AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)
                </p>

                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    In this reaction, <strong>AgCl</strong> is insoluble and forms the precipitate.
                </p>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/precipitate.png" alt="precipitation reaction diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Supplemental_Modules_and_Websites_(Inorganic_Chemistry)/Descriptive_Chemistry/Main_Group_Reactions/Reactions_in_Aqueous_Solutions/Precipitation_Reactions"
                        text="Learn more about precipitation reactions and solubility!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Complete Ionic Equation</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    A <strong>complete ionic equation</strong> shows all strong electrolytes
                    separated into their ions.
                </p>

                <p className="mb-2 font-mono text-slate-800 dark:text-slate-200">
                    Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + Cl⁻(aq) → AgCl(s) + Na⁺(aq) + NO₃⁻(aq)
                </p>

                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    Solids like <strong>AgCl(s)</strong> stay together because they are not dissolved in water.
                </p>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/complete ionic.jpg" alt="complete ionic equation example" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Beginning_Chemistry_(Ball)/04%3A_Chemical_Reactions_and_Equations/4.04%3A_Ionic_Equations_-_A_Closer_Look"
                        text="Learn more about complete ionic equations!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Spectator Ion</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    A <strong>spectator ion</strong> is an ion that appears on both sides of the equation
                    and does <strong>not participate</strong> in the reaction.
                </p>

                <p className="mb-2 text-slate-700 dark:text-slate-200">Examples:</p>

                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>Na⁺</li>
                    <li>NO₃⁻</li>
                </ul>

                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    Spectator ions are canceled out when writing the net ionic equation.
                </p>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/spectator ion.png" alt="spectator ion example" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/Chippewa_Valley_Technical_College/CVTC_Basic_Chemistry/07%3A_Solutions/7.17%3A_Net_Ionic_Equations"
                        text="Learn more about spectator ions!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Net Ionic Equation</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    A <strong>net ionic equation</strong> only shows the ions and compounds
                    that directly participate in the reaction.
                </p>

                <p className="mb-2 font-mono text-slate-800 dark:text-slate-200">
                    Ag⁺(aq) + Cl⁻(aq) → AgCl(s)
                </p>

                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    The spectator ions were removed, leaving only the species that formed the precipitate.
                </p>

                <p className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    Steps for Writing Net Ionic Equations:
                </p>

                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>Write the balanced molecular equation</li>
                    <li>Split strong electrolytes into ions</li>
                    <li>Identify spectator ions</li>
                    <li>Cancel spectator ions on both sides</li>
                    <li>Write the remaining species as the net ionic equation</li>
                </ul>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/net ionic.png" alt="net ionic equation steps" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/16%3A_Solutions/16.18%3A_Net_Ionic_Equations"
                        text="Practice writing net ionic equations!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Acid-Base Net Ionic Equations</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    Net ionic equations can also describe <strong>acid-base reactions</strong>.
                    In many neutralization reactions, hydrogen ions react with hydroxide ions to form water.
                </p>

                <p className="mb-2 font-mono text-slate-800 dark:text-slate-200">
                    H⁺(aq) + OH⁻(aq) → H₂O(l)
                </p>

                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    This is one of the most common net ionic equations in chemistry.
                </p>

                <p className="italic text-gray-600 mb-6 dark:text-slate-400">
                    <Image src="/acid base net ionic.png" alt="acid base neutralization reaction" height={300} width={200} />
                </p>

                <div className="mb-3">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/21%3A_Acids_and_Bases/21.16%3A_Neutralization_Reaction_and_Net_Ionic_Equations_for_Neutralization_Reactions"
                        text="Learn more about acid-base net ionic equations!"
                    />
                </div>
            </div>
        </>
    );
};

export const WheresMyWaterEasyLesson: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 rounded shadow bg-white p-4 dark:border dark:border-slate-800 dark:bg-slate-950/60">
                <h2 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    Play Where's My Water?: Electron Configuration
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-200">
                    <li>
                        <strong>Goal:</strong> collect every orbital duck in the correct electron-filling order and then
                        send enough droplets into the alligator tub to clear the level.
                    </li>
                    <li>
                        <strong>Dig the path:</strong> click or drag through the dirt to carve tunnels. The map starts
                        as natural dirt, not a prebuilt grid path.
                    </li>
                    <li>
                        <strong>Start the flow:</strong> once your tunnel is ready, press <strong>Start Flow</strong> to
                        release a small stream of electron droplets.
                    </li>
                    <li>
                        <strong>Collect ducks in exact order:</strong> ducks are labeled as placements like
                        <strong> 1s1</strong>, <strong>1s2</strong>, <strong>2s1</strong>, and so on. If water hits the
                        wrong duck first, that droplet is rejected.
                    </li>
                    <li>
                        <strong>Watch the water behavior:</strong> droplets can pool in grooves, slip sideways, keep
                        moving through carved tunnels, or fall off the screen if the route is bad.
                    </li>
                    <li>
                        <strong>Fill the tub:</strong> collecting the ducks is not enough by itself. Enough droplets
                        must still make it into the bathtub after the duck sequence is complete.
                    </li>
                    <li>
                        <strong>Reset keeps the same layout:</strong> resetting clears the dug path and restarts the
                        water attempt, but it does not reroll the ducks or the tub position for that level.
                    </li>
                    <li>
                        <strong>Reward:</strong> finish all five element levels to earn glucose.
                    </li>
                </ul>
            </div>
        </>
    );
};

export const WheresMyWaterHardLesson: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 rounded shadow bg-white p-4 dark:border dark:border-slate-800 dark:bg-slate-950/60">
                <h2 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    Play Where's My Water?: Net Ionic Equations
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-200">
                    <li>
                        <strong>Goal:</strong> collect the ions that belong in the net ionic equation, avoid the
                        spectator ions, and still send enough water into the precipitate tub to finish the level.
                    </li>
                    <li>
                        <strong>Dig the path:</strong> carve tunnels through the dirt so the droplets can reach the
                        ions you want in the right order.
                    </li>
                    <li>
                        <strong>Collect only reacting ions:</strong> each ion marker is either reactive or a
                        spectator. Spectators should cancel out of the net ionic equation, so hitting them wastes the
                        run.
                    </li>
                    <li>
                        <strong>Respect coefficients:</strong> if the equation needs repeated ions like
                        <strong> I-</strong> or <strong>OH-</strong>, you have to collect every copy in sequence.
                    </li>
                    <li>
                        <strong>Finish the reaction:</strong> collecting the right ions is not enough by itself.
                        Enough water still has to make it into the bathtub to represent forming the precipitate.
                    </li>
                    <li>
                        <strong>Reward:</strong> finish every precipitation level to earn glucose.
                    </li>
                </ul>
            </div>
        </>
    );
};


