import { useState, useRef } from "react";

import { useEffectDebounced } from "../../../utils/use-effect-debounced";
import { usePushID } from "../../../utils/use-pushid";

const DEBOUNCE_DELAY = 0;

/**
 *
 * @param {Array} data { id, parentId, custom, fields, ...}
 * @returns
 */
export const TreeTable = ({ etag, value, onChange }) => {
  const { generatePushID } = usePushID();
  const [src, setSrc] = useState(JSON.stringify(value, null, 2));
  const isPropsUpdateRef = useRef(false);
  const etagRef = useRef(etag);

  /**
   * Imports changes from the outside world into the component.
   */
  useEffectDebounced(
    () => {
      // Skip loopback updates from outside state management
      if (etag === etagRef.current) {
        etagRef.current = etag;
        return;
      }

      console.log(`@TreeTable::reset(${etag})`);

      // Mark the data change as driven by a props update activity
      // (this is to avoid circular loops with the outside world)
      isPropsUpdateRef.current = true;

      setSrc(JSON.stringify(value, null, 2));
    },
    [etag, value],
    { delay: DEBOUNCE_DELAY, firstDelay: 0, skipFirst: true }
  );

  useEffectDebounced(
    () => {
      // Skip reacting to props updates
      // (this is to avoid circular loops with the outside world)
      if (isPropsUpdateRef.current) {
        isPropsUpdateRef.current = false;
        return;
      }

      // To update with whathever comes form the Nestable
      try {
        const data = JSON.parse(src);

        // Generate the PushID here so we can skip the same-data update
        etagRef.current = generatePushID();

        console.log(`@TreeTable::update(${etagRef.current})`);
        onChange(data, etagRef.current);
      } catch (err) {
        console.log(`SRC ERROR: ${err.message}`);
      }
    },
    [src],
    { delay: DEBOUNCE_DELAY, skipFirst: true }
  );

  return (
    <textarea
      value={src}
      onChange={(e) => setSrc(e.currentTarget.value)}
      cols={50}
      rows={30}
    />
  );
};

// export default TreeTable;
