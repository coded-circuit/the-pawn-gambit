import { useEffect } from "react";
import GameUI from "./GameUI";
import styles from "./Game.module.scss";
import GridCell from "./GridCell";
import { Vector2 } from "../../global/utils";

const gridCells = Array(64).fill(null);

const gridCellPositions = Array(64).fill(new Vector2());
for (let y = 0; y < 8; y++) {
  for (let x = 0; x < 8; x++) {
    gridCellPositions[x + y * 8] = new Vector2(x, y);
  }
}

const Game = () => {
  useEffect(() => {
    //Initialize game
  }, []);

  return (
    <main>
      <GameUI />
      <div className={styles.graphicsGridBorder}></div>
      <div className={styles.graphicsGridTrunk}></div>
      <div className={styles.gridContainer}>
        {gridCellPositions.map((pos, i) => {
          return <GridCell key={i} pos={pos} />;
        })}
      </div>
    </main>
  );
};

export default Game;
