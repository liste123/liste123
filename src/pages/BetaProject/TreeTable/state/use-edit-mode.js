import { useTreeTable } from "./use-tree-table";
import { useFocus } from "./use-focus";
import { createNode, appendNode, updateNode } from "../deeplist";

export const useEditMode = (node) => {
  const { isEditMode, setIsEditMode, nodes, setNodes } = useTreeTable();
  const { hasFocus, requestFocus } = useFocus(node);

  const requestEditMode = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    setIsEditMode(true);
    requestFocus();
  };

  const requestViewMode = () => {
    setIsEditMode(false);
  };

  const update = (data, create = false, append = false) => {
    if (!isEditMode || !hasFocus) return;

    // Apply new value and clone the nodes for the new update
    const _nodes = updateNode(nodes, node.id, data, { clone: true });

    // Append new node and move focus to it
    if (create) {
      const newNode = createNode({
        title: "",
        status: false
      });

      appendNode(_nodes, newNode, {
        [append ? "into" : "after"]: node.id
      });

      setTimeout(() => {
        requestFocus(newNode.id);
        setIsEditMode(true);
      }, 50);
    }

    setNodes(_nodes);
  };

  return {
    isEditMode: isEditMode && hasFocus,
    requestEditMode,
    requestViewMode,
    update
  };
};
