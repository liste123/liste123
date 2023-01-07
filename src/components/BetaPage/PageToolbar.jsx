import { Stack } from "@mui/material";

import { PageTitle } from "./PageTitle";
import { LinkBack } from "./LinkBack";
import { LinkClose } from "./LinkClose";
import { Menu } from "./Menu";

export const PageToolbar = ({
  title,
  subtitle,
  linkBackTo,
  linkCloseTo,
  actions,
  actionsLeft,
  menu
}) => {
  const renderLeftBox = () => {
    if (!actionsLeft && !linkBackTo) return;
    return (
      <Stack direction={"row"} alignItems={"center"}>
        {actionsLeft}
        {linkBackTo && <LinkBack to={linkBackTo} />}
      </Stack>
    );
  };

  const renderRightBox = () => {
    if (!actions && !menu && !linkCloseTo) return;

    return (
      <Stack direction={"row"} alignItems={"center"}>
        {actions}
        {menu && <Menu children={menu} />}
        {linkCloseTo && <LinkClose to={linkCloseTo} />}
      </Stack>
    );
  };

  if (
    !title &&
    !subtitle &&
    !linkBackTo &&
    !linkCloseTo &&
    !actions &&
    !actionsLeft &&
    !menu
  )
    return null;

  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"} sx={{ mb: 4 }}>
      {renderLeftBox()}
      <PageTitle title={title} subtitle={subtitle} />
      {renderRightBox()}
    </Stack>
  );
};
