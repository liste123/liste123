import { useState } from "react";
import { Box, Popover, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const Menu = ({ children }) => {
  const [target, setTarget] = useState(null);

  return (
    <Box>
      <IconButton onClick={(e) => setTarget(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={Boolean(target)}
        anchorEl={target}
        onClose={() => setTarget(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        {children}
      </Popover>
    </Box>
  );
};
