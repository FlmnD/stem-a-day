from typing import TypedDict


class DailyQuestion(TypedDict):
    prompt: str
    options: list[str]
    correct_option_index: int
    explanation: str


DAILY_GLUCOSE_REWARD = 25


DAILY_QUESTIONS: list[DailyQuestion] = [
    {
        "prompt": "What is the atomic number of oxygen?",
        "options": ["6", "7", "8", "9"],
        "correct_option_index": 2,
        "explanation": "Atomic number equals the number of protons. Oxygen has 8 protons.",
    },
    {
        "prompt": "Which particle has a negative charge?",
        "options": ["Proton", "Neutron", "Electron", "Nucleus"],
        "correct_option_index": 2,
        "explanation": "Electrons carry a negative charge, protons are positive, and neutrons are neutral.",
    },
    {
        "prompt": "What is the chemical symbol for sodium?",
        "options": ["S", "So", "Na", "Sd"],
        "correct_option_index": 2,
        "explanation": "Sodium uses the symbol Na from its Latin name, natrium.",
    },
    {
        "prompt": "How many valence electrons does chlorine have?",
        "options": ["5", "6", "7", "8"],
        "correct_option_index": 2,
        "explanation": "Chlorine is in Group 17, so it has 7 valence electrons.",
    },
    {
        "prompt": "Which bond forms when electrons are shared between atoms?",
        "options": ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
        "correct_option_index": 1,
        "explanation": "Covalent bonds form when atoms share pairs of electrons.",
    },
    {
        "prompt": "What is the formula for water?",
        "options": ["HO", "H2O", "H2O2", "OH2"],
        "correct_option_index": 1,
        "explanation": "Water contains two hydrogen atoms and one oxygen atom: H2O.",
    },
    {
        "prompt": "Which state of matter has a definite volume but no definite shape?",
        "options": ["Solid", "Liquid", "Gas", "Plasma"],
        "correct_option_index": 1,
        "explanation": "Liquids keep a definite volume but take the shape of their container.",
    },
    {
        "prompt": "What is the pH of a neutral solution at 25 degrees Celsius?",
        "options": ["0", "5", "7", "14"],
        "correct_option_index": 2,
        "explanation": "Pure water at 25 degrees Celsius is neutral and has a pH of 7.",
    },
    {
        "prompt": "Which gas law states that pressure and volume are inversely related at constant temperature?",
        "options": ["Charles's law", "Avogadro's law", "Boyle's law", "Gay-Lussac's law"],
        "correct_option_index": 2,
        "explanation": "Boyle's law says pressure increases as volume decreases when temperature stays constant.",
    },
    {
        "prompt": "How many grams are in 1 mole of carbon-12?",
        "options": ["6 grams", "12 grams", "24 grams", "1 gram"],
        "correct_option_index": 1,
        "explanation": "One mole of carbon-12 has a mass of exactly 12 grams.",
    },
    {
        "prompt": "Which subatomic particle determines the identity of an element?",
        "options": ["Electron", "Neutron", "Proton", "Photon"],
        "correct_option_index": 2,
        "explanation": "The number of protons defines the element.",
    },
    {
        "prompt": "What is the formula for table salt?",
        "options": ["NaCl", "KCl", "Na2Cl", "ClNa2"],
        "correct_option_index": 0,
        "explanation": "Table salt is sodium chloride, written as NaCl.",
    },
    {
        "prompt": "Which of these is a noble gas?",
        "options": ["Nitrogen", "Oxygen", "Neon", "Chlorine"],
        "correct_option_index": 2,
        "explanation": "Neon is a noble gas in Group 18.",
    },
    {
        "prompt": "When an atom loses an electron, it becomes a:",
        "options": ["Anion", "Cation", "Isotope", "Molecule"],
        "correct_option_index": 1,
        "explanation": "Losing electrons leaves a net positive charge, making the atom a cation.",
    },
    {
        "prompt": "Which quantity is conserved in a balanced chemical equation?",
        "options": ["Color", "Temperature", "Mass", "Volume"],
        "correct_option_index": 2,
        "explanation": "Balanced equations obey the law of conservation of mass.",
    },
    {
        "prompt": "What is the molar mass of O2?",
        "options": ["16 g/mol", "18 g/mol", "32 g/mol", "64 g/mol"],
        "correct_option_index": 2,
        "explanation": "Each oxygen atom is about 16 g/mol, so O2 is about 32 g/mol.",
    },
    {
        "prompt": "Which type of reaction combines simpler substances into a more complex substance?",
        "options": ["Decomposition", "Synthesis", "Single replacement", "Combustion"],
        "correct_option_index": 1,
        "explanation": "A synthesis reaction combines reactants into one main product.",
    },
    {
        "prompt": "Which intermolecular force is strongest among these choices?",
        "options": ["London dispersion forces", "Dipole-dipole forces", "Hydrogen bonding", "None are intermolecular forces"],
        "correct_option_index": 2,
        "explanation": "Hydrogen bonding is a particularly strong dipole-dipole interaction.",
    },
    {
        "prompt": "What is the oxidation number of oxygen in most compounds?",
        "options": ["+2", "+1", "-1", "-2"],
        "correct_option_index": 3,
        "explanation": "Oxygen usually has an oxidation number of -2, except in special cases like peroxides.",
    },
    {
        "prompt": "Which lab instrument is typically used to measure liquid volume accurately?",
        "options": ["Thermometer", "Graduated cylinder", "Balance", "Evaporating dish"],
        "correct_option_index": 1,
        "explanation": "A graduated cylinder is designed to measure liquid volume accurately.",
    },
    {
        "prompt": "If a solution has a high concentration of H+ ions, it is:",
        "options": ["Basic", "Neutral", "Acidic", "Saturated"],
        "correct_option_index": 2,
        "explanation": "A high hydrogen ion concentration corresponds to an acidic solution.",
    },
    {
        "prompt": "Which of these is an example of a physical change?",
        "options": ["Rusting iron", "Burning methane", "Melting ice", "Digesting food"],
        "correct_option_index": 2,
        "explanation": "Melting changes the state of water without changing its chemical identity.",
    },
    {
        "prompt": "What is the coefficient of O2 when balancing 2H2 + O2 -> 2H2O?",
        "options": ["1", "2", "3", "4"],
        "correct_option_index": 0,
        "explanation": "The balanced equation is 2H2 + O2 -> 2H2O, so the coefficient is 1.",
    },
    {
        "prompt": "Which element is more electronegative?",
        "options": ["Sodium", "Fluorine", "Calcium", "Aluminum"],
        "correct_option_index": 1,
        "explanation": "Fluorine is the most electronegative element on the periodic table.",
    },
    {
        "prompt": "What happens to gas volume when temperature increases at constant pressure?",
        "options": ["It decreases", "It stays the same", "It increases", "It becomes zero"],
        "correct_option_index": 2,
        "explanation": "Charles's law says gas volume increases with temperature at constant pressure.",
    },
    {
        "prompt": "Which formula represents calcium chloride?",
        "options": ["CaCl", "CaCl2", "Ca2Cl", "Ca2Cl2"],
        "correct_option_index": 1,
        "explanation": "Calcium forms a 2+ ion and chloride forms a 1- ion, so the formula is CaCl2.",
    },
    {
        "prompt": "What is the empirical formula of hydrogen peroxide, H2O2?",
        "options": ["HO", "H2O2", "H2O", "O2H2"],
        "correct_option_index": 0,
        "explanation": "The simplest whole-number ratio in H2O2 is 1:1, so the empirical formula is HO.",
    },
    {
        "prompt": "Which periodic trend generally increases from left to right across a period?",
        "options": ["Atomic radius", "Metallic character", "Electronegativity", "Shielding effect"],
        "correct_option_index": 2,
        "explanation": "Electronegativity generally increases across a period from left to right.",
    },
    {
        "prompt": "A catalyst in a chemical reaction does what?",
        "options": ["Raises activation energy", "Gets used up permanently", "Speeds up the reaction", "Changes the products formed"],
        "correct_option_index": 2,
        "explanation": "A catalyst speeds a reaction by lowering activation energy and is not consumed overall.",
    },
    {
        "prompt": "What is the concentration of a solution with 2 moles of solute in 1 liter of solution?",
        "options": ["0.5 M", "1 M", "2 M", "3 M"],
        "correct_option_index": 2,
        "explanation": "Molarity is moles per liter, so 2 moles in 1 liter is 2 M.",
    },
]
