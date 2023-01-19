import { getNode } from "./get-node";
import { getConfig } from "./defaults";
import { unwrapFn } from "./unwrap-fn";

const lastChild = (node, canGoDown) => {
  if (!node) return null;
  if (!canGoDown) return node;

  if (node.children.length === 0) return node;
  return lastChild(node.children[node.children.length - 1], canGoDown);
};

const flatPrev = (item, items) => {
  const idx = items.indexOf(item);
  if (idx === 0) return null;

  return items[idx - 1];
};

export const getNodePrev = (nodes = [], currentNode = "", config = {}) => {
  const _node = getNode(nodes, currentNode, config);
  if (!_node) return _node;

  const { canGoDown } = getConfig({
    canGoDown: true, // or a function that receives the node
    ...config
  });

  // root case
  if (_node.parent === null) {
    const _prev = flatPrev(_node, nodes);
    return lastChild(_prev, unwrapFn(canGoDown, _prev));
  }

  // Nested previous item
  const _prev = flatPrev(_node, _node.parent.children);
  if (_prev) return lastChild(_prev, unwrapFn(canGoDown, _prev));

  // Return the parent node
  if (_node.parent) {
    return _node.parent;
  }

  return null;
};
