import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectShowIndicators } from "../../../../data/menuSlice";
import { isEven } from "../../../../global/utils";
import styles from "./GridCell.module.scss";
import GridCellWarning from "./GridCellWarning";

const GridCell = ({ pos, isCapture, isPotentialMove, onClick }) => {
  // This new log will tell us if the onClick prop is being received as a function.
  console.log(`GridCell at [${pos.x}, ${pos.y}] received onClick:`, typeof onClick === 'function');

  const showIndicators = useSelector(selectShowIndicators);
  const onEvenX = isEven(pos.x);
  const onEvenY = isEven(pos.y);
  const shouldBeEven = onEvenY ? onEvenX : !onEvenX;
  const cellClasses = shouldBeEven ? styles.evenGridCell : styles.oddGridCell;

  return (
    <div
      onClick={onClick}
      className={`${cellClasses} ${
        isPotentialMove ? styles.potentialMove : ""
      }`}
    >
      {showIndicators && (
        <div className={isCapture ? styles.visible : styles.invisible}>
          <GridCellWarning />
        </div>
      )}
    </div>
  );
};
GridCell.propTypes = {
  pos: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isCapture: PropTypes.bool.isRequired,
  isPotentialMove: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};


export default GridCell;