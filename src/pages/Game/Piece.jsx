import { useEffect, useState } from "react";
import { assertIsVector, sleep } from "../../global/utils";
import styles from "./Piece.module.scss";
import Knight from "./PieceComponents/Knight";
import Queen from "./PieceComponents/Queen";
import Shadow from "./PieceComponents/Shadow";
import Bishop from "./PieceComponents/Bishop";
import Rook from "./PieceComponents/Rook";
import Pawn from "./PieceComponents/Pawn";

const Piece = ({ gridPos, type }) => {
  assertIsVector(gridPos);

  const [isMoving, setIsMoving] = useState(false);

  const gfxPlayerStyles = {
    // backgroundImage:
    //   "radial-gradient(70% 40% at 50% 70%, black, black 50%, transparent 50%)",
    top: (gridPos.y * 65) / 8 + "vmin",
    left: (gridPos.x * 65) / 8 + "vmin",
  };

  useEffect(() => {
    (async () => {
      setIsMoving(true);
      await sleep(250);
      setIsMoving(false);
    })();
  }, [gridPos]);

  return (
    <div className={`${styles.piece}`} style={gfxPlayerStyles}>
      <div className={isMoving ? styles.jumpReference : ""}>
        <Pawn />
      </div>
      <Shadow isMoving={isMoving} />
    </div>
  );
};

export default Piece;
