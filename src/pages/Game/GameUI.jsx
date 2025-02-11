import { useDispatch } from "react-redux";
import { PageName } from "../../global/utils";
import { switchPage } from "../../data/menuSlice";
import styles from "./GameUI.module.scss";

const GameUI = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.hud}>
      <div className={styles.upperLeft}>
        <p>
          <span className={styles.uiLabel}>SCORE:</span>12500
        </p>
        <p>
          <span className={styles.uiLabel}>TURN:</span>5
        </p>
      </div>
      <div className={styles.upperRight}>
        <button className={styles.uiButton}>Guide</button>
        <button className={styles.uiButton}>Reset</button>
        <button
          className={styles.uiButton}
          onClick={() => {
            dispatch(switchPage(PageName.MAIN_MENU));
          }}
        >
          Pause
        </button>
      </div>
      <div className={styles.lowerLeft}>
        <div className={styles.uiAttackIndicator}>A</div>
      </div>
    </div>
  );
};

export default GameUI;
