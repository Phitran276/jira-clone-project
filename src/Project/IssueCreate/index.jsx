import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { createIssue } from '../../redux/actions/index';

import uniqid from 'uniqid';
import { getExactCurrentTime } from "../../shared/utils/dateTime";
import notify from '../../shared/utils/notify';
import { fetchIssues } from '../../redux/actions/index';

import {
  IssueType,
  IssueStatus,
  IssuePriority,
  IssueTypeCopy,
  IssuePriorityCopy,
} from "../../shared/constants/issues";

import Form from "../../shared/components/Form";
import IssueTypeIcon from "../../shared/components/IssueTypeIcon";
import Icon from "../../shared/components/Icon";
import Avatar from "../../shared/components/Avatar";
import IssuePriorityIcon from "../../shared/components/IssuePriorityIcon";
import {
  FormHeading,
  FormElement,
  SelectItem,
  SelectItemLabel,
  Divider,
  Actions,
  ActionButton,
} from "./Styles";

const propTypes = {
  onCreate: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectIssueCreate = ({
  project,
  onCreate,
  modalClose,
  createIssue,
  fetchIssues
}) => {
  const [isLoading, setLoading] = useState(false);

  const createNewIssuePosition = (issues) => {
      const listPositions = issues.reduce((acc, cur) => {
          acc.push(cur.listPosition);
          return acc;
      }, []);
      let max = listPositions[0];
      for(let i = 1; i< listPositions.length ; i++){
        if(listPositions[i] > max){
          max = listPositions[i];
        }
      }
      return max + 1;
  };

  return (
    <Form
      enableReinitialize
      initialValues={{
        type: IssueType.TASK,
        title: "",
        description: "",
        reporterId: 2,
        userIds: [],
        priority: IssuePriority.MEDIUM,
      }}
      validations={{
        type: Form.is.required(),
        title: [Form.is.required(), Form.is.maxLength(200)],
        reporterId: Form.is.required(),
        priority: Form.is.required(),
      }}
      onSubmit={async (values, form) => {
        
        await setLoading(true);
        const issue= {
            ...values,
            status: IssueStatus.BACKLOG,
            listPosition: createNewIssuePosition(project.issues),
            id: uniqid(),
            createdAt: getExactCurrentTime(),
        }
        await createIssue(issue);
        
        setLoading(false);
        notify.success('Issue has been successfully created.');
        onCreate();
        
        //Fetch issues after create because IdFirebase will be underfined if not
        fetchIssues();
      }}
    >
      <FormElement>
        <FormHeading>Create issue</FormHeading>
        <Form.Field.Select
          name="type"
          label="Issue Type"
          tip="Start typing to get a list of possible matches."
          options={typeOptions}
          renderOption={renderType}
          renderValue={renderType}
        />
        <Divider />
        <Form.Field.Input
          name="title"
          label="Short Summary"
          tip="Concisely summarize the issue in one or two sentences."
        />
        <Form.Field.TextEditor
          name="description"
          label="Description"
          tip="Describe the issue in as much detail as you'd like."
        />
        <Form.Field.Select
          name="reporterId"
          label="Reporter"
          options={userOptions(project)}
          renderOption={renderUser(project)}
          renderValue={renderUser(project)}
        />
        <Form.Field.Select
          isMulti
          name="userIds"
          label="Assignees"
          tio="People who are responsible for dealing with this issue."
          options={userOptions(project)}
          renderOption={renderUser(project)}
          renderValue={renderUser(project)}
        />
        <Form.Field.Select
          name="priority"
          label="Priority"
          tip="Priority in relation to other issues."
          options={priorityOptions}
          renderOption={renderPriority}
          renderValue={renderPriority}
        />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isLoading}>
            Create Issue
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

const typeOptions = Object.values(IssueType).map((type) => ({
  value: type,
  label: IssueTypeCopy[type],
}));

const priorityOptions = Object.values(IssuePriority).map((priority) => ({
  value: priority,
  label: IssuePriorityCopy[priority],
}));

const userOptions = (project) =>
  project.users.map((user) => ({ value: user.id, label: user.name }));

const renderType = ({ value: type }) => (
  <SelectItem>
    <IssueTypeIcon type={type} top={1} />
    <SelectItemLabel>{IssueTypeCopy[type]}</SelectItemLabel>
  </SelectItem>
);

const renderPriority = ({ value: priority }) => (
  <SelectItem>
    <IssuePriorityIcon priority={priority} top={1} />
    <SelectItemLabel>{IssuePriorityCopy[priority]}</SelectItemLabel>
  </SelectItem>
);

const renderUser = (project) => ({ value: userId, removeOptionValue }) => {
  const user = project.users.find(({ id }) => id === userId);

  return (
    <SelectItem
      key={user.id}
      withBottomMargin={!!removeOptionValue}
      onClick={() => removeOptionValue && removeOptionValue()}
    >
      <Avatar size={20} avatarUrl={user.avatarUrl} name={user.name} />
      <SelectItemLabel>{user.name}</SelectItemLabel>
      {removeOptionValue && <Icon type="close" top={2} />}
    </SelectItem>
  );
};

ProjectIssueCreate.propTypes = propTypes;

const mapStateToProps = state => {
  return {
      project: state.project
  }
}

export default connect(mapStateToProps, {createIssue, fetchIssues} )(ProjectIssueCreate);
