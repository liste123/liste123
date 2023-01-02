import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect
} from "react";

import { arrayToTree } from "performant-array-to-tree";
import { flatten } from "flattree";
import { useEffectDebounced } from "../utils/use-effect-debounced";
import { useEffectTriggerable } from "../utils/use-effect-triggerable";
import { useKeyboardEvent } from "../utils/use-keyboard-event";

export const TreeTableContext = createContext();

export const withTreeTable = (Component) => (props) => {
  console.log("@withTreeTable::render");
  const { data, onChange } = props;
  const [items, setItems] = useState([]);
  const [itemsMap, setItemsMap] = useState({});
  const [focus, setFocus] = useState(null);

  /**
   * This should not be needed because in production React won't
   * perform the double render of Strict.
   *
   * But it it still a good addition in case the outside world will
   * change the state too often.
   *
   * It would protect from the load of "arrayToTree".
   * First run is immediate, but data updates are seriously debounced
   * as the internal state should already be aligned when the user
   * performs changes directly.
   *
   * Basically, only changes from the outside world - like other users'
   * activity in a shared document - are debounced for real.
   */
  useEffectDebounced(
    () => {
      // console.log("@withTreeTable::items::reset");

      const items = arrayToTree(data, { dataField: null });
      setItems(items);

      const itemsMap = data.reduce((a, c) => ({ ...a, [c.id]: c }), []);
      setItemsMap(itemsMap);

      // Set focus on initial item:
      // focus === null && setFocus(items[0].id);
    },
    [data],
    { delay: 250, firstDelay: 0 }
  );

  const triggerDataChangedEvent = useEffectTriggerable(() => {
    // Skip if there is no callback
    if (!onChange) return;

    // Debounce AND make sure there is an updated state variables
    const _timer = setTimeout(
      () =>
        onChange(
          flatten(items, { openAllNodes: true }).map((node) => ({
            ...itemsMap[node.id],
            id: node.id,
            parentId: node.parent.id
          }))
        ),

      250
    );

    return () => clearTimeout(_timer);
  });

  useKeyboard({ items, itemsMap, focus, setFocus });

  return (
    <TreeTableContext.Provider
      value={{
        focus,
        setFocus,
        items,
        setItems,
        itemsMap,
        setItemsMap,
        triggerDataChangedEvent,
        originalProps: props
      }}
    >
      <Component />
    </TreeTableContext.Provider>
  );
};

export const useTreeTable = () => useContext(TreeTableContext);

export const useItems = () => {
  const tree = useTreeTable();

  const onChange = (data) => {
    console.log("@onTreeChange");
    tree.setItems(data.items);
    tree.triggerDataChangedEvent();
  };

  return {
    items: tree.items,
    onChange
  };
};

export const useItem = (itemId) => {
  const tree = useTreeTable();
  const data = tree.itemsMap[itemId];

  const update = (change) => {
    console.log("@onItemChange");
    tree.setItemsMap((curr) => ({
      ...curr,
      [itemId]: {
        ...curr[itemId],
        ...change
      }
    }));
    tree.triggerDataChangedEvent();
  };

  return {
    data,
    update
  };
};

export const useFocus = (itemId) => {
  const tree = useTreeTable();

  return {
    hasFocus: tree.focus === itemId,
    requestFocus: () => tree.setFocus(itemId)
  };
};

const useKeyboard = ({ items, itemsMap, focus, setFocus }) => {
  // Memoize data references for event handlers
  const data = useRef(null);
  useEffect(() => {
    data.current = { items, itemsMap, focus };
  }, [items, itemsMap, focus]);

  useKeyboardEvent("ArrowDown", () => {
    const { items, itemsMap, focus } = data.current;
    const item = itemsMap[focus];

    // Set first item if nothing is focused
    if (!item) {
      setFocus(items[0].id);
      return;
    }

    // if (item.children) {
    console.log(item);
    console.log(items);
    // }
  });
};
