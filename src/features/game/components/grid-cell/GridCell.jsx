import { selectShowIndicators } from "../../../../data/menuSlice";
import styles from "./GridCell.module.scss";
import GridCellWarning from "./GridCellWarning";
import { isEven } from "../../../../global/utils";
import { useSelector } from "react-redux";

const GridCell = ({ pos, isCapture }) => {
  const showIndicators = useSelector(selectShowIndicators);
  const onEvenX = isEven(pos.x);
  const onEvenY = isEven(pos.y);
  const shouldBeEven = onEvenY ? onEvenX : !onEvenX;
  return (
    <div
      className={shouldBeEven ? styles.evenGridCell : styles.oddGridCell}
      // style={{backgroundColor: debug.occupied? "gray": ""}}
    >
      {showIndicators && (
        <div className={isCapture ? styles.visible : styles.invisible}>
          <GridCellWarning />
        </div>
      )}
    </div>
  );
};

export default GridCell;
