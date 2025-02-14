import { useEffect, useState } from "react";
import { switchPage } from "../../data/menuSlice";
import { PageName, sleep, TRANSITION_HALF_LIFE } from "../../global/utils";
import styles from "./HowToPlayMenu.module.scss";
import { useDispatch } from "react-redux";
import WasdIcon from "./WasdIcon";

const HowToPlayMenu = () => {
  const [disabled, setDisabled] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const dispatch = useDispatch();
  // const currDifficulty = useSelector(selectDifficulty);
  // const currShowIndicators = useSelector(selectShowIndicators);

  // let difficultyStr = "";
  // switch (currDifficulty) {
  //   case Difficulty.EASY:
  //     difficultyStr = "EASY";
  //     break;
  //   case Difficulty.NORMAL:
  //     difficultyStr = "NORMAL";
  //     break;
  //   case Difficulty.HARD:
  //     difficultyStr = "HARD";
  //     break;
  // }
  // const showIndicatorsStr = currShowIndicators ? "ON" : "OFF";

  useEffect(() => {
    (async () => {
      await sleep(TRANSITION_HALF_LIFE);
      setDisabled(false);
    })();
  }, []);

  return (
    <main className={styles.howToPlayMenu}>
      <div>
        <h1 className={styles.heading}>HOW TO PLAY</h1>
        <div className={styles.wasdIcon}>
          <WasdIcon />
        </div>
        <p className={styles.instruction}>
          Move: WASD (or swipe)
          <br />
          Pass Turn: Space (or tap)
        </p>

        <div className={styles.barIcon}>
          <div className={styles.cooldownBarBG}>
            <div className={styles.cooldownBarFill}></div>
          </div>
        </div>
        <p className={styles.instruction}>
          Capture enemies by moving into them when the bar is full.
        </p>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className={styles.backButton}
          onClick={() => {
            if (isExiting) return;
            dispatch(switchPage(PageName.MAIN_MENU));
            setIsExiting(true);
          }}
          disabled={disabled}
        >
          BACK
        </button>
      </div>
    </main>
    // <main className={styles.optionsMenu}>
    //   <div>
    //     <h1 className={styles.heading}>OPTIONS</h1>
    //     <p className={styles.optionLabel}>DIFFICULTY</p>
    //     <button
    //       onMouseDown={(e) => e.preventDefault()}
    //       className={styles.optionButton}
    //       onClick={() => {
    //         if (isExiting) return;
    //         const newValue =
    //           currDifficulty === Difficulty.HARD
    //             ? Difficulty.EASY
    //             : currDifficulty + 1;
    //         dispatch(setDifficulty(newValue));
    //       }}
    //       disabled={disabled}
    //     >
    //       {difficultyStr}
    //     </button>
    //     <p className={styles.optionLabel}>SHOW INDICATORS</p>
    //     <button
    //       onMouseDown={(e) => e.preventDefault()}
    //       className={styles.optionButton}
    //       onClick={() => {
    //         if (isExiting) return;
    //         dispatch(setShowIndicators(!currShowIndicators));
    //       }}
    //       disabled={disabled}
    //     >
    //       {showIndicatorsStr}
    //     </button>
    //     <button
    //       onMouseDown={(e) => e.preventDefault()}
    //       className={styles.backButton}
    //       onClick={() => {
    //         if (isExiting) return;
    //         dispatch(switchPage(PageName.MAIN_MENU));
    //         setIsExiting(true);
    //       }}
    //       disabled={disabled}
    //     >
    //       BACK
    //     </button>
    //   </div>
    // </main>
  );
};

export default HowToPlayMenu;
