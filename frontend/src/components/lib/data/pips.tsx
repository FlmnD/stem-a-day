import CarbleLink from "@/components/ui/StemLink";
import { Article, Lesson } from "@/structures/GameStructures";
import Image from "next/image";

export const EasyArticlePips: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
                <h2 className="text-xl font-bold mb-3">Learn About Molarity & Dilutions!</h2>

                <p className="mb-4">
                    This section covers the core ideas behind <strong>moles, molar mass, volume,
                    molarity, and </strong>. These relationships are essential for solving
                    solution chemistry problems and for succeeding in the Pips Molarity game.
                    You should spend at least <strong>6–7 minutes</strong> reviewing this material
                    before playing.
                </p>

                <h3 className="font-semibold">The Mole (mol)</h3>
                <p className="mb-2">
                    A <strong>mole</strong> is a counting unit used in chemistry, similar to how
                    a dozen means 12. One mole contains
                    <strong> 6.022 × 10²³ particles</strong> (Avogadro’s number).
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>1 mol of NaCl = 6.022 × 10²³ formula units</li>
                    <li>0.5 mol of H₂O = half that many molecules</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/mole.jpg" alt="mole concept diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/The_Basics_of_General_Organic_and_Biological_Chemistry_(Ball_et_al.)/06%3A_Quantities_in_Chemical_Reactions/6.01%3A_The_Mole"
                        text="Learn more about the mole!"
                    />
                </div>

                <h3 className="font-semibold">Molar Mass</h3>
                <p className="mb-2">
                    <strong>Molar mass</strong> is the mass of one mole of a substance,
                    measured in <strong>grams per mole (g/mol)</strong>.
                </p>
                <p className="mb-2 font-mono">
                    molar mass = grams ÷ moles
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>H₂O → 18 g/mol</li>
                    <li>NaCl → 58.44 g/mol</li>
                    <li>CO₂ → 44 g/mol</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/molar-mass.png" alt="molar mass example" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/10%3A_The_Mole/10.03%3A_Molar_Mass"
                        text="Learn more about molar mass!"
                    />
                </div>

                <h3 className="font-semibold">Volume (L)</h3>
                <p className="mb-2">
                    <strong>Volume</strong> measures how much space a solution occupies.
                    In solution chemistry, volume is almost always measured in
                    <strong> liters (L)</strong>.
                </p>
                <p className="mb-2">Key reminders:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>1000 mL = 1 L</li>
                    <li>Volume refers to the total solution, not just the solute</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/volume.png" alt="volume in liters diagram" height={300} width={200} />
                </p>

                <h3 className="font-semibold">Molarity (M)</h3>
                <p className="mb-2">
                    <strong>Molarity</strong> describes the concentration of a solution.
                    It tells you how many moles of solute are dissolved per liter of solution.
                </p>
                <p className="mb-2 font-mono">
                    M = moles ÷ liters
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>2 mol NaCl in 1 L → 2 M</li>
                    <li>0.5 mol glucose in 0.25 L → 2 M</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/molarity.png" alt="molarity formula diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/16%3A_Solutions/16.08%3A_Molarity"
                        text="Learn more about molarity!"
                    />
                </div>

                <h3 className="font-semibold">Dilution</h3>
                <p className="mb-2">
                    <strong>Dilution</strong> occurs when solvent is added to a solution,
                    decreasing its concentration while keeping the number of moles constant.
                </p>
                <p className="mb-2 font-mono">
                    M₁V₁ = M₂V₂
                </p>
                <p className="mb-2">What this means:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>M₁ and V₁ are the initial molarity and volume</li>
                    <li>M₂ and V₂ are the final molarity and volume</li>
                    <li>The amount of solute does not change</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/.png" alt=" equation diagram" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(LibreTexts)/13%3A_Solutions/13.07%3A_Solution_Dilution"
                        text="Learn more about dilution!"
                    />
                </div>

                <h3 className="font-semibold">How These Variables Relate (Game Strategy)</h3>
                <p className="mb-2">
                    All molarity problems - and the Pips Molarity game - rely on understanding
                    how these variables interact.
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Molarity depends on both <strong>moles</strong> and <strong>volume</strong></li>
                    <li>Changing volume affects molarity even if moles stay the same</li>
                    <li>Moles connect mass and molarity through molar mass</li>
                    <li>Dilution keeps moles constant while volume changes</li>
                </ul>

                <p className="font-semibold">
                    Master these relationships, and the tile combinations in the game will
                    make intuitive sense.
                </p>
            </div>
        </>
    );
};

export const HardArticlePips: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
                <h2 className="text-xl font-bold mb-3">Hard Mode: Gas Laws & Variable Relationships</h2>

                <p className="mb-4">
                    This section introduces the <strong>Gas Laws</strong>, which describe how
                    <strong> pressure (P)</strong>, <strong>volume (V)</strong>,
                    <strong> temperature (T)</strong>, and <strong>amount of gas (n)</strong>
                    interact. These laws explain the behavior of gases in real-life situations
                    such as breathing, car tires heating up, and weather balloons.
                    Spend <strong>7–9 minutes</strong> studying this section before starting Hard mode.
                </p>

                <h3 className="font-semibold">What Are Gas Laws?</h3>
                <p className="mb-4">
                    <strong>Gas laws</strong> are mathematical relationships that describe how gases
                    respond when one variable changes while others are held constant.
                    All temperature values <strong>must be in Kelvin (K)</strong>.
                </p>

                <h3 className="font-semibold">Boyle’s Law (Pressure–Volume)</h3>
                <p className="mb-2">
                    <strong>Boyle’s Law</strong> states that pressure and volume are
                    <strong> inversely proportional</strong> when temperature and moles are constant.
                </p>
                <p className="mb-2">
                    Formula: <strong>P₁V₁ = P₂V₂</strong>
                </p>
                <ul className="list-disc ml-6 mb-3">
                    <li>If volume decreases, pressure increases</li>
                    <li>If volume increases, pressure decreases</li>
                </ul>
                <p className="mb-2">
                    <strong>Example:</strong> Pushing a syringe decreases volume and increases pressure.
                </p>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/boyles.jpg" alt="Boyle's Law pressure volume graph" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/14%3A_The_Behavior_of_Gases/14.03%3A_Boyle's_Law"
                        text="Learn more about Boyle’s Law!"
                    />
                </div>

                <h3 className="font-semibold">Charles’s Law (Volume–Temperature)</h3>
                <p className="mb-2">
                    <strong>Charles’s Law</strong> states that volume is
                    <strong> directly proportional</strong> to Kelvin temperature
                    when pressure and moles are constant.
                </p>
                <p className="mb-2">
                    Formula: <strong>V₁ / T₁ = V₂ / T₂</strong>
                </p>
                <ul className="list-disc ml-6 mb-3">
                    <li>If temperature increases, volume increases</li>
                    <li>If temperature decreases, volume decreases</li>
                </ul>
                <p className="mb-2">
                    <strong>Example:</strong> A balloon expands when heated.
                </p>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/charles.jpg" alt="Charles's Law volume temperature graph" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/14%3A_The_Behavior_of_Gases/14.04%3A_Charles's_Law"
                        text="Learn more about Charles’s Law!"
                    />
                </div>

                <h3 className="font-semibold">Gay-Lussac’s Law (Pressure–Temperature)</h3>
                <p className="mb-2">
                    <strong>Gay-Lussac’s Law</strong> states that pressure is
                    <strong> directly proportional</strong> to Kelvin temperature
                    when volume and moles are constant.
                </p>
                <p className="mb-2">
                    Formula: <strong>P₁ / T₁ = P₂ / T₂</strong>
                </p>
                <p className="mb-2">
                    <strong>Example:</strong> A sealed aerosol can increases in pressure when heated.
                </p>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/gaylussac.png" alt="Gay-Lussac's Law pressure temperature graph" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/14%3A_The_Behavior_of_Gases/14.05%3A_Gay-Lussac's_Law"
                        text="Learn more about Gay-Lussac’s Law!"
                    />
                </div>

                <h3 className="font-semibold">Avogadro’s Law (Volume–Moles)</h3>
                <p className="mb-2">
                    <strong>Avogadro’s Law</strong> states that volume is
                    <strong> directly proportional</strong> to the number of moles
                    at constant pressure and temperature.
                </p>
                <p className="mb-2">
                    Formula: <strong>V₁ / n₁ = V₂ / n₂</strong>
                </p>
                <p className="mb-2">
                    <strong>Example:</strong> Adding more gas particles inflates a balloon.
                </p>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/avogadro.png" alt="Avogadro's Law volume moles relationship" height={300} width={200} />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/14%3A_The_Behavior_of_Gases/14.07%3A_Avogadro's_Law"
                        text="Learn more about Avogadro’s Law!"
                    />
                </div>

                <h3 className="font-semibold">Combined Gas Law</h3>
                <p className="mb-2">
                    The <strong>Combined Gas Law</strong> combines Boyle’s, Charles’s,
                    and Gay-Lussac’s Laws into one equation.
                </p>
                <p className="mb-2">
                    Formula: <strong>(P₁V₁) / T₁ = (P₂V₂) / T₂</strong>
                </p>
                <p className="mb-4">
                    Use this law when <strong>moles are constant</strong> and multiple variables change.
                </p>

                <h3 className="font-semibold">Ideal Gas Law</h3>
                <p className="mb-2">
                    The <strong>Ideal Gas Law</strong> describes the behavior of an ideal gas by
                    combining all major variables.
                </p>
                <p className="mb-2">
                    Formula: <strong>PV = nRT</strong>
                </p>
                <ul className="list-disc ml-6 mb-3">
                    <li>P = pressure</li>
                    <li>V = volume</li>
                    <li>n = moles</li>
                    <li>T = temperature (K)</li>
                    <li>R = 0.08206 L·atm/(mol·K)</li>
                </ul>
                <p className="mb-2">
                    Gases behave most ideally at <strong>low pressure</strong> and
                    <strong> high temperature</strong>.
                </p>
                <p className="italic text-gray-600 mb-6">
                    <Image src="/ideal.png" alt="Ideal gas law variables diagram" height={300} width={200} />
                </p>

                <div className="mb-3">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Physical_Properties_of_Matter/States_of_Matter/Properties_of_Gases/Gas_Laws/The_Ideal_Gas_Law"
                        text="Learn more about the Ideal Gas Law!"
                    />
                </div>
            </div>
        </>
    );
}

export const EasyLessonPips: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">
                    Play our original game: Molarity Pips!
                </h2>

                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        The game is played on a concept map grid with colored regions
                    </li>

                    <li>
                        <strong>Goal</strong> - Place each domino onto the region whose gas law it represents
                    </li>

                    <li>
                        <strong>How to Play</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Click a domino in the tray to select it (highlighted in blue)</li>
                            <li>Click a cell on the map to place it - the domino occupies that cell and the next one in its current orientation</li>
                            <li>To return a placed domino to the tray, click it on the map then click empty space in the tray</li>
                        </ul>
                    </li>

                    <li>
                        <strong>Rotating Dominos</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Double-click a domino (in the tray or on the map) to rotate it 90° clockwise</li>
                            <li>Repeat to continue rotating</li>
                            <li>A rotation that would cause overlap or go out of bounds is ignored</li>
                        </ul>
                    </li>

                    <li>
                        <strong>Region Codes</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Each colored region is labeled with a code like <strong>Mo</strong>, <strong>MM</strong>, <strong>Mc</strong>, etc.</li>
                            <li>The letters indicate the formula; for , the number indicates initial (1) or final (2) state</li>
                            <li>Consult the Region Code Key and Full Reference panels on the right</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Win</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Place all dominos so each one exactly covers its matching region</li>
                            <li>Press <strong>Check Solution</strong> - it activates once every domino is placed</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Start / Restart the Game</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Press <strong>New Game</strong> to generate a fresh puzzle at any time</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    );
};

export const HardLessonPips: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">
                    Play our original game: Gas Laws Pips!
                </h2>

                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        The game is played on a concept map grid with colored regions
                    </li>

                    <li>
                        <strong>Goal</strong> - Place each domino onto the region whose gas law it represents
                    </li>

                    <li>
                        <strong>How to Play</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Click a domino in the tray to select it (highlighted in blue)</li>
                            <li>Click a cell on the map to place it - the domino occupies that cell and the next one in its current orientation</li>
                            <li>To return a placed domino to the tray, click it on the map then click empty space in the tray</li>
                        </ul>
                    </li>

                    <li>
                        <strong>Rotating Dominos</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Double-click a domino (in the tray or on the map) to rotate it 90° clockwise</li>
                            <li>Repeat to continue rotating</li>
                            <li>A rotation that would cause overlap or go out of bounds is ignored</li>
                        </ul>
                    </li>

                    <li>
                        <strong>Region Codes</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Each colored region is labeled with a code like <strong>Bo1</strong>, <strong>Ch2</strong>, <strong>GL1</strong>, etc.</li>
                            <li>The letters indicate the gas law; the number indicates initial (1) or final (2) state</li>
                            <li>Consult the Region Code Key and Full Gas Law Reference panels on the right</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Win</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Place all dominos so each one exactly covers its matching region</li>
                            <li>Press <strong>Check Solution</strong> - it activates once every domino is placed</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Start / Restart the Game</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Press <strong>New Game</strong> to generate a fresh puzzle at any time</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    );
};