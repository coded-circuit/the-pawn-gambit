import { useSelector } from "react-redux";
import { MainMenu, Game, Options, Credits } from "./pages/index";
import { Transition } from "./components";
import { selectPage } from "./data/menuSlice";
import { PageName, TRANSITION_HALF_LIFE, sleep } from "./global/utils";
import { useEffect, useState } from "react";
import HowToPlayMenu from "./pages/MainMenu/HowToPlayMenu";
import OptionsMenu from "./pages/MainMenu/OptionsMenu";

function App() {
  const currentPage = useSelector(selectPage);
  const [pageElement, setPageElement] = useState();
  const [transitionElement, setTransitionElement] = useState();

  // Handle Page Transition
  useEffect(() => {
    (async () => {
      switch (currentPage.value) {
        case PageName.MAIN_MENU:
          setTransitionElement(<Transition />);
          await sleep(TRANSITION_HALF_LIFE);
          setPageElement(<MainMenu />);
          await sleep(TRANSITION_HALF_LIFE);
          setTransitionElement();
          break;
        case PageName.GAME:
          setTransitionElement(<Transition />);
          await sleep(TRANSITION_HALF_LIFE);
          setPageElement(<Game />);
          await sleep(TRANSITION_HALF_LIFE);
          setTransitionElement();
          break;
        case PageName.HOW_TO_PLAY:
          setTransitionElement(<Transition />);
          await sleep(TRANSITION_HALF_LIFE);
          setPageElement(<HowToPlayMenu />);
          await sleep(TRANSITION_HALF_LIFE);
          setTransitionElement();
          break;
        case PageName.OPTIONS:
          setTransitionElement(<Transition />);
          await sleep(TRANSITION_HALF_LIFE);
          setPageElement(<OptionsMenu />);
          await sleep(TRANSITION_HALF_LIFE);
          setTransitionElement();
          break;
        case PageName.CREDITS:
          setTransitionElement(<Transition />);
          await sleep(TRANSITION_HALF_LIFE);
          setPageElement(<Credits />);
          await sleep(TRANSITION_HALF_LIFE);
          setTransitionElement();
          break;
      }
    })();
  }, [currentPage]);

  return (
    <>
      {transitionElement}
      {pageElement}
    </>
  );
}

// function App() {
//   const currentPage = useSelector(selectPage);
//   const dispatch = useDispatch();
//   let pageElement;

//   switch (currentPage) {
//     case PageName.MAIN_MENU:
//       console.log("switched to MAIN MENU, currentPage", currentPage);
//       pageElement = <MainMenu />;
//       console.log(pageElement);
//       break;
//     case PageName.GAME:
//       console.log("switched to GAME, currentPage", currentPage);
//       pageElement = <Game />;
//       console.log(pageElement);
//       break;
//   }

//   return pageElement;
// }

export default App;
