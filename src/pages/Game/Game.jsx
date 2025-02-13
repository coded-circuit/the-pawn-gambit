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
  assert,
  getVectorSum,
  isValidCell,
  PieceType,
  sleep,
} from "../../global/utils";
import Piece from "./Piece";

const Game = () => {
  const dispatch = useDispatch();
  const input = useInputs();
  const pieces = useSelector(selectAllPieces);
  const occupiedCellsMatrix = useSelector(selectOccupiedCellsMatrix);
  const captureCells = useSelector(selectCaptureCells);
  const playerPosition = useSelector(selectPlayerPosition);
  const playerCooldown = useSelector(selectPlayerCaptureCooldown);

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

  const [currentInput, setCurrentInput] = useState("");
  const inputQueued = useRef("");
  const [isProcessingInput, setIsProcessingInput] = useState(false);

  // console.log("----------------------\ncurrentInput:", currentInput);
  // console.log("inputQueued.current:", inputQueued.current);
  // console.log("isProcessingInput:", isProcessingInput);

  // The following three useEffects are for input queueing
  // ...
  useEffect(() => {
    // console.log("Input Use Effect");
    if (input === "" || input === undefined) return;
    if (isProcessingInput) {
      inputQueued.current = input;
      return;
    }
    assert(
      inputQueued.current === "",
      "Adding new input when queue isn't empty!"
    );
    setCurrentInput(input);
    setIsProcessingInput(true);
  }, [input]);

  useEffect(() => {
    // console.log("IsProcessingInput Use Effect");
    if (isProcessingInput === false) {
      if (inputQueued.current !== "") {
        setIsProcessingInput(true);
        setCurrentInput(inputQueued.current);
        inputQueued.current = "";
      }
    }
  }, [isProcessingInput]);

  useEffect(() => {
    if (currentInput === "") {
      return;
    }
    setCurrentInput("");

    // console.log("Current Input Use Effect");
    let direction = { x: 0, y: 0 };
    switch (currentInput) {
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
      setIsProcessingInput(false);
      return;
    }

    const movingTo = getVectorSum(playerPosition, direction);
    if (!isValidCell(movingTo)) {
      setIsProcessingInput(false);
      return;
    }

    let isCapturing = false;
    if (!(playerPosition.x === movingTo.x && playerPosition.y === movingTo.y)) {
      if (occupiedCellsMatrix[movingTo.y][movingTo.x] !== false) {
        if (playerCooldown <= 0) {
          isCapturing = true;
        } else {
          setIsProcessingInput(false);
          return;
        }
      }
    }

    (async () => {
      dispatch(movePlayer(direction.x, direction.y, isCapturing));
      await sleep(100);
      // console.log("Processing pieces");
      dispatch(processPieces());
      await sleep(250);
      setIsProcessingInput(false);
      // console.log("MAIN LOGIC END -----------");
    })();
  }, [currentInput]);

  const pieceComponents = useMemo(() => {
    return Object.keys(pieces).map((pieceId) => {
      return (
        <Piece
          key={pieceId}
          gridPos={pieces[pieceId].position}
          type={pieces[pieceId].type}
          willMove={pieces[pieceId].cooldown === 0}
        />
      );
    });
  }, [pieces]);

  const gridCellComponents = useMemo(() => {
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
      <div className={styles.gridContainer}>{gridCellComponents}</div>
      <div className={styles.piecesContainer}>
        {/* TEST */}
        <Piece gridPos={playerPosition} type={PieceType.PLAYER} />
        {pieceComponents}
      </div>
    </main>
  );
};

export default Game;
