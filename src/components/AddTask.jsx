import { useRef } from "react";
import { useKeyboardEvent } from "../utils/use-keyboard-event";

const AddTask = ({ shortcut, onSubmit, scrollOptions = {}, ...props }) => {
  const inputRef = useRef();

  // Prepend items from input
  useKeyboardEvent(
    "enter",
    (evt) => {
      onSubmit(evt.target.value);
      evt.target.value = "";
      evt.target.focus();
      evt.target.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
        ...scrollOptions
      });
    },
    { target: inputRef }
  );

  useKeyboardEvent(shortcut, () => {
    inputRef.current.focus();
    inputRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
      ...scrollOptions
    });
  });

  return <input {...props} ref={inputRef} type="text" />;
};

export default AddTask;
