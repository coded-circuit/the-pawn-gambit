import { useEffect } from "react";
import GameUI from "./GameUI";
import styles from "./Game.module.scss";
import GridCell from "./GridCell";
import { useDispatch } from "react-redux";
import { resetState } from "../../data/gameSlice";

// Initialize the grid cells
const gridCells = new Array(8).fill(null).map(() => new Array(8).fill(null));
for (let y = 0; y < 8; y++) {
  for (let x = 0; x < 8; x++) {
    const i = x + y * 8;
    gridCells[y][x] = <GridCell key={i} pos={{ x, y }} />;
  }
}

const Game = () => {
  const dispatch = useDispatch();

  //Initialize game
  useEffect(() => {
    dispatch(resetState());
  }, []);

  return (
    <main>
      <GameUI />
      <div className={styles.graphicsGridBorder}></div>
      <div className={styles.graphicsGridTrunk}></div>
      <div className={styles.gridContainer}>{gridCells}</div>
    </main>
  );
};

export default Game;
