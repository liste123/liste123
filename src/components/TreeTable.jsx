import Nestable from "react-nestable";
import "react-nestable/dist/styles/index.css";

import { withTreeTable, useItems } from "./Context";
import TreeTableItem from "./Item";

/**
 *
 * @param {Array} data { id, parentId, custom, fields, ...}
 * @returns
 */
const TreeTable = () => {
  // console.log("@TreeTable::render");
  const { items, onChange } = useItems();

  const renderItem = ({ item: { id } }) => <TreeTableItem id={id} />;

  return <Nestable items={items} renderItem={renderItem} onChange={onChange} />;
};

export default withTreeTable(TreeTable);
