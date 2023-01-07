import { useCollapse } from "../state/use-collapse";
import { useFocus } from "../state/use-focus";
import { useStatus } from "../state/use-status";

import { Stack } from "@mui/material";
import Checkbox from "./Checkbox";
import Title from "./Title";

const Node = ({ node }) => {
  const { hasFocus, requestFocus } = useFocus(node);
  const { isCollapsed, toggleCollapse } = useCollapse(node);
  const { isCompleted } = useStatus(node);

  return (
    <Stack
      direction={"row"}
      spacing={1}
      onClick={requestFocus}
      className={[
        "treetable-item",
        "treetable-item-node",
        ...[hasFocus ? "treetable-item-focus" : null]
      ].join(" ")}
    >
      <Checkbox value={isCompleted} />
      <Title node={node} />
      <button onClick={toggleCollapse}>{isCollapsed ? "+" : "-"}</button>{" "}
    </Stack>
  );
};

export default Node;
