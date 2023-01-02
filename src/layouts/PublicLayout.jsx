import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const PublicLayout = () => (
  <Box>
    <Typography variant="h4">Planner App</Typography>
    <Outlet />
  </Box>
);

export default PublicLayout;
