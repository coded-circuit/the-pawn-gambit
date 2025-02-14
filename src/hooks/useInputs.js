import { useCallback, useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { sleep } from "../global/utils";
const inputKeys = ["w", "a", "s", "d", " "];

const createSwipeHandler = (setInput, inputStr) => {
  return () => {
    (async () => {
      setInput(inputStr);
      await sleep(1);
      setInput("");
    })();
  };
};

const useInputs = () => {
  const [input, setInput] = useState();
  const swipeHandlers = useSwipeable({
    onSwipedLeft: createSwipeHandler(setInput, "a"),
    onSwipedRight: createSwipeHandler(setInput, "d"),
    onSwipedUp: createSwipeHandler(setInput, "w"),
    onSwipedDown: createSwipeHandler(setInput, "s"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const prevInput = useRef("");
  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();
    if (inputKeys.includes(key)) {
      if (key === prevInput.current) return;

      setInput(key);
      prevInput.current = key;
    }
  }, []);
  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase();
    if (inputKeys.includes(key)) {
      if (key === prevInput.current) {
        prevInput.current = "";
        setInput("");
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return { input, swipeHandlers };
};

export default useInputs;
