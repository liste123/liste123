import { useRef, useEffect, useState } from "react";
import { useKeyboardEvent } from "../../utils/use-keyboard-event";
import { useEffectDebounced } from "../../utils/use-effect-debounced";
import { useClickOutside } from "../../utils/use-click-outside";

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

  // Multiple ways to trigger the onBlur event
  useKeyboardEvent("Escape", onBlur, { target: inputRef });
  useKeyboardEvent("Enter", onBlur, { target: inputRef });
  useClickOutside(inputRef, onBlur);

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
