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
      style={{
        border: hasFocus ? "1px solid #666" : "1px solid rgb(18, 18, 18)"
      }}
    >
      <Checkbox value={isCompleted} />
      <Title node={node} />
      <button onClick={toggleCollapse}>{isCollapsed ? "+" : "-"}</button>{" "}
    </Stack>
  );
};

export default Node;
