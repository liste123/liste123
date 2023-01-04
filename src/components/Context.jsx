import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback
} from "react";

import { arrayToTree } from "performant-array-to-tree";
import { useEffectDebounced } from "../utils/use-effect-debounced";
import { useKeyboardEvent } from "../utils/use-keyboard-event";
import { getNodeById, updateNodeById, flat } from "./deeplist";
import { useCreatePubSub } from "../utils/use-pubsub";

const DEBOUNCE_DELAY = 0;

export const TreeTableContext = createContext();

export const withTreeTable = (Component) => (props) => {
  const { data, onChange } = props;
  const isPropsUpdateRef = useRef(false);
  const lastOnChangeData = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [focus, setFocus] = useState(null);
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
        items: flat(nodes)
      };

      // Keep track of the latest outward data to prevent loopback
      // updates, and trigger the onChange callback
      lastOnChangeData.current = data;
      onChange(data);

      console.log("@withTreeTable::nodes::changed");
    },
    [nodes],
    { delay: DEBOUNCE_DELAY }
  );

  useKeyboard({ nodes, focus, setFocus });

  return (
    <TreeTableContext.Provider
      value={{
        pubsub,
        nodes,
        setNodes,
        focus,
        setFocus
      }}
    >
      <Component />
    </TreeTableContext.Provider>
  );
};

export const useTreeTable = () => useContext(TreeTableContext);

export const useNodes = () => {
  const { nodes, setNodes, pubsub } = useTreeTable();

  const onChange = (data) => {
    setNodes(data.items);
    pubsub.publish("nodes::changed", data.items);
  };

  return {
    nodes,
    onChange,
    getNodeById: (nodeId) => getNodeById(nodes, nodeId)
  };
};

export const useNode = (node) => {
  const { nodes, setNodes, pubsub } = useTreeTable();
  const { children, ...data } = node;

  const update = useCallback(
    (change) => {
      setNodes((curr) => updateNodeById(curr, node.id, change));
      pubsub.publish("node::changed", { node, change });
    },
    [nodes]
  );

  return {
    id: node.id,
    data,
    children,
    update
  };
};

export const useFocus = (nodeId) => {
  const { focus, setFocus } = useTreeTable();

  return {
    hasFocus: focus === nodeId,
    requestFocus: () => setFocus(nodeId)
  };
};

const useKeyboard = ({ items, itemsMap, focus, setFocus }) => {
  // Memoize data references for event handlers
  // const data = useRef(null);
  // useEffect(() => {
  //   data.current = { items, itemsMap, focus };
  // }, [items, itemsMap, focus]);

  useKeyboardEvent("ArrowDown", () => {
    console.log("move focus down");
    // const { items, itemsMap, focus } = data.current;
    // const item = itemsMap[focus];

    // // Set first item if nothing is focused
    // if (!item) {
    //   setFocus(items[0].id);
    //   return;
    // }

    // // if (item.children) {
    // console.log(item);
    // console.log(items);
    // // }
  });
};
