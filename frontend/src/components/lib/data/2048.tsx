import CarbleLink from "@/components/ui/StemLink";
import { Article, Lesson } from "@/structures/GameStructures";

export const EasyArticle2048: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
                <h2 className="text-xl font-bold mb-3">Learn About Chemical Bonding & Compounds!</h2>

                <p className="mb-4">
                    Learn about ions, molecules, ionic compounds, acids, bases, and hydrocarbons here!
                    These concepts are essential for understanding how substances form and react.
                    You should spend at least <strong>6–7 minutes</strong> reviewing this information before playing.
                    <strong> Take your time — it will help you succeed!</strong>
                </p>

                <h3 className="font-semibold">Ion</h3>
                <p className="mb-2">
                    An <strong>ion</strong> is an atom or molecule with an <strong>overall net positive or negative charge</strong>
                    caused by <strong>losing or gaining electron(s)</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Na⁺</li>
                    <li>Cl⁻</li>
                    <li>Ba²⁺</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/ion.png" alt="ion examples" height="300" width="200" />
                </p>

                <h3 className="font-semibold">Cation</h3>
                <p className="mb-2">
                    A <strong>cation</strong> is an ion with a <strong>positive overall charge</strong>
                    caused by <strong>losing electron(s)</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>K⁺</li>
                    <li>Al³⁺</li>
                    <li>NH₄⁺</li>
                </ul>

                <h3 className="font-semibold">Anion</h3>
                <p className="mb-2">
                    An <strong>anion</strong> is an ion with a <strong>negative overall charge</strong>
                    caused by <strong>gaining electron(s)</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>F⁻</li>
                    <li>O²⁻</li>
                    <li>SO₄²⁻</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/cat and an ion.jpg" alt="cation and anion comparison" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.geeksforgeeks.org/chemistry/cations-vs-anions/"
                        text="Learn more about cations and anions!"
                    />
                </div>

                <h3 className="font-semibold">Polyatomic Ion</h3>
                <p className="mb-2">
                    A <strong>polyatomic ion</strong> is made of <strong>multiple atoms</strong> that are
                    <strong> covalently bonded</strong> together and carry an overall
                    <strong> positive or negative charge</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>SO₄²⁻ : sulfate</li>
                    <li>OH⁻ : hydroxide</li>
                    <li>NH₄⁺ : ammonium</li>
                </ul>
                <p className="font-semibold mb-2">Nomenclature Patterns:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li><strong>-ate</strong>: most common form (e.g., nitrate NO₃⁻)</li>
                    <li><strong>-ite</strong>: one less oxygen than -ate (e.g., nitrite NO₂⁻)</li>
                    <li><strong>Per-___-ate</strong>: one more oxygen than -ate (e.g., perchlorate ClO₄⁻)</li>
                    <li><strong>Hypo-___-ite</strong>: one less oxygen than -ite (e.g., hypochlorite ClO⁻)</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/polyion.png" alt="polyatomic ion examples" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.khanacademy.org/science/hs-chemistry/x2613d8165d88df5e:chemical-bonding/x2613d8165d88df5e:ionic-nomenclature/a/polyatomic-ions-article"
                        text="Learn more about polyatomic ions!"
                    />
                </div>

                <h3 className="font-semibold">Molecule</h3>
                <p className="mb-2">
                    A <strong>molecule</strong> consists of multiple <strong>nonmetal atoms or anions</strong>
                    that are <strong>covalently bonded</strong> and have a
                    <strong> neutral (zero) overall charge</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>CCl₄ : carbon tetrachloride</li>
                    <li>N₂O₃ : dinitrogen trioxide</li>
                    <li>CO₂ : carbon dioxide</li>
                </ul>
                <p className="font-semibold mb-2">Nomenclature Rules:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>
                        Write the first nonmetal name. If it has a subscript greater than 1,
                        add a prefix (<strong>di-, tri-, tetra-, penta-, hexa-</strong>, etc.).
                    </li>
                    <li>
                        Write the second nonmetal name with a prefix
                        (<strong>mono-, di-, tri-, tetra-, penta-, hexa-</strong>, etc.) no matter what.
                    </li>
                    <li>
                        Repeat prefix usage for any additional nonmetals or anions in the molecule.
                    </li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/molecule.jpg" alt="molecule examples" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://byjus.com/chemistry/atoms-and-molecules/"
                        text="Learn more about atoms and molecules!"
                    />
                </div>

                <h3 className="font-semibold">Ionic Compound</h3>
                <p className="mb-2">
                    An <strong>ionic compound</strong> forms between a <strong>cation</strong> and an
                    <strong> anion</strong>. Electrons are transferred, but the compound has
                    <strong> no overall charge</strong>.
                </p>
                <p className="mb-2 font-mono">
                    | anion subscript × anion charge | = cation subscript × cation charge
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>NaCl : sodium chloride</li>
                    <li>LiF : lithium fluoride</li>
                    <li>CaCO₃ : calcium carbonate</li>
                </ul>
                <p className="font-semibold mb-2">Nomenclature Rules:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Write the cation name first (unchanged)</li>
                    <li>Transition metal charges are shown using Roman numerals</li>
                    <li>Polyatomic anions keep their name</li>
                    <li>Single-element anions end in <strong>-ide</strong></li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/ionic comp.png" alt="ionic compound diagram" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.britannica.com/science/ionic-compound"
                        text="Learn more about ionic compounds!"
                    />
                </div>

                <h3 className="font-semibold">Acid</h3>
                <p className="mb-2">
                    An <strong>acid</strong> usually contains at least one
                    <strong> hydrogen ion (H⁺)</strong>, donates protons,
                    and has a <strong>pH below 7</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>HCl : hydrochloric acid</li>
                    <li>HNO₃ : nitric acid</li>
                    <li>H₂SO₄ : sulfuric acid</li>
                </ul>
                <p className="font-semibold mb-2">Nomenclature:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li><strong>Hydro-___ acid</strong>: single-element acids</li>
                    <li><strong>-ic acid</strong>: polyatomic ions ending in -ate</li>
                    <li><strong>-ous acid</strong>: polyatomic ions ending in -ite</li>
                </ul>
                <p className="italic mb-6">
                    “I <strong>ATE</strong> it and it was <strong>IC</strong>ky. I took a b<strong>ITE</strong> and it was delici<strong>OUS</strong>.”
                </p>

                <h3 className="font-semibold">Base</h3>
                <p className="mb-2">
                    A <strong>base</strong> sometimes contains at least one
                    <strong> hydroxide ion (OH⁻)</strong>, accepts protons,
                    and has a <strong>pH above 7</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>NaOH : sodium hydroxide</li>
                    <li>CaCO₃ : calcium carbonate</li>
                    <li>Mg(OH)₂ : magnesium hydroxide</li>
                </ul>
                <p className="mb-2">
                    <strong>Nomenclature</strong> - 
                    <strong> (cation name) + Hydroxide</strong>
                </p>
                <p className="italic text-gray-600 mb-6">
                    <img src="/acid base.png" alt="acid and base diagram" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.pasco.com/resources/articles/acid-base-chemistry"
                        text="Learn more about acids and bases!"
                    />
                </div>

                <h3 className="font-semibold">Hydrocarbon</h3>
                <p className="mb-2">
                    A <strong>hydrocarbon</strong> is an organic compound made up of only
                    <strong> carbon (C)</strong> and <strong>hydrogen (H)</strong> atoms.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>CH₄ : methane</li>
                    <li>C₄H₁₀ : butane</li>
                    <li>C₃H₈ : propane</li>
                </ul>
                <p className="mb-3">
                    Nomenclature is complex, but hydrocarbons usually end in
                    <strong> -ane</strong> or <strong>-ene</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <img src="/hydrocarb.png" alt="hydrocarbon examples" height="300" width="200" />
                </p>
                <p className="font-semibold mb-4">
                    There are also organic compounds similar to hydrocarbons that have more complex nomenclature,
                    such as alcohols (C₂H₅OH) and ethanol (CH₃CH₂OH).
                </p>

                <div className="mb-3">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/General_Chemistry/ChemPRIME_(Moore_et_al.)/08%3A_Properties_of_Organic_Compounds/8.05%3A_Organic_Compounds-_Hydrocarbons"
                        text="Learn more about hydrocarbons and organic compounds!"
                    />
                </div>
            </div>
        </>
    );
}

export const HardArticle2048: Article = () => {

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
                <h2 className="text-xl font-bold mb-3">Hard Mode: Intermolecular Forces & Chemical Behavior</h2>

                <p className="mb-4">
                    This section introduces <strong>Intermolecular Forces (IMFs)</strong>, which explain how particles
                    attract each other in liquids and solids. These forces are weaker than chemical bonds but
                    strongly influence physical properties such as boiling point, solubility, and state of matter.
                    Spend <strong>6-7 minutes</strong> studying this section before starting Hard mode.
                </p>

                <h3 className="font-semibold">Intermolecular Forces (IMFs)</h3>
                <p className="mb-2">
                    <strong>Intermolecular forces</strong> are attractions <strong>between</strong> molecules or particles.
                    They are weaker than intramolecular (covalent or ionic) bonds.
                </p>
                <p className="mb-4">
                    Strength order (weakest → strongest):
                    <strong> London Dispersion Forces → Dipole-Dipole → Hydrogen Bonding</strong>
                </p>

                <h3 className="font-semibold">London Dispersion Forces (LDF)</h3>
                <p className="mb-2">
                    <strong>London Dispersion Forces</strong> are the <strong>weakest</strong> type of IMF.
                    They result from <strong>temporary induced dipoles</strong> caused by random electron movement.
                </p>
                <p className="mb-2">
                    <strong>Present in all substances</strong> (anything with a chemical formula).
                </p>
                <p className="italic text-gray-600 mb-6">
                    <img src="/ldf.jpg" alt="London dispersion forces diagram" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://byjus.com/chemistry/london-dispersion-forces/"
                        text="Learn more about London Dispersion Forces!"
                    />
                </div>

                <h3 className="font-semibold">Dipole–Dipole Forces (Polarity)</h3>
                <p className="mb-2">
                    <strong>Dipole–dipole forces</strong> are attractions between the
                    <strong> partial positive end</strong> of one molecule and the
                    <strong> partial negative end</strong> of another.
                </p>
                <p className="mb-2">
                    A molecule is <strong>polar</strong> when it has permanent dipoles.
                    Dipole–dipole forces can occur <strong>between identical polar molecules</strong>.
                </p>
                <p className="mb-2">
                    <strong>Can occur in molecules, acids, and bases.</strong>
                </p>
                <p className="italic text-gray-600 mb-6">
                    <img src="/d-d.jpg" alt="dipole dipole forces diagram" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.masterorganicchemistry.com/2025/10/17/dipole-moments-and-dipoles/"
                        text="Learn more about dipoles!"
                    />
                </div>

                <h3 className="font-semibold">Hydrogen Bonding</h3>
                <p className="mb-2">
                    <strong>Hydrogen bonding</strong> is the <strong>strongest IMF</strong>.
                </p>
                <p className="mb-2">
                    For a molecule to hydrogen bond with itself, it must be both a
                    <strong> hydrogen donor</strong> and a <strong> hydrogen acceptor</strong>.
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>
                        Hydrogen donor: H covalently bonded to <strong>N, O, or F</strong>
                    </li>
                    <li>
                        Hydrogen acceptor: lone pair on <strong>N, O, or F</strong>
                    </li>
                </ul>
                <p className="mb-2">
                    <strong>Can occur in molecules, acids, and bases.</strong>
                </p>
                <p className="italic text-gray-600 mb-6">
                    <img src="/hb.png" alt="hydrogen bonding diagram" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.chem.purdue.edu/gchelp/liquids/hbond.html"
                        text="Learn more about Hydrogen Bonding!"
                    />
                </div>

                <div className="mb-10">
                    <CarbleLink
                        url="https://www.khanacademy.org/test-prep/mcat/chemical-processes/covalent-bonds/a/intramolecular-and-intermolecular-forces"
                        text="Learn more about intermolecular forces!"
                    />
                </div>

                <h3 className="font-semibold">Ion</h3>
                <p className="mb-2">
                    An <strong>ion</strong> is an atom or molecule with an
                    <strong> overall positive or negative charge</strong>
                    caused by losing or gaining electrons.
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Na⁺</li>
                    <li>Cl⁻</li>
                    <li>Ba²⁺</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/ion.png" alt="ion examples" height="300" width="200" />
                </p>

                <h3 className="font-semibold">Cation</h3>
                <p className="mb-2">
                    A <strong>cation</strong> has a <strong>positive</strong> charge due to
                    <strong> losing electrons</strong>.
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>K⁺</li>
                    <li>Al³⁺</li>
                    <li>NH₄⁺</li>
                </ul>

                <h3 className="font-semibold">Anion</h3>
                <p className="mb-2">
                    An <strong>anion</strong> has a <strong>negative</strong> charge due to
                    <strong> gaining electrons</strong>.
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>F⁻</li>
                    <li>O²⁻</li>
                    <li>SO₄²⁻</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/cat and an ion.jpg" alt="cation and anion diagram" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.geeksforgeeks.org/chemistry/cations-vs-anions/"
                        text="Learn more about cations and anions!"
                    />
                </div>

                <h3 className="font-semibold">Molecule</h3>
                <p className="mb-2">
                    A <strong>molecule</strong> consists of multiple
                    <strong> nonmetal atoms or anions</strong> that are
                    <strong> covalently bonded</strong> with a
                    <strong> neutral overall charge</strong>.
                </p>
                <ul className="list-disc ml-6 mb-3">
                    <li>CCl₄ : carbon tetrachloride</li>
                    <li>N₂O₃ : dinitrogen trioxide</li>
                    <li>CO₂ : carbon dioxide</li>
                </ul>
                <p className="mb-2">
                    <strong>Intermolecular Forces: </strong>
                     Always LDF, sometimes dipole–dipole or hydrogen bonding.
                </p>
                <p className="mb-2">
                    Molecules have <strong>covalent intramolecular bonds </strong>
                    and are represented using <strong>Lewis diagrams</strong>.
                </p>
                <p className="italic text-gray-600 mb-6">
                    <img src="/lewis.png" alt="lewis structure example" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://byjus.com/chemistry/atoms-and-molecules/"
                        text="Learn more about atoms and molecules!"
                    />
                </div>

                <h3 className="font-semibold">Ionic Compound</h3>
                <p className="mb-2">
                    An <strong>ionic compound</strong> forms between a
                    <strong> cation and an anion</strong> and is
                    <strong> electrically neutral</strong>.
                </p>
                <p className="mb-2">
                    <strong>Intermolecular Forces: </strong>
                    Only London Dispersion Forces.
                </p>
                <p className="mb-2">
                    Ionic compounds form a <strong>crystal lattice</strong>
                    and are typically <strong>solid and rigid</strong>.
                </p>
                <p className="italic text-gray-600 mb-6">
                    <img src="/lattice.png" alt="ionic lattice structure" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.britannica.com/science/ionic-compound"
                        text="Learn more about ionic compounds!"
                    />
                </div>

                <h3 className="font-semibold">Acid</h3>
                <p className="mb-2">
                    An <strong>acid</strong> donates <strong>H⁺</strong>,
                    has a <strong>pH below 7</strong>,
                    and often contains strong dipoles.
                </p>
                <p className="mb-2">
                    <strong>Intermolecular Forces: </strong>
                    Always LDF, sometimes dipole–dipole or hydrogen bonding.
                </p>

                <h3 className="font-semibold">Base</h3>
                <p className="mb-2">
                    A <strong>base</strong> accepts <strong>H⁺</strong>,
                    has a <strong>pH above 7</strong>,
                    and may contain hydrogen bonding sites.
                </p>
                <p className="mb-2">
                    <strong>Intermolecular Forces: </strong>
                    Always LDF, sometimes dipole–dipole or hydrogen bonding.
                </p>
                <p className="italic text-gray-600 mb-6">
                    <img src="/acid imf.jpg" alt="acid base intermolecular forces" height="300" width="200" />
                </p>

                <div className="mb-7">
                    <CarbleLink
                        url="https://www.pasco.com/resources/articles/acid-base-chemistry"
                        text="Learn more about acids and bases!"
                    />
                </div>

                <h3 className="font-semibold">Hydrocarbon</h3>
                <p className="mb-2">
                    A <strong>hydrocarbon</strong> is an organic molecule made only of
                    <strong> carbon</strong> and <strong> hydrogen</strong>.
                </p>
                <ul className="list-disc ml-6 mb-3">
                    <li>CH₄ : methane</li>
                    <li>C₄H₁₀ : butane</li>
                    <li>C₃H₈ : propane</li>
                </ul>
                <p className="mb-2">
                    <strong>Intermolecular Forces: </strong>
                    Only London Dispersion Forces.
                </p>
                <p className="mb-2">
                    No polarity and no hydrogen bonding.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <img src="/hydrocarb.png" alt="hydrocarbon IMF diagram" height="300" width="200" />
                </p>

                <p className="font-semibold mb-4">
                    There are also organic compounds related to hydrocarbons with more complex behavior,
                    such as alcohols (C₂H₅OH) and ethanol (CH₃CH₂OH).
                </p>

                <div className="mb-3">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/General_Chemistry/ChemPRIME_(Moore_et_al.)/08%3A_Properties_of_Organic_Compounds/8.05%3A_Organic_Compounds-_Hydrocarbons"
                        text="Learn more about hydrocarbons and organic compounds!"
                    />
                </div>
            </div>
        </>
    );
}

export const EasyLesson2048: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">
                    Play our original game: 2048 Molarity!
                </h2>

                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        The game is played on a 4×4 grid using arrow keys
                    </li>

                    <li>
                        <strong>Goal</strong> — Strategically combine variables to satisfy the
                        Solution Dilutions relationship: <strong>M1V1 = M2V2</strong>
                    </li>

                    <li>
                        <strong>How to Play</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Use arrow keys to slide tiles across the grid</li>
                            <li>Compatible variable tiles merge into compound expressions</li>
                            <li>Each move spawns a new variable tile</li>
                        </ul>
                    </li>

                    <li>
                        <strong>Variable Rules</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>M1, V1, M2, and V2 tiles can combine into multi-variable tiles</li>
                            <li>Merges occur between tiles of the same variable and corresponding initial/final variable tiles</li>
                        </ul>
                    </li>

                    <li>
                        <strong>Equation Check</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>When <strong>M1V1</strong> collides with <strong>M2V2</strong>, the game checks the equation</li>
                            <li>If the values are equal, you win</li>
                            <li>If the values are not equal, the game ends</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Win</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Correctly balance the dilution equation</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Lose</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>M1V1 and M2V2 collide but the equation is incorrect</li>
                            <li>No valid moves remain on the grid</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Start / Restart the Game</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Press the space bar</li>
                            <li>No pausing or undoing moves</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    );
};

export const HardLesson2048: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">
                    Play our original game: 2048 Gas Laws!
                </h2>

                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        The game is played on a 4×4 grid using arrow keys
                    </li>

                    <li>
                        <strong>Goal</strong> — Strategically combine variables to satisfy the
                        Ideal Gas Law relationship: <strong>PV = nRT</strong>
                    </li>

                    <li>
                        <strong>How to Play</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Use arrow keys to slide tiles across the grid</li>
                            <li>Compatible variable tiles merge into compound expressions</li>
                            <li>Each move spawns a new variable tile</li>
                        </ul>
                    </li>

                    <li>
                        <strong>Variable Rules</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>P, V, n, and T tiles can combine into multi-variable tiles</li>
                            <li>R is a constant and always has a fixed value</li>
                            <li>Repeated merges may be required to build full expressions</li>
                        </ul>
                    </li>

                    <li>
                        <strong>Equation Check</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>When <strong>PV</strong> collides with <strong>nRT</strong>, the game checks the equation</li>
                            <li>If the values are equal, you win</li>
                            <li>If the values are not equal, the game ends</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Win</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Correctly balance the gas law equation</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Lose</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>PV and nRT collide but the equation is incorrect</li>
                            <li>No valid moves remain on the grid</li>
                        </ul>
                    </li>

                    <li>
                        <strong>To Start / Restart the Game</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Press the space bar</li>
                            <li>No pausing or undoing moves</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    );
};