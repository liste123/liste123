import { Box } from "@mui/material";

import { PageToolbar } from "./PageToolbar";

const BetaPage = ({ children, ...props }) => {
  return (
    <Box m={2} marginLeft={3}>
      <PageToolbar {...props} />
      {children}
    </Box>
  );
};

export default BetaPage;
