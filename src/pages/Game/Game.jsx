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
  selectOccupiedCellsMatrix,
  selectCaptureCells,
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
// const gridCells = new Array(8).fill(null).map(() => new Array(8).fill(null));
// for (let y = 0; y < 8; y++) {
//   for (let x = 0; x < 8; x++) {
//     const i = x + y * 8;
//     gridCells[y][x] = <GridCell key={i} pos={{ x, y }} />;
//   }
// }

const Game = () => {
  const dispatch = useDispatch();
  const input = useInputs();
  const processing = useRef(false);
  const pieces = useSelector(selectAllPieces);
  const occupiedCellsMatrix = useSelector(selectOccupiedCellsMatrix);
  const captureCells = useSelector(selectCaptureCells);

  // TEST
  const playerPosition = useSelector(selectPlayerPosition);

  // DEBUG
  // useEffect(() => {
  //   console.log(playerPosition);
  // }, [playerPosition]);

  // Initialize game
  useEffect(() => {
    (async () => {
      await sleep(600);
      dispatch(resetState());
      dispatch(addPiece(0, 0, PieceType.PAWN_E));
      dispatch(addPiece(3, 0, PieceType.PAWN_S));
      dispatch(addPiece(1, 1, PieceType.KNIGHT));
      dispatch(addPiece(1, 4, PieceType.QUEEN));
      dispatch(addPiece(6, 7, PieceType.ROOK));
      // dispatch(addPiece(3, 1, PieceType.QUEEN));
      // dispatch(addPiece(7, 6, PieceType.ROOK));
      // dispatch(addPiece(0, 5, PieceType.PAWN_E));
    })();
  }, []);

  // Handle Input
  useEffect(() => {
    // TODO: stop input for a few seconds when starting game
    if (input === "" || input === undefined || processing.current) return;
    console.log("INPUT:", `"${input}"`);

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
      case " ":
        break;
      default:
        direction = null;
    }
    if (direction === null) {
      return;
    }

    const movingTo = getVectorSum(playerPosition, direction);
    if (!(playerPosition.x === movingTo.x && playerPosition.y === movingTo.y)) {
      if (occupiedCellsMatrix[movingTo.y][movingTo.x]) {
        return; // TODO: Add attack logic
      }
      // 0, 1
    }
    if (isValidCell(movingTo)) {
      (async () => {
        processing.current = true;
        dispatch(movePlayer(direction.x, direction.y));
        await sleep(100);
        console.log("Processing pieces");
        dispatch(processPieces());
        await sleep(250);
        processing.current = false;
      })();
    }
  }, [input]);

  let pieceElements;
  console.log("Something updated!");
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

  const gridCells = new Array(8).fill(null).map(() => new Array(8).fill(null));
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      gridCells[y][x] = (
        <GridCell key={x + y * 8} pos={{ x, y }} isCapture={false} />
      );
    }
  }
  captureCells.forEach((cell) => {
    const { x, y } = cell;
    gridCells[y][x] = (
      <GridCell key={x + y * 8} pos={{ x, y }} isCapture={true} />
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
