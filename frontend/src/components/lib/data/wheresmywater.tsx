import CarbleLink from "@/components/ui/StemLink";
import { Article, Lesson } from "@/structures/GameStructures";

export const WheresMyWaterEasyArticle: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto mb-8 rounded-lg bg-white p-4 text-sm leading-6 shadow dark:border dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
                <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                    Learn Electron Configuration Through Flow Paths
                </h2>
                <p className="mb-4 text-slate-700 dark:text-slate-200">
                    In the easy version of Where&apos;s My Water, every duck stands for one exact electron placement,
                    such as <strong>1s1</strong>, <strong>1s2</strong>, or <strong>2p4</strong>. To win, you have to
                    follow the real filling order of orbitals, not just remember the final shorthand answer.
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Aufbau Principle</h3>
                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    The <strong>Aufbau principle</strong> says electrons fill the lowest-energy orbitals first. That is
                    why the order goes <strong>1s - 2s - 2p - 3s - 3p - 4s - 3d</strong> for the levels in this game.
                    If you skip ahead, the duck order is wrong.
                </p>
                <div className="mb-6">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/University_of_Missouri/MU%3A__1330H_(Keller)/06._Electronic_Structure_of_Atoms/6.8%3A_Electron_Configurations"
                        text="Review the Aufbau principle and electron filling order."
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Pauli Exclusion Principle</h3>
                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    The <strong>Pauli exclusion principle</strong> says an orbital can hold at most two electrons.
                    That is why labels like <strong>1s1</strong> and <strong>1s2</strong> appear, but there is no
                    <strong> 1s3</strong>. Once a subshell is full, the path has to move on.
                </p>
                <div className="mb-6">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/General_Chemistry/General_Chemistry_Supplement_(Eames)/Electrons/Quantum_Numbers/The_Pauli_Exclusion_Principle"
                        text="Review why orbitals only hold two electrons."
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Hund&apos;s Rule</h3>
                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    <strong>Hund&apos;s rule</strong> matters most in p and d subshells. Electrons spread out through
                    equal-energy orbitals before pairing up. The game simplifies the visual side of this rule, but it
                    still makes you collect the electrons in the correct count order all the way through subshells like
                    <strong> 2p6</strong> and <strong>3d6</strong>.
                </p>
                <div className="mb-6">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/General_Chemistry/General_Chemistry_Supplement_(Eames)/Electrons/Arrangement_of_Electrons/Hunds_Rule"
                        text="Review Hund's rule for p and d subshells."
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Reading Electron Configurations</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    A configuration such as <strong>1s2 2s2 2p6</strong> tells you:
                </p>
                <ul className="mb-4 ml-6 list-disc text-slate-700 dark:text-slate-200">
                    <li>The shell number comes first.</li>
                    <li>The letter tells you the subshell.</li>
                    <li>The superscript-like number tells you how many electrons are in that subshell.</li>
                </ul>
                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    In this game, those electrons are split into exact ducks so you have to build the sequence one
                    placement at a time instead of guessing the finished answer.
                </p>
                <div className="mb-6">
                    <CarbleLink
                        url="https://chem.libretexts.org/Bookshelves/General_Chemistry/Chem1_(Lower)/08%3A_Atomic_Electronic_Structure/8.04%3A_Electron_Configurations"
                        text="See more worked examples of electron configurations."
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">How the Game Maps to Chemistry</h3>
                <ul className="ml-6 list-disc text-slate-700 dark:text-slate-200">
                    <li>Digging makes the tunnel path the electron water will follow.</li>
                    <li>Each duck is one exact electron placement, like <strong>2p4</strong>.</li>
                    <li>Water rejects a duck if you touch it out of order.</li>
                    <li>The level only clears after the full configuration is collected and enough water fills the tub.</li>
                </ul>
            </div>
        </>
    );
};

export const WheresMyWaterHardArticle: Article = () => {
    return (
        <>
            <div className="max-w-7xl mx-auto mb-8 rounded-lg bg-white p-4 text-sm leading-6 shadow dark:border dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
                <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                    Hard Mode: Solubility and Net Ionic Equations
                </h2>
                <p className="mb-4 text-slate-700 dark:text-slate-200">
                    The hard mode is about <strong>aqueous ions, spectator ions, and precipitation reactions</strong>.
                    You are watching dissolved ions move through solution and deciding which ions matter to the actual
                    chemical change.
                </p>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Soluble vs. Insoluble</h3>
                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    A precipitation reaction happens when two aqueous solutions mix and form an
                    <strong> insoluble solid</strong>. That solid is called the <strong>precipitate</strong>.
                    In the game, the precipitate appears when the reacting ions meet.
                </p>
                <div className="mb-6">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/Bellarmine_University/BU%3A_Chem_104_(Christianson)/Phase_1%3A_An_Introduction_to_Chemistry/4%3A_Reactions_in_Aqueous_Solutions/4.2%3A_Precipitation_and_Solubility_Rules"
                        text="Review common solubility rules."
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Spectator Ions</h3>
                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    <strong>Spectator ions</strong> stay dissolved and do not become part of the precipitate. In a full
                    ionic equation they appear on both sides, so they cancel out when you write the
                    <strong> net ionic equation</strong>.
                </p>
                <div className="mb-6">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/Prince_Georges_Community_College/CHEM_2000%3A_Chemistry_for_Engineers_(Sinex)/Unit_4%3A_Chemical_Reactions/Chapter_8%3A_Reactions_in_Aqueous_Solutions/Chapter_8.2%3A_Precipitation_Reactions"
                        text="Review precipitation reactions and spectator ions."
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Net Ionic Equations</h3>
                <p className="mb-2 text-slate-700 dark:text-slate-200">
                    A <strong>net ionic equation</strong> keeps only the species that actually change. For example:
                </p>
                <p className="mb-3 font-mono text-slate-800 dark:text-slate-200">
                    Ag+(aq) + Cl-(aq) -&gt; AgCl(s)
                </p>
                <p className="mb-3 text-slate-700 dark:text-slate-200">
                    Sodium and nitrate are still present in solution, but they do not participate in the solid that
                    forms, so they are spectators.
                </p>
                <div className="mb-6">
                    <CarbleLink
                        url="https://chem.libretexts.org/Courses/University_of_Arkansas_Little_Rock/Chem_1402%3A_General_Chemistry_1_(Belford)/Text/4%3A_Chemical_Reactions_and_Quantities/4.10%3A_Net_Ionic_Equations"
                        text="Review how to write net ionic equations."
                    />
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100">What the Hard Game Is Testing</h3>
                <ul className="ml-6 list-disc text-slate-700 dark:text-slate-200">
                    <li>Can you recognize which ions are spectators?</li>
                    <li>Can you tell when a precipitate should form?</li>
                    <li>Can you connect the observed solid to the correct net ionic equation?</li>
                </ul>
            </div>
        </>
    );
};

export const WheresMyWaterEasyLesson: Lesson = () => {
    return (
        <>
            <div className="w-full max-w-5xl mt-6 mb-6 rounded shadow bg-white p-4 dark:border dark:border-slate-800 dark:bg-slate-950/60">
                <h2 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    Play Where&apos;s My Water?: Electron Configuration
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
                        <strong>Reset rerandomizes the board:</strong> the duck positions and the alligator tub shift
                        when the level resets, so you have to adapt your tunnel plan.
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
                    Play Where&apos;s My Water?: Solubility
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-200">
                    <li>
                        <strong>Goal:</strong> identify the spectator ions and connect the moving ions to the correct
                        precipitation result.
                    </li>
                    <li>
                        <strong>Watch the ions move:</strong> dissolved ions drift through the water from opposite sides
                        of the tank.
                    </li>
                    <li>
                        <strong>Click spectator ions:</strong> ions that stay dissolved should be collected as
                        spectators. Those are the ions that cancel from the net ionic equation.
                    </li>
                    <li>
                        <strong>Trigger the precipitate:</strong> when the reacting ions meet, the solid product should
                        appear if the pair is insoluble.
                    </li>
                    <li>
                        <strong>Read the equations:</strong> the side panel shows the molecular equation first and then
                        reveals the net ionic equation once the spectator ions are handled.
                    </li>
                    <li>
                        <strong>Watch for no-reaction cases:</strong> not every pair of aqueous ions forms a precipitate.
                    </li>
                </ul>
            </div>
        </>
    );
};
