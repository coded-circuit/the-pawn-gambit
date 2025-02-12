import { useEffect, useState } from "react";
import { assert, assertIsVector, PieceType, sleep } from "../../global/utils";
import styles from "./Piece.module.scss";
import Knight from "./PieceComponents/Knight";
import Queen from "./PieceComponents/Queen";
import Shadow from "./PieceComponents/Shadow";
import Bishop from "./PieceComponents/Bishop";
import Rook from "./PieceComponents/Rook";
import Pawn from "./PieceComponents/Pawn";
import Player from "./PieceComponents/Player";

const Piece = ({ gridPos, type }) => {
  assertIsVector(gridPos);

  const [isMoving, setIsMoving] = useState(false);

  const gfxPlayerStyles = {
    top: (gridPos.y * 65) / 8 + "vmin",
    left: (gridPos.x * 65) / 8 + "vmin",
    zIndex: gridPos.y * 8 + gridPos.x,
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
      <div className={isMoving ? styles.jumpReference : ""}>
        {pieceComponent}
      </div>
      <Shadow isMoving={isMoving} />
    </div>
  );
};

export default Piece;
