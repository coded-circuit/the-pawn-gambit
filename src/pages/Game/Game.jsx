import { useEffect } from "react";
import GameUI from "./GameUI";
import styles from "./Game.module.scss";

const Game = () => {
  useEffect(() => {
    // Initialize game
  }, []);

  return (
    <main>
      <GameUI />
      <div className={styles.graphicsGridBorder}></div>
      <div className={styles.graphicsGridTrunk}></div>
      <div className={styles.gridContainer}>
        <div className={styles.grid}></div>
      </div>
    </main>
  );
};

export default Game;
