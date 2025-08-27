import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPiece,
  addXP,
  endGame,
  movePlayer,
  playerCaptureCooldown,
  processPieces,
  resetState,
  selectAllPieces,
  selectCaptureCells,
  selectGems,
  selectIsGameOver,
  selectLivesLeft,
  selectOccupiedCellsMatrix,
  selectPlayerCaptureCooldown,
  selectPlayerPieceType,
  selectPlayerPosition,
  selectTotalGems,
  selectTotalTurnsSurvived,
  selectTotalXP,
  selectTurnNumber,
  selectXP,
  updateCaptureTiles,
} from "../../data/gameSlice";
import GridCell from "./components/grid-cell/GridCell";
import Piece from "./components/piece/Piece";
import UI from "./components/ui/UI";
import styles from "./GamePage.module.scss";

import { arrayHasVector, extractOccupiedCells, sleep } from "../../global/utils";
import { PieceMovementFunc } from "./logic/piece";
import { getPerSecondXPIncrease } from "./logic/score";
import { getNumberToSpawn, getPieceWithPos } from "./logic/spawning";

import { selectDifficulty } from "../../data/menuSlice";
import store from "../../data/store";

const GamePage = () => {
  const dispatch = useDispatch();
  const pieces = useSelector(selectAllPieces);
  const occupiedCellsMatrix = useSelector(selectOccupiedCellsMatrix);
  const captureCells = useSelector(selectCaptureCells);
  const playerPosition = useSelector(selectPlayerPosition);
  const playerCooldownLeft = useSelector(selectPlayerCaptureCooldown);
  const turnNumber = useSelector(selectTurnNumber);
  const xp = useSelector(selectXP);
  const isGameOver = useSelector(selectIsGameOver);
  const difficulty = useSelector(selectDifficulty);
  const gems = useSelector(selectGems);
  const livesLeft = useSelector(selectLivesLeft);
  const totalXP = useSelector(selectTotalXP);
  const totalGems = useSelector(selectTotalGems);
  const totalTurnsSurvived = useSelector(selectTotalTurnsSurvived);
  const playerPieceType = useSelector(selectPlayerPieceType);
  const [potentialMoves, setPotentialMoves] = useState([]);
  const inactivityTimer = useRef(null);

  // Initialize game on mount
  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  // Timed XP Gain
  useEffect(() => {
    if (isGameOver) {
      return;
    }
    const xpPerSecond = getPerSecondXPIncrease(difficulty);
    const intervalId = setInterval(() => {
      dispatch(addXP(xpPerSecond));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isGameOver, difficulty, dispatch]);

  // Calculate potential moves whenever the board state changes
  useEffect(() => {
    if (isGameOver) {
      setPotentialMoves([]); // Clear moves when game is over
      return;
    }
    const moves = PieceMovementFunc[playerPieceType](
      playerPosition,
      playerPosition,
      extractOccupiedCells(occupiedCellsMatrix)
    );
    setPotentialMoves(moves);
  }, [playerPosition, playerPieceType, occupiedCellsMatrix, isGameOver]);

  // Unified game turn logic
  const handleCellClick = (pos) => {
    // Prevent moves if the game is over
    if (isGameOver) return;

    if (arrayHasVector(potentialMoves, pos)) {
      // Clear any existing timer as soon as a valid move starts
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      let isCapturing = occupiedCellsMatrix[pos.y][pos.x] !== false;

      (async () => {
        // --- Core Game Loop ---
        dispatch(movePlayer(pos, isCapturing, difficulty));
        await sleep(100);
        dispatch(processPieces());
        dispatch(updateCaptureTiles());
        await sleep(200);

        // Check for game over after enemy pieces have moved
        if (store.getState().game.isGameOver) {
          if (store.getState().game.livesLeft <= 0) {
            dispatch(endGame());
          }
          return; // Stop the turn if the game is over
        }

        // Spawn new pieces
        for (let i = 0; i < getNumberToSpawn(difficulty); i++) {
          const { type, pos: spawnPos } = getPieceWithPos(difficulty);
          if (
            store.getState().game.occupiedCellsMatrix[spawnPos.y][spawnPos.x] === false
          ) {
            dispatch(addPiece(spawnPos.x, spawnPos.y, type));
          }
        }
        await sleep(5);
        dispatch(updateCaptureTiles());

        // --- Turn End ---
        // After a successful turn, set a new inactivity timer
        inactivityTimer.current = setTimeout(() => {
          dispatch(endGame());
        }, 20000); // 20 seconds
      })();
    }
  };

  const pieceComponents = useMemo(
    () =>
      Object.keys(pieces).map((pieceId) => (
        <Piece
          key={pieceId}
          gridPos={pieces[pieceId].position}
          type={pieces[pieceId].type}
          cooldownLeft={pieces[pieceId].cooldown}
          isCaptured={pieces[pieceId].isCaptured}
        />
      )),
    [pieces]
  );

  const gridCellComponents = useMemo(() => {
    const output = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const isPotentialMove = arrayHasVector(potentialMoves, { x, y });
        const isCaptureCell = captureCells.some(
          (cell) => cell.x === x && cell.y === y
        );
        output[y][x] = (
          <GridCell
            key={`${x}-${y}`}
            pos={{ x, y }}
            isCapture={isCaptureCell}
            onClick={() => handleCellClick({ x, y })}
            isPotentialMove={isPotentialMove}
          />
        );
      }
    }
    return output;
  }, [potentialMoves, captureCells]);

  return (
    <main>
      <UI
        turnNumber={turnNumber}
        xp={xp}
        gems={gems}
        livesLeft={livesLeft}
        totalXP={totalXP}
        totalGems={totalGems}
        totalTurnsSurvived={totalTurnsSurvived}
        captureCooldownPercent={
          (1 - playerCooldownLeft / playerCaptureCooldown) * 100
        }
        isGameOver={isGameOver}
        playerPieceType={playerPieceType}
      />
      <div className={styles.graphicsGridBorder}></div>
      <div className={styles.graphicsGridTrunk}></div>
      <div className={styles.gridContainer}>{gridCellComponents}</div>
      <div className={styles.piecesContainer}>
        <Piece
          gridPos={playerPosition}
          type={playerPieceType}
          isCaptured={isGameOver}
        />
        {pieceComponents}
      </div>
    </main>
  );
};

export default GamePage;