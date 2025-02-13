import { useEffect, useMemo, useRef, useState } from "react";
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
  selectPlayerCaptureCooldown,
} from "../../data/gameSlice";
import {
  getVectorSum,
  isValidCell,
  PieceType,
  sleep,
} from "../../global/utils";
import Piece from "./Piece";

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
  const playerPosition = useSelector(selectPlayerPosition);
  const playerCooldown = useSelector(selectPlayerCaptureCooldown);

  // TEST

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
      dispatch(addPiece(7, 7, PieceType.BISHOP));
    })();
  }, []);

  // Handle Input
  useEffect(() => {
    // TODO: stop input for a few seconds when starting game
    if (input === "" || input === undefined || processing.current) return;
    // console.log("INPUT:", `"${input}"`);

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
    if (!isValidCell(movingTo)) return;

    let isCapturing = false;
    if (!(playerPosition.x === movingTo.x && playerPosition.y === movingTo.y)) {
      if (occupiedCellsMatrix[movingTo.y][movingTo.x] !== false) {
        if (playerCooldown <= 0) {
          isCapturing = true;
        } else {
          return; // TODO: Add attack logic
        }
      }
    }

    (async () => {
      processing.current = true;
      dispatch(movePlayer(direction.x, direction.y, isCapturing));
      await sleep(100);
      // console.log("Processing pieces");
      dispatch(processPieces());
      await sleep(250);
      processing.current = false;
    })();
  }, [input]);

  let pieceElements;
  pieceElements = Object.keys(pieces).map((pieceId) => {
    return (
      <Piece
        key={pieceId}
        gridPos={pieces[pieceId].position}
        type={pieces[pieceId].type}
      />
    );
  });

  const gridCells = useMemo(() => {
    const output = new Array(8).fill(null).map(() => new Array(8).fill(null));
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        output[y][x] = (
          <GridCell key={x + y * 8} pos={{ x, y }} isCapture={false} />
        );
      }
    }
    captureCells.forEach((cell) => {
      const { x, y } = cell;
      output[y][x] = (
        <GridCell key={x + y * 8} pos={{ x, y }} isCapture={true} />
      );
    });
    return output;
  }, [captureCells]);

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
      </div>
    </main>
  );
};

export default Game;
