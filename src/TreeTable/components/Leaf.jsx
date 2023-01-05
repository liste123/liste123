import { useFocus } from "../state/use-focus";
import { useStatus } from "../state/use-status";

import { Stack } from "@mui/material";
import Checkbox from "./Checkbox";
import Title from "./Title";

const Leaf = ({ node }) => {
  const { hasFocus, requestFocus } = useFocus(node);
  const { isCompleted, toggleStatus } = useStatus(node);

  return (
    <Stack
      direction={"row"}
      spacing={1}
      onClick={requestFocus}
      style={{
        background: hasFocus ? "yellow" : "transparent"
      }}
    >
      <Checkbox value={isCompleted} onChange={toggleStatus} />
      <Title node={node} />
    </Stack>
  );
};

export default Leaf;