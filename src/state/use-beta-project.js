import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { gql, useSubscription, useMutation } from "@apollo/client";
import { usePushID } from "../utils/use-pushid";

const PROJECT_SUB = gql`
  subscription GetProject($uuid: String!) {
    project: beta_projects_by_pk(uuid: $uuid) {
      uuid
      title
      data
      etag
      updated_at
      created_at
      account_uuid
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $uuid: String!
    $title: String!
    $data: jsonb!
    $etag: String!
  ) {
    update_beta_projects_by_pk(
      pk_columns: { uuid: $uuid }
      _set: { data: $data, title: $title, etag: $etag }
    ) {
      updated_at
    }
  }
`;

export const useBetaProject = () => {
  const { generatePushID } = usePushID();
  const { uuid } = useParams();
  const [_data, setData] = useState(null);
  const lastUpdate = useRef(null);

  // GraphQL
  const [updateProject] = useMutation(UPDATE_PROJECT);
  const { loading, error, data } = useSubscription(PROJECT_SUB, {
    variables: { uuid }
  });

  // Update internal data only if changed from the outside
  useEffect(() => {
    if (!data) return;
    if (data.project?.etag !== lastUpdate.current?.etag) {
      setData(data.project.data);
    }
  }, [data]);

  // Send an update and stores the local etag to avoid state duplication
  const update = (title, data) => {
    lastUpdate.current = generatePushID();

    updateProject({
      variables: {
        uuid,
        title,
        data,
        etag: lastUpdate.current
      }
    });
  };

  return {
    loading,
    error: error
      ? error
      : !loading && !data?.project
      ? {
          name: "404",
          message: "Project not found"
        }
      : null,
    title: data?.project?.title,
    data: _data,
    update
  };
};
