import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateIssue as updateIssueAxios } from "../../../redux/actions/index";

import Button from "../../../shared/components/Button";
import CopyLinkButton from "../../../shared/components/CopyLinkButton";

import { getExactCurrentTime } from "../../../shared/utils/dateTime";

import Type from "./Type";
import Delete from "./Delete";
import Title from "./Title";
import Description from "./Description";
import Comments from "./Comments";
import Status from "./Status";
import AssigneesReporter from "./AssigneesReporter";
import Priority from "./Priority";
import EstimateTracking from "./EstimateTracking";
import Dates from "./Dates";
import { TopActions, TopActionsRight, Content, Left, Right } from "./Styles";

const propTypes = {
  issueId: PropTypes.string.isRequired,
  projectUsers: PropTypes.array.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetails = ({
  issueId,
  projectUsers,
  modalClose,
  issues,
  updateIssueAxios,
}) => {
  const issue = issues.find((item) => item.id === issueId);

  const updateIssue = (updatedFields) => {
    const updatedIssue = { ...issue, ...updatedFields, updatedAt: getExactCurrentTime()};
    updateIssueAxios(updatedIssue);
  };

  return (
    <Fragment>
      <TopActions>
        <Type issue={issue} updateIssue={updateIssue} />
        <TopActionsRight>
          <CopyLinkButton variant="empty" />
          <Delete
            issue={issue}
            modalClose={modalClose}
          />
          <Button
            icon="close"
            iconSize={24}
            variant="empty"
            onClick={modalClose}
          />
        </TopActionsRight>
      </TopActions>
      <Content>
        <Left>
          <Title issue={issue} updateIssue={updateIssue} />
          <Description issue={issue} updateIssue={updateIssue} />
          <Comments issue={issue} />
        </Left>
        <Right>
          <Status issue={issue} updateIssue={updateIssue} />
          <AssigneesReporter
            issue={issue}
            updateIssue={updateIssue}
            projectUsers={projectUsers}
          />
          <Priority issue={issue} updateIssue={updateIssue} />
          <EstimateTracking issue={issue} updateIssue={updateIssue} />
          <Dates issue={issue} />
        </Right>
      </Content>
    </Fragment>
  );
};

ProjectBoardIssueDetails.propTypes = propTypes;

const mapStateToProps = (state) => {
  return {
    issues: state.project.issues,
  };
};

export default connect(mapStateToProps, { updateIssueAxios })(
  ProjectBoardIssueDetails
);
