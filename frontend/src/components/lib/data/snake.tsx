import CarbleLink from "@/components/ui/StemLink";
import { Article, Lesson } from "@/structures/GameStructures";

export const SnakeEasyArticle: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
                <h2 className="text-xl font-bold mb-3">Learn About Chemical Bonding & Compounds!</h2>

                <p className="mb-4">
                    Learn about molecules, ions, ionic compounds, acids, bases, and hydrocarbons here!
                    These concepts are essential for understanding how substances form and react.
                    You should spend at least <strong>6–7 minutes</strong> reviewing this information before playing.
                    <strong> Take your time — it will help you succeed!</strong>
                </p>

                <h3 className="font-semibold">Molecule</h3>
                <p className="mb-3">
                    A <strong>molecule</strong> is made of multiple <strong>nonmetal atoms</strong> that are
                    <strong> covalently bonded</strong> together and have a <strong>neutral (zero) overall charge</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <img src="/molecule.jpg" alt="molecule example" height="300" width="200" />
                </p>
                <div className="mb-7">
                    <CarbleLink
                        url="https://byjus.com/chemistry/atoms-and-molecules/"
                        text="Learn more about atoms and molecules!"
                    />
                </div>

                <h3 className="font-semibold">Ion</h3>
                <p className="mb-2">
                    An <strong>ion</strong> is an atom or molecule with an <strong>overall positive or negative charge</strong>
                    due to <strong>losing or gaining electron(s)</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Na⁺</li>
                    <li>Cl⁻</li>
                    <li>Ba²⁺</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/ion.png" alt="ion examples" height="300" width="200" />
                </p>

                <h3 className="font-semibold">Cation</h3>
                <p className="mb-2">
                    A <strong>cation</strong> is an ion with an <strong>overall positive charge</strong>
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
                    An <strong>anion</strong> is an ion with an <strong>overall negative charge</strong>
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
                    A <strong>polyatomic ion</strong> is a charged group of <strong>multiple covalently bonded atoms</strong>.
                    The overall charge can be <strong>positive or negative</strong>.
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

                <h3 className="font-semibold">Ionic Compound</h3>
                <p className="mb-2">
                    An <strong>ionic compound</strong> forms between a <strong>cation</strong> and an <strong>anion</strong>.
                    Electrons are transferred, but the compound has a <strong>neutral overall charge</strong>.
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
                    An <strong>acid</strong> usually contains at least one <strong>hydrogen ion (H⁺)</strong>,
                    donates protons, and has a <strong>pH below 7</strong>.
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
                    A <strong>base</strong> often contains a <strong>hydroxide ion (OH⁻)</strong>,
                    accepts protons, and has a <strong>pH above 7</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>NaOH : sodium hydroxide</li>
                    <li>CaCO₃ : calcium carbonate</li>
                    <li>Mg(OH)₂ : magnesium hydroxide</li>
                </ul>
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
                    A <strong>hydrocarbon</strong> is an organic compound made only of
                    <strong> carbon (C)</strong> and <strong>hydrogen (H)</strong> atoms.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>CH₄ : methane</li>
                    <li>C₄H₁₀ : butane</li>
                    <li>C₃H₈ : propane</li>
                </ul>
                <p className="mb-3">
                    Nomenclature is complex, but hydrocarbons usually end in <strong>-ane</strong> or <strong>-ene</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <img src="/hydrocarb.png" alt="hydrocarbon examples" height="300" width="200" />
                </p>
                <p className="font-semibold mb-4">
                    There are also organic compounds similar to hydrocarbons with more complex nomenclature,
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

export const SnakeHardArticle: Article = () => {

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow mb-8 text-sm leading-6">
                <h2 className="text-xl font-bold mb-3">Learn About Chemical Bonding & Compounds!</h2>

                <p className="mb-4">
                    Learn about molecules, ions, ionic compounds, acids, bases, and hydrocarbons here!
                    These concepts are essential for understanding how substances form and react.
                    You should spend at least <strong>6–7 minutes</strong> reviewing this information before playing.
                    <strong> Take your time — it will help you succeed!</strong>
                </p>

                <h3 className="font-semibold">Molecule</h3>
                <p className="mb-3">
                    A <strong>molecule</strong> is made of multiple <strong>nonmetal atoms</strong> that are
                    <strong> covalently bonded</strong> together and have a <strong>neutral (zero) overall charge</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <img src="/molecule.jpg" alt="molecule example" height="300" width="200" />
                </p>
                <div className="mb-7">
                    <CarbleLink
                        url="https://byjus.com/chemistry/atoms-and-molecules/"
                        text="Learn more about atoms and molecules!"
                    />
                </div>

                <h3 className="font-semibold">Ion</h3>
                <p className="mb-2">
                    An <strong>ion</strong> is an atom or molecule with an <strong>overall positive or negative charge</strong>
                    due to <strong>losing or gaining electron(s)</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>Na⁺</li>
                    <li>Cl⁻</li>
                    <li>Ba²⁺</li>
                </ul>
                <p className="italic text-gray-600 mb-6">
                    <img src="/ion.png" alt="ion examples" height="300" width="200" />
                </p>

                <h3 className="font-semibold">Cation</h3>
                <p className="mb-2">
                    A <strong>cation</strong> is an ion with an <strong>overall positive charge</strong>
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
                    An <strong>anion</strong> is an ion with an <strong>overall negative charge</strong>
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
                    A <strong>polyatomic ion</strong> is a charged group of <strong>multiple covalently bonded atoms</strong>.
                    The overall charge can be <strong>positive or negative</strong>.
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

                <h3 className="font-semibold">Ionic Compound</h3>
                <p className="mb-2">
                    An <strong>ionic compound</strong> forms between a <strong>cation</strong> and an <strong>anion</strong>.
                    Electrons are transferred, but the compound has a <strong>neutral overall charge</strong>.
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
                    An <strong>acid</strong> usually contains at least one <strong>hydrogen ion (H⁺)</strong>,
                    donates protons, and has a <strong>pH below 7</strong>.
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
                    A <strong>base</strong> often contains a <strong>hydroxide ion (OH⁻)</strong>,
                    accepts protons, and has a <strong>pH above 7</strong>.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>NaOH : sodium hydroxide</li>
                    <li>CaCO₃ : calcium carbonate</li>
                    <li>Mg(OH)₂ : magnesium hydroxide</li>
                </ul>
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
                    A <strong>hydrocarbon</strong> is an organic compound made only of
                    <strong> carbon (C)</strong> and <strong>hydrogen (H)</strong> atoms.
                </p>
                <p className="mb-2">Examples:</p>
                <ul className="list-disc ml-6 mb-3">
                    <li>CH₄ : methane</li>
                    <li>C₄H₁₀ : butane</li>
                    <li>C₃H₈ : propane</li>
                </ul>
                <p className="mb-3">
                    Nomenclature is complex, but hydrocarbons usually end in <strong>-ane</strong> or <strong>-ene</strong>.
                </p>
                <p className="italic text-gray-600 mb-4">
                    <img src="/hydrocarb.png" alt="hydrocarbon examples" height="300" width="200" />
                </p>
                <p className="font-semibold mb-4">
                    There are also organic compounds similar to hydrocarbons with more complex nomenclature,
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


export const SnakeEasyLesson: Lesson = () => {

    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">Play our original game: Snake Nomenclature!</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        Start with a snake length of 5
                    </li>
                    <li>
                        <strong>To Win</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Snake length of 15 or more</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Goal</strong> — “Eat” the apple with the chemical formula that matches the substance in the prompt at the top of the game box.
                    </li>
                    <li>
                        <strong>Eat the Correct Apple</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>+2 snake length</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Eat the Wrong Apple</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>-1 snake length</li>
                        </ul>
                    </li>
                    <li>
                        <strong>To Lose</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Snake length less than 3</li>
                            <li>Snake hits wall</li>
                            <li>Snake hits itself (its body)</li>
                        </ul>
                    </li>
                    <li>
                        <strong>To Start/Restart the Game</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Press space</li>
                            <li>No pausing to prevent cheating</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    );
}

export const SnakeHardLesson: Lesson = () => {

    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-3">Play our original game: Snake Nomenclature!</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        Start with a snake length of 5
                    </li>
                    <li>
                        <strong>To Win</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Snake length of 15 or more</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Goal</strong> — “Eat” an apple that matches the IMF (Intermolecular Force) in the prompt at the top of the game box.
                         Consider the IMF to be between a substance and itself, not between 2 different substances.
                    </li>
                    <li>
                        <strong>Eat the Correct Apple</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>+1 snake length</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Eat the Wrong Apple</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>-2 snake length</li>
                        </ul>
                    </li>
                    <li>
                        <strong>To Lose</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Snake length less than 3</li>
                            <li>Snake hits wall</li>
                            <li>Snake hits itself (its body)</li>
                        </ul>
                    </li>
                    <li>
                        <strong>To Start/Restart the Game</strong>
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                            <li>Press space</li>
                            <li>No pausing to prevent cheating</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    );
}