
import CarbleLink from "@/components/ui/StemLink";
import { Article, Lesson } from "@/structures/GameStructures";
import Image from "next/image";

export const RailboundEasyArticle: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6 dark:bg-slate-950/60 dark:border dark:border-slate-800 dark:text-slate-200">
                <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                    Learn About Dimensional Analysis & The Mole!
                </h2>
                <p className="mb-4 text-slate-700 dark:text-slate-200">
                    Learn about molar mass, Avogadro's number, unit conversions, and multi-step dimensional analysis here!
                    These concepts are essential for converting between grams, moles, molecules, atoms, and liters.
                    You should spend at least <strong>6–7 minutes</strong> reviewing this information before playing.
                    <strong> Take your time — it will help you succeed!</strong>
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Dimensional Analysis</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    <strong>Dimensional analysis</strong> is a method of converting between units by multiplying by
                    <strong> conversion factors</strong> — fractions where the numerator and denominator are equal
                    quantities in different units. Units cancel like variables in algebra.
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">General form:</p>
                <p className="mb-2 font-mono text-slate-800 dark:text-slate-200">
                    given quantity × (desired unit / given unit) = answer in desired unit
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">Example:</p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>36 g H₂O × (1 mol / 18 g) = 2 mol H₂O</li>
                </ul>
                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/01%3A_Introduction_-_Matter_and_Measurement/1.06%3A_Dimensional_Analysis"
                        text="Learn more about dimensional analysis!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">The Mole & Avogadro's Number</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    A <strong>mole (mol)</strong> is a counting unit equal to <strong>6.022 × 10²³</strong> particles
                    (atoms, molecules, ions, etc.). This value is called <strong>Avogadro's number</strong>.
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">Conversion factors:</p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>mol → molecules: × 6.022 × 10²³</li>
                    <li>molecules → mol: ÷ 6.022 × 10²³</li>
                    <li>mol → atoms: × 6.022 × 10²³</li>
                </ul>
                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/03%3A_Stoichiometry-_Chemical_Formulas_and_Equations/3.04%3A_Avogadro's_Number_and_the_Mole"
                        text="Learn more about the mole and Avogadro's number!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Molar Mass</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    <strong>Molar mass</strong> is the mass of one mole of a substance, expressed in <strong>g/mol</strong>.
                    It equals the sum of the atomic masses of all atoms in the formula.
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">Examples:</p>
                <ul className="list-disc ml-6 mb-3 text-slate-700 dark:text-slate-200">
                    <li>H₂O: 2(1.008) + 16.00 = <strong>18.02 g/mol</strong></li>
                    <li>NaCl: 22.99 + 35.45 = <strong>58.44 g/mol</strong></li>
                    <li>CO₂: 12.01 + 2(16.00) = <strong>44.01 g/mol</strong></li>
                </ul>
                <p className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Conversion factors:</p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>g → mol: divide by molar mass (1 mol / MM g)</li>
                    <li>mol → g: multiply by molar mass (MM g / 1 mol)</li>
                </ul>
                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/General_Chemistry/ChemPRIME_(Moore_et_al.)/02%3A_Atoms_Molecules_and_Chemical_Reactions/2.11%3A_The_Molar_Mass"
                        text="Learn more about molar mass!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Molar Volume at STP</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    At <strong>STP (Standard Temperature and Pressure)</strong>, one mole of any ideal gas occupies
                    exactly <strong>22.4 liters</strong>. This gives two conversion factors for gases:
                </p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>mol → L (STP): × 22.4 L/mol</li>
                    <li>L (STP) → mol: ÷ 22.4 L/mol</li>
                </ul>
                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/Chabot_College/Introduction_to_General_Organic_and_Biochemistry/08%3A_Gases/8.09%3A_Avogadros_Law_-_The_Relation_between_Volume_and_Molar_Amount"
                        text="Learn more about molar volume at STP!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Density Conversions</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    <strong>Density</strong> (g/mL) connects volume to mass and can be used as a conversion factor
                    in multi-step problems.
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">Example — mL → g → mol:</p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>50.0 mL × (0.789 g / 1 mL) = 39.45 g</li>
                    <li>39.45 g × (1 mol / 46.07 g) = 0.856 mol ethanol</li>
                </ul>
                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry_(CK-12)/03%3A_Measurements/3.11%3A_Density"
                        text="Learn more about density!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Atoms of an Element in a Compound</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    To find the number of atoms of a specific element, use the <strong>subscript</strong> from the
                    formula as a conversion factor between moles of compound and moles of element.
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">Example — g H₂O → atoms H (3 steps):</p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>18.02 g × (1 mol H₂O / 18.02 g) = 1 mol H₂O</li>
                    <li>1 mol H₂O × (2 mol H / 1 mol H₂O) = 2 mol H</li>
                    <li>2 mol H × (6.022×10²³ atoms / 1 mol) = 1.204×10²⁴ atoms H</li>
                </ul>
                <div className="mb-7">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/Valley_City_State_University/Chem_121/Chapter_3%3A_Mass_Relationships_in_Chemical_Reactions/3.3%3A_The_Mole_and_Chemical_Formulas"
                        text="Learn more about moles and chemical formulas!"
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Grams of an Element in a Compound</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    To find the mass of a specific element, extend the atom-counting pathway one more step:
                    convert mol of element to grams using the element's molar mass.
                </p>
                <p className="mb-2 text-slate-700 dark:text-slate-200">Example — 50.0 g Fe₂O₃ → g Fe (3 steps):</p>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>50.0 g × (1 mol Fe₂O₃ / 159.69 g) = 0.313 mol Fe₂O₃</li>
                    <li>0.313 mol Fe₂O₃ × (2 mol Fe / 1 mol Fe₂O₃) = 0.626 mol Fe</li>
                    <li>0.626 mol Fe × (55.85 g / 1 mol Fe) = 34.96 g Fe</li>
                </ul>
                <div className="mb-3">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/Oregon_Institute_of_Technology/OIT%3A_CHE_201_-_General_Chemistry_I_(Anthony_and_Clark)/Unit_4%3A_Quantifying_Chemicals/4.2%3A_Formula_Mass%2C_Percent_Composition%2C_and_the_Mole"
                        text="Learn more about composition and mole calculations!"
                    />
                </div>
            </div>
        </>
    );
};

export const RailboundHardArticle: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6 dark:bg-slate-950/60 dark:border dark:border-slate-800 dark:text-slate-200">
                <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                    Hard Mode: Stoichiometry
                </h2>
                
                <p className="mb-4 text-slate-700 dark:text-slate-200">
                    Stoichiometry is how you calculate amounts in chemical reactions using
                    <strong> balanced equations, mole ratios, and conversions</strong>.
                    In this game, you’ll connect steps like <strong>grams → moles → mole ratio → grams</strong>.
                    Spend at least <strong>6–7 minutes</strong> reviewing — this is exactly what the game tests!
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    What is Stoichiometry?
                </h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    <strong>Stoichiometry</strong> is the calculation of amounts in a chemical reaction.
                    It uses a <strong>balanced equation</strong> to relate reactants and products using
                    <strong> mole ratios</strong>.
                </p>

                <div className="mb-4">
                    <Image src="/stoichm.jpg" alt="stoichiometry molecules" height={300} width={200} />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Step 1: Balance the Equation
                </h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    A balanced equation shows the correct ratios of substances. Atoms must be equal on both sides.
                </p>

                <p className="font-mono mb-3 text-slate-800 dark:text-slate-200">
                    2H₂ + O₂ → 2H₂O
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Step 2: Convert to Moles
                </h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    Convert grams → moles using molar mass.
                </p>

                <p className="font-mono mb-3 text-slate-800 dark:text-slate-200">
                    g × (1 mol / molar mass)
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Step 3: Use Mole Ratio (KEY STEP)
                </h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    Use coefficients from the balanced equation to convert between substances.
                    This is what connects reactants to products.
                </p>

                <p className="font-mono mb-3 text-slate-800 dark:text-slate-200">
                    mol A × (mol B / mol A)
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Step 4: Convert to Final Units
                </h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    Convert moles → grams, liters, or particles depending on the question.
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Full Example (Mass → Mass)
                </h3>

                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>10.0 g H₂ → ? g H₂O</li>
                    <li>Step 1: Convert to moles</li>
                    <li>Step 2: Apply mole ratio</li>
                    <li>Step 3: Convert back to grams</li>
                    <li>Answer: 89.4 g H₂O</li>
                </ul>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Quick Strategy (for the Game)
                </h3>
                <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-slate-200">
                    <li>Always go through <strong>moles</strong></li>
                    <li>Use the <strong>balanced equation ratio</strong> in the middle</li>
                    <li>Cancel units every step</li>
                    <li>Think: START → MOLES → RATIO → END</li>
                </ul>

                <div className="mb-6">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Supplemental_Modules_and_Websites_(Inorganic_Chemistry)/Chemical_Reactions/Stoichiometry_and_Balancing_Reactions"
                        text="Learn more about stoichiometry and balancing reactions!"
                    />
                </div>

                <div className="mb-3">
                </div>
            </div>
        </>
    );
};

export const RailboundEasyLesson: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow dark:bg-slate-950/60 dark:border dark:border-slate-800">
                <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                    Play our original game: Railbound Dimensional Analysis!
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-200">
                    <li><strong>Goal</strong></li>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1"><li>Place the correct conversion factor cards on the track slots to guide the train from the START station to the DEST station.</li></ul>
                    <li><strong>Select a card</strong> from the tray on the right, then click an empty slot on the map to place it. Click a placed card with nothing selected to return it to the tray.</li>
                    <li><strong>Check Solution</strong></li>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1"><li>Once all slots are filled, press Check Solution. The train animates through the route and stops at any wrong conversion factor.</li></ul>
                    <li><strong>Hints</strong></li>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1"><li>Available but cost you your streak progress.</li></ul>
                    <li>
                        <strong>To Win</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Solve a 3-step conversion problem correctly.</li>
                            <li>Work your way up: master single-step, then double-step, then triple-step problems.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Streak & Tiers</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Build a streak of consecutive correct answers to advance to harder tiers.</li>
                            <li>A wrong answer drops you back one tier. Get one correct to return.</li>
                        </ul>
                    </li>
                    <li><strong>Reward</strong></li>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1"><li>Earn glucose upon your first correct triple-step answer.</li></ul>
                </ul>
            </div>
        </>
    );
};

export const RailboundHardLesson: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow dark:bg-slate-950/60 dark:border dark:border-slate-800">
                <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                    Play our original game: Railbound Stoichiometry!
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-200">

                    <li><strong>Goal</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Build a correct stoichiometry path from START to TARGET.</li>
                    </ul>

                    <li><strong>How it works</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Cards are conversion steps (g, mol, ratios).</li>
                        <li>Arrange so units cancel correctly.</li>
                    </ul>

                    <li><strong>Core path</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>grams → moles → mole ratio → moles → grams</li>
                    </ul>

                    <li><strong>Controls</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Click card then slot to place. Click again to remove.</li>
                    </ul>

                    <li><strong>Check</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Train follows path. Stop = wrong step. Finish = correct.</li>
                    </ul>

                    <li><strong>Hints</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Shows next step but resets streak.</li>
                    </ul>

                    <li><strong>Win</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Complete full conversion chains correctly.</li>
                    </ul>

                    <li><strong>Progress</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Streak unlocks harder levels. Mistakes lower level.</li>
                    </ul>

                    <li><strong>Tips</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Always go through moles.</li>
                        <li>Use balanced equation for mole ratios.</li>
                        <li>Check unit cancellation.</li>
                    </ul>

                    <li><strong>Reward</strong></li>
                    <ul className="ml-6 list-disc">
                        <li>Earn rewards for advanced reactions.</li>
                    </ul>

                </ul>
            </div>
        </>
    );
};