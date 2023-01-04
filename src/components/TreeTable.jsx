import Nestable from "react-nestable";
import "react-nestable/dist/styles/index.css";

import { withTreeTable, useTreeTable, useNodes } from "./Context";
import TreeTableItem from "./Item";

/**
 *
 * @param {Array} data { id, parentId, custom, fields, ...}
 * @returns
 */
const TreeTable = () => {
  const { nestableRef } = useTreeTable();
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
