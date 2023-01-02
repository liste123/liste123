import { useEffect, useRef } from "react";

const DEFAULT_OPTIONS = {
  preventDefault: true,
  debounceDelay: 0
};

const getKeyName = (code) => {
  if (code.includes("Key")) return code.substr(3, 1);
  if (code.includes("Digit")) return code.substr(5, 1);
  return code.toUpperCase();
};

/**
 *
 * @param {String} combo Event combo: "ALT + C", "ctrl+z" (case insensitive)
 * @param {Function} fn the callback
 * @param {Object} options See DEFAULT_OPTIONS
 */
export const useKeyboardEvent = (combo = "", fn, options = DEFAULT_OPTIONS) => {
  const debounceRef = useRef(null);

  const { preventDefault, debounceDelay } = { ...DEFAULT_OPTIONS, ...options };
  const comboTokens = combo.split("+").map(($) => $.trim().toUpperCase());

  useEffect(() => {
    const onKeyPress = (evt) => {
      const eventTokens = [
        getKeyName(evt.code, evt.keyCode),
        evt.altKey ? "ALT" : null,
        evt.ctrlKey ? "CTRL" : null,
        evt.metaKey ? "META" : null,
        evt.shiftKey ? "SHIFT" : null
      ].filter(($) => Boolean($));

      // console.log(eventTokens);

      // All comboTokens must be present in the eventTokens
      if (comboTokens.every(($) => eventTokens.includes($))) {
        preventDefault && evt.preventDefault();

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(
          () =>
            fn(evt, {
              tokens: {
                combo: comboTokens,
                event: eventTokens
              }
            }),
          debounceDelay
        );
      }
    };

    // Bind to DOM (body)
    document.addEventListener("keydown", onKeyPress);

    // Unbind and clear timeout
    return () => {
      document.removeEventListener("keydown", onKeyPress);
      clearTimeout(debounceRef.current);
    };
  }, []);
};
