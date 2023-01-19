import { getConfig } from "./defaults";
import { getNode } from "./get-node";

const insertItem = (nodes, target, newItem, offset = 1) => {
  const idx = nodes.indexOf(target);
  nodes.splice(idx + offset, 0, newItem);
};

export const appendNode = (nodes = [], node = null, config = {}) => {
  const { into, prepend, before, after } = getConfig({
    after: null,
    before: null,
    into: null,
    prepend: false,
    ...config
  });

  if (into === null && before === null && after === null) {
    if (prepend) {
      insertItem(nodes, "-na-", node);
    } else {
      nodes.push(node);
    }
  }

  if (into !== null) {
    const targetNode = getNode(nodes, into, config);
    if (prepend) {
      insertItem(targetNode.children, "-na-", node);
    } else {
      targetNode.children.push(node);
    }
  }

  if (after !== null) {
    const targetNode = getNode(nodes, after, config);
    if (targetNode.parent) {
      insertItem(targetNode.parent.children, targetNode, node);
    } else {
      insertItem(nodes, targetNode, node);
    }
  }

  if (before !== null) {
    const targetNode = getNode(nodes, before, config);
    if (targetNode.parent) {
      insertItem(targetNode.parent.children, targetNode, node, 0);
    } else {
      insertItem(nodes, targetNode, node, 0);
    }
  }

  return nodes;
};
