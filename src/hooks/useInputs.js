import { useCallback, useEffect, useRef, useState } from "react";

const useInputs = () => {
  const [input, setInput] = useState();
  const prevInput = useRef("");
  const handleKeyDown = useCallback((e) => {
    if (["w", "a", "s", "d"].includes(e.key)) {
      if (e.key === prevInput.current) return;

      setInput(e.key);
      prevInput.current = e.key;
    }
  }, []);
  const handleKeyUp = useCallback((e) => {
    if (["w", "a", "s", "d"].includes(e.key)) {
      if (e.key === prevInput.current) {
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

  return input;
};

export default useInputs;
