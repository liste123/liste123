import BetaPage from "../../../components/BetaPage";
import TreeTable from "../TreeTable";

/**
 *
 * @param {*} param0
 * @returns
 */
export const BetaProjectUI = ({ projectData, onTreeTableChange }) => {
  const { title } = projectData;

  return (
    <BetaPage
      title={title}
      subtitle={`Shall be completed when...`}
      linkBackTo={`/beta/@me`}
    >
      <TreeTable
        etag={projectData.etag}
        value={projectData.data}
        onChange={onTreeTableChange}
      />
    </BetaPage>
  );
};
