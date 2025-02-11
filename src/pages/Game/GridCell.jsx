import styles from "./GridCell.module.scss";
import { isEven } from "../../global/utils";

const GridCell = ({ pos }) => {
  const onEvenX = isEven(pos.x);
  const onEvenY = isEven(pos.y);
  const shouldBeEven = onEvenY ? onEvenX : !onEvenX;
  return (
    <div
      className={shouldBeEven ? styles.evenGridCell : styles.oddGridCell}
    ></div>
  );
};

export default GridCell;
