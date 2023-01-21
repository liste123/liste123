import { useTreeTable } from "./use-tree-table";
import deeplist, { createNode } from "../deeplist";

export const useApi = () => {
  const { nodes, setNodes } = useTreeTable();

  const appendNode = () => {};

  const prependNode = () => {};

  const insertNodeAfter = (targetNode, data = {}) => {
    const newNode = createNode({
      title: "",
      status: false,
      ...data
    });

    const _nodes = deeplist.appendNode(nodes, newNode, {
      clone: true,
      after: targetNode
    });

    setNodes(_nodes);
  };

  const insertNodeInto = (targetNode, data = {}) => {
    const newNode = createNode({
      title: "",
      status: false,
      ...data
    });

    const _nodes = deeplist.appendNode(nodes, newNode, {
      clone: true,
      into: targetNode,
      prepend: true
    });

    setNodes(_nodes);
  };

  return {
    appendNode,
    prependNode,
    insertNodeAfter,
    insertNodeInto
  };
};
