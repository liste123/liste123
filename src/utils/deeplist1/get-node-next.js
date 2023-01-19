import { getNode } from "./get-node";
import { getConfig } from "./defaults";
import { unwrapFn } from "./unwrap-fn";

const flatNext = (item, items) => {
  const idx = items.indexOf(item);
  if (idx < items.length - 1) {
    return items[idx + 1];
  }

  return null;
};

export const getNodeNext = (nodes = [], currentNode = "", config = {}) => {
  const _node = getNode(nodes, currentNode, config);
  if (!_node) return _node;

  const { canGoDown } = getConfig({
    canGoDown: true, // or a function that receives the node
    ...config
  });

  // return first child
  if (_node.children.length && unwrapFn(canGoDown, _node)) {
    return _node.children[0];
  }

  // root case
  if (_node.parent === null) {
    return flatNext(_node, nodes);
  }

  // nested level
  const _next = flatNext(_node, _node.parent.children);
  if (_next) return _next;

  // End of same level, iterate up to root
  let parent = _node.parent;
  let _loop = 0;
  while (parent.parent && _loop < 100) {
    const _next = flatNext(parent, parent.parent.children);
    if (_next) return _next;

    // Move up one level
    parent = parent.parent;
    _loop++;
  }

  if (_loop === 99) {
    console.warning(
      `Maximum depth level (100) reached while searching for next node of: ${_node.id}`
    );
  }

  // Base for recursion
  return flatNext(parent, nodes);
};
