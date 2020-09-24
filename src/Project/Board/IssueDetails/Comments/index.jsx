import React from "react";
import PropTypes from "prop-types";

import { sortByNewestComment } from "../../../../shared/utils/javascript";

import Create from "./Create";
import Comment from "./Comment";
import { Comments, Title } from "./Styles";

const propTypes = {
  issue: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsComments = ({ issue }) => {
  const filterComments = (comments) => {
    
    return Object.keys(comments).map(key => {
      return {...comments[key], IdFirebase: key};
    })
  };

  return (
    <Comments>
      <Title>Comments</Title>
      <Create issue={issue} />
      {issue.comments
        ? sortByNewestComment(filterComments(issue.comments), "createdAt")
            .slice(0)
            .reverse()
            .map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                issueId={issue.IdFirebase}
              />
            ))
        : ""}
    </Comments>
  );
};

ProjectBoardIssueDetailsComments.propTypes = propTypes;

export default ProjectBoardIssueDetailsComments;
