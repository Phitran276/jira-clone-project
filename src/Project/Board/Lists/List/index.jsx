import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { Droppable } from "react-beautiful-dnd";

import moment from "moment";
import  { intersection } from "lodash";

import { IssueStatusCopy } from "../../../../shared/constants/issues";

import Issue from "./Issue";
import { List, Title, IssuesCount, Issues } from "./Styles";

const propTypes = {
  status: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired
};

const ProjectBoardList = ({ status, filters, issues, users, currentUser}) => {
  const filteredIssues = filterIssues(issues, filters, currentUser.id);
  const filteredListIssues = getSortedListIssues(filteredIssues, status);
  const allListIssues = getSortedListIssues(issues, status);

  return (
    <Droppable key={status} droppableId={status}>
      {(provided) => (
        <List>
          <Title>
            {`${IssueStatusCopy[status]} `}
            <IssuesCount>
              {formatIssuesCount(allListIssues, filteredListIssues)}
            </IssuesCount>
          </Title>
          <Issues
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-testid={`board-list:${status}`}
          >
            {filteredListIssues.map((issue, index) => (
              <Issue
                key={issue.id}
                projectUsers={users}
                issue={issue}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Issues>
        </List>
      )}
    </Droppable>
  );
};

const filterIssues = (projectIssues, filters, currentUserId) => {
  const { searchTerm, userIds, myOnly, recent } = filters;
  let issues = projectIssues;

  if (searchTerm) {
    issues = issues.filter((issue) =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (userIds.length > 0) {
    issues = issues.filter(
      (issue) => intersection(issue.userIds, userIds).length > 0
    );
  }
  if (myOnly && currentUserId) {
    issues = issues.filter((issue) => issue.userIds.includes(currentUserId));
  }
  if (recent) {
    issues = issues.filter((issue) =>
      moment(issue.updatedAt).isAfter(moment().subtract(3, "days"))
    );
  }
  return issues;
};

const getSortedListIssues = (issues, status) =>
  issues.filter((issue) => issue.status === status).sort((a, b) => a.listPosition - b.listPosition);

const formatIssuesCount = (allListIssues, filteredListIssues) => {
  if (allListIssues.length !== filteredListIssues.length) {
    return `${filteredListIssues.length} of ${allListIssues.length}`;
  }
  return allListIssues.length;
};

ProjectBoardList.propTypes = propTypes;

const mapStateToProps = state => {
    return {
        issues: state.project.issues, 
        users: state.project.users,
        currentUser: state.project.currentUser
    }
}

export default connect(mapStateToProps)(ProjectBoardList);




