import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInputs from "../../hooks/useInputs";
import GameUI from "./GameUI";
import styles from "./Game.module.scss";
import GridCell from "./GridCell";
import { movePlayer, selectPlayerPosition } from "../../data/gameSlice";
import { getVectorSum, isValidCell } from "../../global/utils";

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
  // TEST
  const playerPosition = useSelector(selectPlayerPosition);
  const input = useInputs();

  // TEST
  const gfxPlayerStyles = {
    backgroundColor: "black",
    position: "absolute",
    width: "10vw",
    height: "10vh",
    left: "calc(65vmin + " + playerPosition.x * 3 + "rem)",
    top: playerPosition.y * 3 + "rem",
    transition: "all 0.2s",
  };

  // Handle Input
  useEffect(() => {
    // TODO: stop input for a few seconds when starting game
    // console.log(input);
    if (input === "") return;
    console.log("INPUT:", input);

    let direction = { x: 0, y: 0 };
    switch (input) {
      case "w":
        direction.y = -1;
        break;
      case "a":
        direction.x = -1;
        break;
      case "s":
        direction.y = 1;
        break;
      case "d":
        direction.x = 1;
        break;
    }
    if (direction.x === 0 && direction.y === 0) {
      return;
    }
    if (isValidCell(getVectorSum(playerPosition, direction))) {
      dispatch(movePlayer(direction.x, direction.y));
    }
  }, [input]);

  // TEST
  useEffect(() => {
    console.log(playerPosition);
  }, [playerPosition]);

  //Initialize game
  useEffect(() => {
    // dispatch(resetState());
  }, []);

  return (
    <main>
      <GameUI />
      <div className={styles.graphicsGridBorder}></div>
      <div className={styles.graphicsGridTrunk}></div>
      <div className={styles.gridContainer}>{gridCells}</div>
      {/* TEST */}
      <div style={gfxPlayerStyles}></div>
    </main>
  );
};

export default Game;
