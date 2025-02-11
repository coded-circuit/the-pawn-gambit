import { useDispatch, useSelector } from "react-redux";
import { MainMenu, Game } from "./pages/index";
import "./App.module.scss";
import { selectPage } from "./data/menuSlice";
import { PageName } from "./global/utils";
import { useEffect, useState } from "react";

function App() {
  const currentPage = useSelector(selectPage);
  const dispatch = useDispatch();
  const [pageElement, setPageElement] = useState();
  console.log(currentPage);

  useEffect(() => {
    switch (currentPage) {
      case PageName.MAIN_MENU:
        setPageElement(<MainMenu />);
        break;
      case PageName.GAME:
        setPageElement(<Game />);
        break;
    }
  }, [currentPage]);

  return pageElement;
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
