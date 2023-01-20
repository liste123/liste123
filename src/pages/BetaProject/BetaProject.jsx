import { useBetaProject } from "./state/use-beta-project";
import { useBetaProjectUpdates } from "./state/use-beta-project-updates";
import { BetaProjectUI } from "./components/BetaProjectUI";

/**
 * SRP: apply updates to the available data
 * @param {*} param0
 * @returns
 */
const BetaProjectUpdates = ({ projectData, ...props }) => {
  const { data, error } = useBetaProjectUpdates(projectData);

  if (error) return `ERROR WITH UPDATES: ${error.message}`;

  return <BetaProjectUI {...props} projectData={data} />;
};

/**
 * SRP: load & save
 * @returns
 */
const BetaProject = () => {
  const { loading, error, data, ...api } = useBetaProject();

  if (loading) return "loading project...";

  if (error) return `ERROR: ${error.message}`;

  return (
    <BetaProjectUpdates
      projectData={data}
      onTreeTableChange={(...args) => api.updateData(...args)}
    />
  );
};

export default BetaProject;
