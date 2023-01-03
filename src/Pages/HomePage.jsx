import { useState } from "react";
import { Box } from "@mui/material";
import TreeTable from "../components/TreeTable";

// Generate local IDs
const getId = () => ++getId._id;
getId._id = 0;

// Dummy DB API:
const db = [];
const add = (parent, title, data = {}) => {
  const item = {
    id: null,
    parentId: null,
    title,
    ...data,
    title,
    id: getId(),
    parentId: parent ? parent.id : null
  };
  db.push(item);
  return item;
};

// Dummy initial data:
const i1 = add(null, `Learn React Nestable`, { status: false });
add(i1, `Find good way to serialize data`, { status: true });
const i2 = add(null, `Keyboard`, { status: false });
const i6 = add(null, `Collapse/expand using mouse`, { status: false });
add(i6, `Add icon into the row`, { status: false });
add(i6, `Add "collapsed" state to each item`, { status: false });
add(i6, `Expose an API to collapse one item by id`, { status: false });
add(i6, `Add event listener to trigger the collapse`, { status: false });
add(i2, `Catch keyboard events (hook)`, { status: true });
const i2a = add(i2, `Set focus to next item`, { status: false });
add(i2a, `Find next item in the tree`, { status: false });
add(i2a, `Find parent in the tree`, { status: false });
add(i2a, `Find parent's first son'`, { status: false });
add(i2, `Set focus to previous item`, { status: false });
add(i2, `On(Space) toggle collapse`, { status: false });
const i3 = add(null, `Inline editing`, { status: false });
add(i3, `Save status change`, { status: true });
const i3a = add(i3, `Save title change`, { status: false });
add(i3a, `Add editable state to the tree`, { status: false });
add(i3a, `Make title render component`, { status: false });
add(i3a, `Make title edit component`, { status: false });
add(i3a, `Show component based on editable state & current focus`, {
  status: false
});
add(i3a, `OnClick -> set state editable`, { status: false });
add(i3a, `On(Esc, Enter) -> maeke state non editable`, { status: false });
add(i3a, `Persist changes while typing with debounce`, { status: false });
const i4 = add(null, `Columns`, { status: false });
add(i4, `Add a column as config`, { status: false });
add(i4, `Resize handle in column header`, { status: false });
add(null, `Show current state to textarea`, { status: false });
add(null, `Load project from textarea`, { status: false });
const i5 = add(null, `Optimizations & Refactoring`, { status: false });
add(i5, `Create a "state" folder and explode all the hooks`, {
  status: false
});
add(i5, `Wrap TreeTable components into its own sub-folder`, {
  status: false
});
add(i5, `Keep tree state into Refs, propagate changes with pubsub`, {
  status: false
});

const HomePage = () => {
  const [data, setData] = useState(db);

  return (
    <Box>
      <TreeTable data={data} onChange={setData} />
      <hr />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
};

export default HomePage;
