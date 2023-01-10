import { useKeyboardEvent } from "../../utils/use-keyboard-event";

export const useKeyboard = (apiRef) => {
  useKeyboardEvent("ctrl + e", () => apiRef.current.requestEditMode(), {
    exact: true
  });

  useKeyboardEvent(
    "ctrl + Enter",
    () => {
      const activeNode = apiRef.current.getActiveNodeId();
      apiRef.current.appendAfter(activeNode, {});
    },
    { exact: true }
  );

  useKeyboardEvent(
    "shift + ctrl + Enter",
    () => {
      const activeNode = apiRef.current.getActiveNodeId();
      apiRef.current.appendInto(activeNode, {});
    },
    { exact: true }
  );

  useKeyboardEvent(
    "ctrl + ArrowDown",
    () => apiRef.current.requestFocusNext(),
    {
      exact: true
    }
  );

  useKeyboardEvent("ctrl + ArrowUp", () => apiRef.current.requestFocusPrev(), {
    exact: true
  });

  useKeyboardEvent(
    "ctrl + ArrowLeft",
    () => {
      const activeNode = apiRef.current.getActiveNodeId();
      apiRef.current.requestMoveIn(activeNode);
    },
    {
      exact: true
    }
  );

  useKeyboardEvent(
    "ctrl + ArrowRight",
    () => {
      const activeNode = apiRef.current.getActiveNodeId();
      apiRef.current.requestMoveOut(activeNode);
    },
    {
      exact: true
    }
  );

  useKeyboardEvent(
    "ctrl + Space",
    () => {
      const activeNode = apiRef.current.getActiveNode();
      if (activeNode.children.length) {
        apiRef.current.requestToggleCollapse(activeNode.id);
      } else {
        apiRef.current.requestToggleStatus(activeNode.id);
      }
    },
    {
      exact: true
    }
  );

  useKeyboardEvent(
    "ctrl + Backspace",
    () => {
      console.log("DELETE");
      const activeNode = apiRef.current.getActiveNode();
      apiRef.current.requestDelete(activeNode.id);
    },
    {
      exact: true
    }
  );
};
