import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  PageName,
  sleep,
  TRANSITION_HALF_LIFE,
} from "../../../../global/utils";

import styles from "./UI.module.scss";
import { switchPage } from "../../../../data/menuSlice";
import { resetState } from "../../../../data/gameSlice";
import QuitSvg from "./QuitSvg";
import ResetSvg from "./ResetSvg";

const GameUI = ({
  touchHandlers,
  captureCooldownPercent,
  turnNumber,
  score,
}) => {
  const dispatch = useDispatch();
  const [turnNumberClass, setTurnNumberClass] = useState(styles.uiVariable);
  const [scoreClass, setScoreClass] = useState(styles.uiVariable);

  useEffect(() => {
    (async () => {
      setTurnNumberClass(`${styles.uiVariable} ${styles.puff}`);
      await sleep(200);
      setTurnNumberClass(`${styles.uiVariable}`);
    })();
  }, [turnNumber]);

  useEffect(() => {
    (async () => {
      setScoreClass(`${styles.uiVariable} ${styles.puff}`);
      await sleep(200);
      setScoreClass(`${styles.uiVariable}`);
    })();
  }, [score]);

  return (
    <div className={styles.hud}>
      <div className={styles.upperLeft}>
        <span className={styles.uiLabel}>SCORE:</span>
        <span className={scoreClass}>{score}</span>
        <span className={styles.uiLabel}>TURN:</span>
        <span className={turnNumberClass}>{turnNumber}</span>
      </div>
      <div className={styles.upperRight}>
        <button
          className={styles.uiButton}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            (async () => {
              dispatch(switchPage(PageName.GAME));
              await sleep(TRANSITION_HALF_LIFE);
              dispatch(resetState());
            })();
          }}
        >
          <ResetSvg />
        </button>
        <button
          className={styles.uiButton}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.target.blur();
            dispatch(switchPage(PageName.MAIN_MENU));
          }}
        >
          <QuitSvg />
        </button>
      </div>
      <div className={styles.lowerLeft}>
        <div className={styles.uiAttackIndicator}>A</div>
      </div>
      <div className={styles.upperCenter}>
        <div className={styles.cooldownBar}>
          <div className={styles.cooldownBarBG}>
            <div
              className={`${styles.cooldownBarFill} ${
                captureCooldownPercent >= 100.0 ? styles.barFull : ""
              }`}
              style={{ width: `${captureCooldownPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className={styles.touchArea} {...touchHandlers} />
    </div>
  );
};

export default GameUI;
