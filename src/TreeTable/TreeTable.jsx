import Nestable from "react-nestable";
import "react-nestable/dist/styles/index.css";

import { withTreeTable } from "./state/Context";
import { useNodes } from "./state/use-nodes";
import { useNestable } from "./state/use-nestable";
import TreeTableItem from "./components/Item";

/**
 *
 * @param {Array} data { id, parentId, custom, fields, ...}
 * @returns
 */
export const TreeTable = () => {
  const { nestableRef } = useNestable();
  const { nodes, onChange, getNodeById } = useNodes();

  /**
   * Looks like there is some kind of bug in Nestable for which
   * updates to the items from the outside are not well received.
   *
   * We need to guard from rendering IDs that do not exists anymore
   * in the internal state.
   */
  const renderItem = ({ item: { id } }) => {
    const node = getNodeById(id);
    return node ? <TreeTableItem node={node} /> : "*";
  };

  return (
    <Nestable
      ref={nestableRef}
      items={nodes}
      renderItem={renderItem}
      onChange={onChange}
    />
  );
};

export default withTreeTable(TreeTable);
