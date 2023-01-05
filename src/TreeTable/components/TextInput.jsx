import { useRef, useEffect, useState } from "react";
import { useKeyboardEvent } from "../../utils/use-keyboard-event";
import { useEffectDebounced } from "../../utils/use-effect-debounced";

const TextInput = ({ value, onChange, onBlur }) => {
  const inputRef = useRef();
  const [_value, setValue] = useState(value);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffectDebounced(
    () => {
      console.log("hit");
      onChange(_value);
    },
    [_value],
    { delay: 500, skipFirst: true }
  );

  useKeyboardEvent("Escape", onBlur, { target: inputRef });
  useKeyboardEvent("Enter", onBlur, { target: inputRef });

  return (
    <input
      ref={inputRef}
      type="text"
      value={_value}
      onChange={(e) => setValue(e.target.value)}
      style={{ flex: 1 }}
    />
  );
};

export default TextInput;
