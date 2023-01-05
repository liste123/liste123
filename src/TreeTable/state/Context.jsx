import { createContext, useState, useRef, forwardRef } from "react";

import { arrayToTree } from "performant-array-to-tree";
import { useEffectDebounced } from "../../utils/use-effect-debounced";
import { flat, createNode } from "../deeplist";
import { useCreatePubSub } from "../../utils/use-pubsub";
import { useKeyboard } from "./use-keyboard";

const DEBOUNCE_DELAY = 0;

export const TreeTableContext = createContext();

export const withTreeTable = (Component) =>
  forwardRef((props, ref) => {
    const { data, onChange } = props;
    const isPropsUpdateRef = useRef(false);
    const lastOnChangeData = useRef(null);
    const nestableRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [focus, setFocus] = useState(null);
    const [collapse, setCollapse] = useState([]);
    const pubsub = useCreatePubSub();

    /**
     * Imports changes from the outside world into the component.
     */
    useEffectDebounced(
      () => {
        // Skip loopback updates from outside state management
        if (data === lastOnChangeData.current) return;

        // Mark the data change as driven by a props update activity
        // (this is to avoid circular loops with the outside world)
        isPropsUpdateRef.current = true;

        // Set internal state:
        const _nodes = arrayToTree(data.items, { dataField: null });
        setNodes(_nodes);

        setCollapse(data.collapse);

        // Set focus on initial item:
        // focus === null && setFocus(_nodes[0].id);

        console.log("@withTreeTable::nodes::reset");
      },
      [data],
      { delay: DEBOUNCE_DELAY, firstDelay: 0 }
    );

    /**
     * Exports the internal state to the outside world.
     * (by triggering the "onChange()" prop)
     */
    useEffectDebounced(
      () => {
        if (!onChange) return;
        if (!nodes.length) return;

        // Skip reacting to props updates
        // (this is to avoid circular loops with the outside world)
        if (isPropsUpdateRef.current) {
          isPropsUpdateRef.current = false;
          return;
        }

        // Rewrite the data into the outside world format
        const data = {
          collapse,
          items: flat(nodes)
        };

        // Keep track of the latest outward data to prevent loopback
        // updates, and trigger the onChange callback
        lastOnChangeData.current = data;
        onChange(data);

        console.log("@withTreeTable::nodes::changed");
      },
      [nodes, collapse],
      { delay: DEBOUNCE_DELAY }
    );

    /**
     * Propagate the collapsable state to the Nestable APIs
     */
    useEffectDebounced(
      () => {
        nestableRef.current.collapse(collapse);
      },
      [collapse],
      { delay: 0 }
    );

    useKeyboard({ nodes, focus, setFocus });

    /**
     * Expose programmatic API
     */
    ref.current = {
      prepend: (payload) => setNodes((curr) => [createNode(payload), ...curr]),
      append: (payload) => setNodes((curr) => [...curr, createNode(payload)])
    };

    return (
      <TreeTableContext.Provider
        value={{
          pubsub,
          nestableRef,
          nodes,
          setNodes,
          focus,
          setFocus,
          collapse,
          setCollapse
        }}
      >
        <Component />
      </TreeTableContext.Provider>
    );
  });
