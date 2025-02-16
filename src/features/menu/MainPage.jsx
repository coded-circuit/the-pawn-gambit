import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { switchPage } from "../../data/menuSlice";
import { PageName, TRANSITION_HALF_LIFE, sleep } from "../../global/utils";
import styles from "./MainPage.module.scss";

import Logo from "./components/Logo";

const MainPage = () => {
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
          <Logo />
          {/* <span className={styles.subtitle}>THE LAST</span>PAWN */}
        </h1>
        <button
          onMouseDown={(e) => e.preventDefault()}
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
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (hasClicked) return;
            dispatch(switchPage(PageName.HOW_TO_PLAY));
            setHasClicked(true);
          }}
          disabled={disabled}
        >
          HOW TO PLAY
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (hasClicked) return;
            dispatch(switchPage(PageName.OPTIONS));
            setHasClicked(true);
          }}
          disabled={disabled}
        >
          OPTIONS
        </button>
        {/* <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (hasClicked) return;
            dispatch(switchPage(PageName.CREDITS));
            setHasClicked(true);
          }}
          disabled={disabled}
        >
          CREDITS
        </button> */}
      </div>
    </main>
  );
};

export default MainPage;
