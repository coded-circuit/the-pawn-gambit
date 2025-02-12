import styles from "./GridCell.module.scss";
import { isEven } from "../../global/utils";
import GridCellWarning from "./GridCellWarning";

const GridCell = ({ pos, isCapture }) => {
  const onEvenX = isEven(pos.x);
  const onEvenY = isEven(pos.y);
  const shouldBeEven = onEvenY ? onEvenX : !onEvenX;
  return (
    <div className={shouldBeEven ? styles.evenGridCell : styles.oddGridCell}>
      <div className={isCapture ? styles.visible : styles.invisible}>
        <GridCellWarning />
      </div>
    </div>
  );
};

export default GridCell;
