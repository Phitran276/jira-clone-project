import React, { Fragment} from "react";
import { Route, useRouteMatch, useHistory } from "react-router-dom";
import { connect } from 'react-redux';

import Breadcrumbs from "../../shared/components/Breadcrumbs";
import Modal from "../../shared/components/Modal";
import useMergeState from "../../shared/hooks/mergeState";

import Header from "./Header";
import Filters from "./Filters";
import Lists from "./Lists";
import IssueDetails from "./IssueDetails";

const defaultFilters = {
  searchTerm: "",
  userIds: [],
  myOnly: false,
  recent: false,
};

const ProjectBoard = ({ project }) => {
  const match = useRouteMatch();
  const history = useHistory();


  const [filters, mergeFilters] = useMergeState(defaultFilters);
  return (
    <Fragment>
      <Breadcrumbs items={["Projects", project.name, "Kanban Board"]} />
      <Header />
      <Filters
        projectUsers={project.users}
        defaultFilters={defaultFilters}
        filters={filters}
        mergeFilters={mergeFilters}
      />
      <Lists project={project} filters={filters} />
      <Route
        path={`${match.path}/issues/:issueId`}
        render={(routeProps) => (
          <Modal
            isOpen={true}
            testid="modal:issue-details"
            width={1040}
            withCloseIcon={false}
            onClose={() => history.push(match.url)}
            renderContent={(modal) => (
              <IssueDetails
                issueId={routeProps.match.params.issueId}
                projectUsers={project.users}
                modalClose={modal.close}
              />
            )}
          />
        )}
      />
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    project: state.project
  }
}

export default connect(mapStateToProps)(ProjectBoard);
