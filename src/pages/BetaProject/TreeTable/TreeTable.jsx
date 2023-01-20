import { useState, useRef } from "react";

import Nestable from "react-nestable";
import "react-nestable/dist/styles/index.css";
import "./nestable.css";

import { useEffectDebounced } from "../../../utils/use-effect-debounced";
import { usePushID } from "../../../utils/use-pushid";
import { list2tree, tree2list } from "./deeplist1";

const DEBOUNCE_DELAY = 0;

/**
 *
 * @param {Array} data { id, parentId, custom, fields, ...}
 * @returns
 */
export const TreeTable = ({ etag, value, onChange }) => {
  const { generatePushID } = usePushID();
  const isPropsUpdateRef = useRef(false);
  const etagRef = useRef(etag);
  const nestableRef = useRef(null);

  // Project state
  const [nodes, setNodes] = useState(list2tree(value.items));
  const [collapse, setCollapse] = useState(value.collapse);
  const [src, setSrc] = useState(JSON.stringify(value, null, 2));

  // Imports changes from the outside world into the component
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

      // Set internal state
      setNodes(list2tree(value.items));
      setCollapse(value.collapse);

      // Update Source Code Editor
      setSrc(JSON.stringify(value, null, 2));
    },
    [etag, value],
    { delay: DEBOUNCE_DELAY, firstDelay: 0, skipFirst: true }
  );

  // Exports the internal state to the outside world
  useEffectDebounced(
    () => {
      // Skip reacting to props updates
      // (this is to avoid circular loops with the outside world)
      if (isPropsUpdateRef.current) {
        isPropsUpdateRef.current = false;
        return;
      }

      // To update with whathever comes form the Nestable
      // Generate the PushID here so we can skip the same-data update
      etagRef.current = generatePushID();

      // Apply document changes
      console.log(`@TreeTable::update(${etagRef.current})`);
      onChange(
        {
          ...value,
          collapse,
          items: tree2list(nodes)
        },
        etagRef.current
      );
    },
    [nodes, collapse],
    { delay: DEBOUNCE_DELAY, skipFirst: true }
  );

  // Apply collapsed elements to Nestable
  useEffectDebounced(
    () => {
      nestableRef.current.collapse(collapse);
    },
    [collapse],
    { delay: 0 }
  );

  // Update from Source Code
  useEffectDebounced(
    () => {
      try {
        const _src = JSON.parse(src);
        setNodes(list2tree(_src.items));
        setCollapse(_src.collapse);
      } catch (err) {}
    },
    [src],
    { delay: 0, skipFirst: true }
  );

  const handleNestableChange = ({ items, dragItem, targetPath }) => {
    // Reassign parent using the change path provided by Nestable
    targetPath.pop();
    dragItem.parent = null;
    let collection = items;
    for (const idx of targetPath) {
      dragItem.parent = collection[idx];
      collection = parent.children;
    }

    // Apply new items to the internal state
    // (side effect: save the project and sync on other clients)
    setNodes(items);
  };

  const renderItem = ({ item }) => {
    return `${item.id} - ${item.meta.title}`;
  };

  return (
    <>
      <Nestable
        ref={nestableRef}
        items={nodes}
        renderItem={renderItem}
        onChange={handleNestableChange}
      />
      <hr />
      <textarea
        value={src}
        onChange={(e) => setSrc(e.currentTarget.value)}
        cols={50}
        rows={20}
      />
    </>
  );
};
