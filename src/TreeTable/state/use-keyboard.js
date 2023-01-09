import { useKeyboardEvent } from "../../utils/use-keyboard-event";

export const useKeyboard = (apiRef) => {
  useKeyboardEvent("meta + e", () => apiRef.current.requestEditMode(), {
    exact: true
  });

  useKeyboardEvent(
    "meta + Enter",
    () => {
      const activeNode = apiRef.current.getActiveNodeId();
      apiRef.current.appendAfter(activeNode, {});
    },
    { exact: true }
  );

  useKeyboardEvent(
    "shift + meta + Enter",
    () => {
      const activeNode = apiRef.current.getActiveNodeId();
      apiRef.current.appendInto(activeNode, {});
    },
    { exact: true }
  );

  useKeyboardEvent(
    "meta + ArrowDown",
    () => apiRef.current.requestFocusNext(),
    { exact: true }
  );

  useKeyboardEvent("meta + ArrowUp", () => apiRef.current.requestFocusPrev(), {
    exact: true
  });

  useKeyboardEvent(
    "meta + ArrowLeft",
    () => {
      const activeNode = apiRef.current.getActiveNodeId();
      apiRef.current.requestMoveIn(activeNode);
    },
    {
      exact: true
    }
  );

  useKeyboardEvent(
    "meta + ArrowRight",
    () => {
      const activeNode = apiRef.current.getActiveNodeId();
      apiRef.current.requestMoveOut(activeNode);
    },
    {
      exact: true
    }
  );
};
