import { useState } from "react";
import { Box, Stack } from "@mui/material";
import TreeTable from "../components/TreeTable";
import backlog from "./backlog.json";

const HomePage = () => {
  const [data, setData] = useState(backlog);

  const handleExport = (evt) => {
    const el = document.createElement("a");

    el.setAttribute(
      "href",
      `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`
    );
    el.setAttribute("download", "liste123-backlog.json");
    el.click();
  };

  const handleImport = (evt) => {
    const reader = new FileReader();
    reader.onload = (evt) => setData(JSON.parse(evt.target.result));
    reader.readAsText(evt.target.files[0]);
  };

  const clipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <Box>
      <Stack direction="row">
        <Box sx={{ flex: 1 }}>
          <TreeTable data={data} onChange={setData} />
        </Box>

        <Box sx={{ fontSize: 10, maxWidth: "35vw", overflow: "auto" }}>
          <button onClick={clipboard}>copy</button>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Box>
      </Stack>
      <hr />
      <button onClick={handleExport}>Export to JSON</button>
      <input type="file" name="import" onChange={handleImport} />
    </Box>
  );
};

export default HomePage;
