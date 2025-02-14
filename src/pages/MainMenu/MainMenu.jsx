import { useDispatch } from "react-redux";
import { switchPage } from "../../data/menuSlice";
import { PageName, TRANSITION_HALF_LIFE, sleep } from "../../global/utils";
import styles from "./MainMenu.module.scss";
import { useEffect, useState } from "react";

const MainMenu = () => {
  const [disabled, setDisabled] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await sleep(TRANSITION_HALF_LIFE);
      setDisabled(false);
    })();
  }, []);

  return (
    <main className={styles.mainMenu}>
      <div>
        <h1 className={styles.logo}>
          <span className={styles.subtitle}>PAWN's</span> GAMBIT
        </h1>
        <button
          onClick={() => {
            if (hasClicked) return;
            dispatch(switchPage(PageName.GAME));
            setHasClicked(true);
          }}
          disabled={disabled}
        >
          PLAY
        </button>
        <button
          onClick={() => {
            if (hasClicked) return;
            dispatch(switchPage(PageName.OPTIONS));
            setHasClicked(true);
          }}
          disabled={disabled}
        >
          OPTIONS
        </button>
        <button
          onClick={() => {
            if (hasClicked) return;
            dispatch(switchPage(PageName.CREDITS));
            setHasClicked(true);
          }}
          disabled={disabled}
        >
          CREDITS
        </button>
      </div>
    </main>
  );
};

export default MainMenu;
