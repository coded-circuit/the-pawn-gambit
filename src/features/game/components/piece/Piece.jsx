import { useEffect, useState } from "react";
import {
  PieceType,
  assert,
  assertIsVector,
  sleep,
} from "../../../../global/utils";
import styles from "./Piece.module.scss";

import Bishop from "./BishopSvg";
import Knight from "./KnightSvg";
import Pawn from "./PawnSvg";
import Player from "./PlayerSvg";
import Queen from "./QueenSvg";
import Rook from "./RookSvg";
import Shadow from "./ShadowSvg";

const Piece = ({ gridPos, type, cooldownLeft, isCaptured }) => {
  assertIsVector(gridPos);

  const [isMoving, setIsMoving] = useState(false);

  const gfxPlayerStyles = {
    top: (gridPos.y * 65) / 8 + "vmin",
    left: (gridPos.x * 65) / 8 + "vmin",
    zIndex: gridPos.y * 8 + gridPos.x,
    opacity: isCaptured ? 0.0 : 1.0,
  };

  useEffect(() => {
    (async () => {
      setIsMoving(true);
      await sleep(250);
      setIsMoving(false);
    })();
  }, [gridPos]);

  let pieceComponent;
  switch (type) {
    case PieceType.PLAYER:
      pieceComponent = <Player />;
      break;
    case PieceType.QUEEN:
      pieceComponent = <Queen />;
      break;
    case PieceType.ROOK:
      pieceComponent = <Rook />;
      break;
    case PieceType.BISHOP:
      pieceComponent = <Bishop />;
      break;
    case PieceType.KNIGHT:
      pieceComponent = <Knight />;
      break;
    case PieceType.PAWN_N:
    case PieceType.PAWN_E:
    case PieceType.PAWN_W:
    case PieceType.PAWN_S:
      pieceComponent = <Pawn />;
      break;
    default:
      assert(false, `Invalid type in Piece.jsx! (${type})`);
  }

  return (
    <div className={styles.piece} style={gfxPlayerStyles}>
      <div
        className={
          isMoving
            ? `${styles.jumpReference} ${styles.jumping}`
            : styles.jumpReference
        }
      >
        <div
          className={
            cooldownLeft === 0
              ? styles.jiggleReference
              : cooldownLeft === 99
              ? styles.celebrateReference
              : styles.danceReference
          }
          // className={styles.danceReference}
        >
          {pieceComponent}
        </div>
      </div>
      <Shadow isMoving={isMoving} />
    </div>
  );
};

export default Piece;
