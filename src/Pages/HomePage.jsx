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
const i1 = add(null, "Learn React Nestable", { status: false });
add(i1, "Find good way to serialize data", { status: true });
const i2 = add(null, "Keyboard", { status: false });
add(i2, "Set focus to next item", { status: false });
add(i2, "Set focus to previous item", { status: false });
const i3 = add(null, "Inline editing", { status: false });
add(i3, "Save status change", { status: true });
add(i3, "Save title change", { status: false });
const i4 = add(null, "Columns", { status: false });
add(i4, "Add a column as config", { status: false });
add(i4, "Resize handle in column header", { status: false });
add(null, "Show current state to textarea", { status: false });
add(null, "Load project from textarea", { status: false });

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
