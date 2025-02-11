import { useDispatch } from "react-redux";
import { switchPage } from "../../data/menuSlice";
import { PageName } from "../../global/utils";
import styles from "./MainMenu.module.scss";

const MainMenu = () => {
  const dispatch = useDispatch();

  return (
    <main>
      <div>
        <h1>
          <span className={styles.subtitle}>PAWN's</span> GAMBIT
        </h1>
        <button onClick={() => dispatch(switchPage(PageName.GAME))}>
          PLAY
        </button>
        <button>OPTIONS</button>
        <button>CREDITS</button>
      </div>
    </main>
  );
};

export default MainMenu;
