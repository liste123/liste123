/**
 * Performs a useEffect() with a delay.
 *
 * https://www.npmjs.com/package/use-debounced-effect-hook
 * (has an issue with peer deps on React 16)
 *
 * https://www.npmjs.com/package/use-debounced-effect
 * (doesn't work with React.Strict)
 */

import { useEffect, useRef } from "react";

const OPTIONS = {
  // Debounce delay:
  delay: 0,

  // Debounce delay to be used only the first time:
  firstDelay: 0
};

export const useEffectDebounced = (fn, deps, options = OPTIONS) => {
  const isFirstLoad = useRef(true);

  const delay = options.delay || OPTIONS.delay;
  const firstDelay =
    options.firstDelay || options.firstDelay === 0 ? options.firstDelay : delay;

  useEffect(() => {
    const _timer = setTimeout(
      () => {
        fn();
        isFirstLoad.current = false;
      },
      isFirstLoad.current ? firstDelay : delay
    );

    return () => clearTimeout(_timer);
  }, deps);
};
