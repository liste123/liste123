import { useKeyboardEvent } from "../../utils/use-keyboard-event";

export const useKeyboard = ({ items, itemsMap, focus, setFocus }) => {
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
