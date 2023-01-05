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
  firstDelay: 0,

  skipFirst: false
};

export const useEffectDebounced = (fn, deps, options = OPTIONS) => {
  const isFirstLoad = useRef(true);

  const delay = options.delay || OPTIONS.delay;
  const skipFirst = options.skipFirst || OPTIONS.skipFirst;
  const firstDelay =
    options.firstDelay || skipFirst
      ? 0 // Skip first will force the first delay to zero if not explicitly set
      : options.firstDelay === 0
      ? options.firstDelay
      : delay;

  useEffect(() => {
    // Skip first execution

    const _timer = setTimeout(
      () => {
        if (isFirstLoad.current && skipFirst) {
          console.log("Skip first exec");
          isFirstLoad.current = false;
          return;
        }

        fn();
        isFirstLoad.current = false;
      },
      isFirstLoad.current ? firstDelay : delay
    );

    return () => clearTimeout(_timer);
  }, deps);
};
