import { useRef } from "react";

import {
  Stack,
  TextField,
  Alert,
  AlertTitle,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Modal,
  Paper
} from "@mui/material";

import BetaPage from "../../../components/BetaPage";
import AddTask from "../../../components/AddTask";
import TreeTable from "../TreeTable";

/**
 *
 * @param {*} param0
 * @returns
 */
export const BetaProjectUI = ({ projectData, onTreeTableChange }) => {
  const treeTableRef = useRef(null);
  const { title } = projectData;

  return (
    <BetaPage
      title={title}
      subtitle={`Shall be completed when...`}
      linkBackTo={`/beta/@me`}
    >
      <Stack spacing={2} flex={1}>
        <AddTask
          placeholder={"(Ctrl + P) Prepend a new item"}
          shortcut={"Ctrl + p"}
          onSubmit={(title) =>
            treeTableRef.current.prependNode({
              title
            })
          }
        />
        <TreeTable
          ref={treeTableRef}
          etag={projectData.etag}
          value={projectData.data}
          onChange={onTreeTableChange}
        />
        <AddTask
          placeholder={"(Ctrl + A) Append a new item"}
          shortcut={"Ctrl + a"}
          onSubmit={(title) =>
            treeTableRef.current.appendNode({
              title
            })
          }
        />
      </Stack>
    </BetaPage>
  );
};
