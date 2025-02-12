import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInputs from "../../hooks/useInputs";
import GameUI from "./GameUI";
import styles from "./Game.module.scss";
import GridCell from "./GridCell";
import {
  movePlayer,
  selectPlayerPosition,
  resetState,
  processPieces,
  addPiece,
  selectAllPieces,
} from "../../data/gameSlice";
import {
  getVectorSum,
  isValidCell,
  PieceType,
  sleep,
} from "../../global/utils";
import Piece from "./Piece";
import { nanoid } from "@reduxjs/toolkit";

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
  const input = useInputs();
  const processing = useRef(false);
  const pieces = useSelector(selectAllPieces);
  const currState = useSelector((state) => state);

  // TEST
  const playerPosition = useSelector(selectPlayerPosition);
  const knightPosition = useRef({ x: 2, y: 0 });

  // DEBUG
  // useEffect(() => {
  //   console.log(playerPosition);
  // }, [playerPosition]);

  // Initialize game
  useEffect(() => {
    (async () => {
      await sleep(500);
      dispatch(resetState());
      dispatch(addPiece(1, 0, PieceType.KNIGHT));
      console.log("CURRENT STATE:", currState);
    })();
  }, []);

  // Handle Input
  useEffect(() => {
    // TODO: stop input for a few seconds when starting game
    if (input === "" || input === undefined || processing.current) return;
    // console.log("INPUT:", input);

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
      (async () => {
        processing.current = true;
        dispatch(movePlayer(direction.x, direction.y));
        await sleep(100);
        console.log("Processing pieces");
        dispatch(processPieces());
        await sleep(250);
        processing.current = false;
        console.log("CURRENT STATE:", currState);
      })();
    }
  }, [input]);

  let pieceElements;
  console.log("Pieces updated!");
  pieceElements = Object.keys(pieces).map((pieceId) => {
    // console.log("Looping over pieces, piece:", pieces[pieceId]);
    return (
      <Piece
        key={pieceId}
        gridPos={pieces[pieceId].position}
        type={pieces[pieceId].type}
      />
    );
  });

  return (
    <main>
      <GameUI />
      <div className={styles.graphicsGridBorder}></div>
      <div className={styles.graphicsGridTrunk}></div>
      <div className={styles.gridContainer}>{gridCells}</div>
      <div className={styles.piecesContainer}>
        {/* TEST */}
        <Piece gridPos={playerPosition} type={PieceType.PLAYER} />
        {pieceElements}
        {/* <Piece gridPos={knightPosition.current} type={PieceType.KNIGHT} /> */}
      </div>
    </main>
  );
};

export default Game;
