import React, { useEffect } from "react";
import { Route, Redirect, useRouteMatch, useHistory } from "react-router-dom";

import { fetchIssues, fetchUsers, fetchInfo } from "../redux/actions/index";
import { connect } from "react-redux";

import { createQueryParamModalHelpers } from "../shared/utils/queryParamModal";

import Modal from "../shared/components/Modal";
import { ProjectPage } from "./Styles";
import Sidebar from "./Sidebar";
import NavbarLeft from "./NavbarLeft";
import Board from "./Board";
import IssueCreate from "./IssueCreate";
import IssueSearch from "./IssueSearch";
import ProjectSettings from "./ProjectSettings";

import PageLoader from "../shared/components/PageLoader";

const Project = ({
  fetchUsers,
  fetchIssues,
  fetchInfo,
  issues,
  users,
  project,
}) => {
  const match = useRouteMatch();
  const history = useHistory();

  const issueSearchModalHelpers = createQueryParamModalHelpers(
    history,
    "issue-search"
  );
  const issueCreateModalHelpers = createQueryParamModalHelpers(
    history,
    "issue-create"
  );

  useEffect(() => {
    fetchUsers();
    setTimeout(() => {
      fetchInfo();
    }, 300);
    setTimeout(() => {
      fetchIssues();
    }, 500);
  }, []);

  if (!issues || !users) {
    return <PageLoader />;
  }

  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
      />

      <Sidebar project={project} />

      {issueSearchModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch />}
        />
      )}

      {issueCreateModalHelpers.isOpen() ? (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={issueCreateModalHelpers.close}
          renderContent={(modal) => (
            <IssueCreate
              onCreate={() => history.push(`${match.url}/board`)}
              modalClose={modal.close}
            />
          )}
        />
      ) : (
        ""
      )}

      <Route path={`${match.path}/board`} render={() => <Board />} />
      <Route
        path={`${match.path}/settings`}
        render={() => <ProjectSettings />}
      />

      {match.isExact && <Redirect to={`${match.url}/board`} />}
    </ProjectPage>
  );
};

const mapStateToProps = (state) => {
  return {
    issues: state.project.issues,
    users: state.project.users,
    project: state.project,
  };
};

export default connect(mapStateToProps, { fetchIssues, fetchUsers, fetchInfo })(
  Project
);
