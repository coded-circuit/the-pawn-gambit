import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  PageName,
  sleep,
  TRANSITION_HALF_LIFE,
} from "../../../../global/utils";

import styles from "./UI.module.scss";
import { switchPage } from "../../../../data/menuSlice";
import { resetState, selectPlayerCooldownMax, selectPlayerLevel, upgradePlayer } from "../../../../data/gameSlice";
import QuitSvg from "./QuitSvg";
import ResetSvg from "./ResetSvg";

const GameUI = ({
  touchHandlers,
  captureCooldownPercent,
  turnNumber,
  score,
  isGameOver
}) => {
  const dispatch = useDispatch();
  const [turnNumberClass, setTurnNumberClass] = useState(styles.uiVariable);
  const [scoreClass, setScoreClass] = useState(styles.uiVariable);
  const cooldownMax = useSelector(selectPlayerCooldownMax);
  const playerLevel = useSelector(selectPlayerLevel);

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
      <div className={isGameOver ? styles.gameOver : styles.notGameOver}>
        <span className={styles.gameOverText}>GAME OVER</span>
        <span className={styles.scoreText}>{score}</span>
        <span className={styles.subtitleText}>You survived {turnNumber} {turnNumber === 1 ? "turn!" : "turns!"}</span>
      </div>
      <div className={styles.upperLeft}>
        <span className={styles.uiLabel}>SCORE:</span>
        <span className={scoreClass}>{score}</span>
        <span className={styles.uiLabel}>TURN:</span>
        <span className={turnNumberClass}>{turnNumber}</span>
        <div className={styles.upgradeRow}>
          <button
            className={styles.upgradeButton}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => dispatch(upgradePlayer())}
            disabled={cooldownMax <= 2}
            aria-label="Upgrade Player"
            title={cooldownMax > 2 ? `Reduce cooldown max to ${cooldownMax - 1}` : "Maxed"}
          >
            UPGRADE
          </button>
          <div className={styles.upgradeInfo}>
            <span>LVL {playerLevel}</span>
            <span>CD MAX {cooldownMax}</span>
          </div>
        </div>
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
