import { useDispatch, useSelector } from "react-redux";
import { PageName } from "../../global/utils";
import { switchPage } from "../../data/menuSlice";
import styles from "./GameUI.module.scss";
import {
  playerCaptureCooldown,
  selectPlayerCaptureCooldown,
} from "../../data/gameSlice";

const GameUI = () => {
  const dispatch = useDispatch();
  const captureCooldown = useSelector(selectPlayerCaptureCooldown);
  const captureCooldownPercent =
    (1 - captureCooldown / playerCaptureCooldown) * 100;

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
      <div className={styles.upperCenter}>
        <div className={styles.cooldownBar}>
          <div className={styles.cooldownBarBG}>
            <div
              className={styles.cooldownBarFill}
              style={{ width: `${captureCooldownPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
