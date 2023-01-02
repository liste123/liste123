import { useCallback } from "react";

import { useFocus, useItem } from "./Context";
import Checkbox from "./Checkbox";

const TreeTableItem = ({ id }) => {
  const { hasFocus, requestFocus } = useFocus(id);
  const {
    update,
    data: { title, status }
  } = useItem(id);

  const onStatusChange = useCallback(
    (evt, status) => {
      console.log("@clicked on", id);
      update({ status: status });
    },
    [id]
  );

  return (
    <div
      onClick={() => requestFocus(id)}
      style={{
        background: hasFocus ? "yellow" : "transparent"
      }}
    >
      <Checkbox value={status} onChange={onStatusChange} />
      {title}
    </div>
  );
};

export default TreeTableItem;
