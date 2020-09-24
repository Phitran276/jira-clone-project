import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteComment, updateComment } from '../../../../../redux/actions/index';

import { formatDateTimeConversational } from "../../../../../shared/utils/dateTime";
import ConfirmModal from "../../../../../shared/components/ConfirmModal";

import BodyForm from "../BodyForm";
import {
  Comment,
  UserAvatar,
  Content,
  Username,
  CreatedAt,
  Body,
  EditLink,
  DeleteLink,
} from "./Styles";

const propTypes = {
  comment: PropTypes.object.isRequired,
  issueId: PropTypes.string.isRequired,
};

const ProjectBoardIssueDetailsComment = ({
  comment,
  issueId,
  deleteComment,
  updateComment
}) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [body, setBody] = useState(comment.body);

  const handleCommentUpdate = () => {
    let newComment = {...comment, body};
    updateComment(issueId, newComment);
    setFormOpen(false);
  };

  const handleCommentDelete =(modal) => {
    deleteComment(issueId, comment);
    modal.close();
  };

  return (
    <Comment data-testid="issue-comment">
      <UserAvatar name={comment.user.name} avatarUrl={comment.user.avatarUrl} />
      <Content>
        <Username>{comment.user.name}</Username>
        <CreatedAt>{formatDateTimeConversational(comment.createdAt)}</CreatedAt>

        {isFormOpen ? (
          <BodyForm
            value={body}
            onChange={setBody}
            isWorking={false}
            onSubmit={handleCommentUpdate}
            onCancel={() => setFormOpen(false)}
          />
        ) : (
          <Fragment>
            <Body>{comment.body}</Body>
            <EditLink onClick={() => setFormOpen(true)}>Edit</EditLink>
            <ConfirmModal
              title="Are you sure you want to delete this comment?"
              message="Once you delete, it's gone forever."
              confirmText="Delete comment"
              onConfirm={handleCommentDelete}
              renderLink={(modal) => (
                <DeleteLink onClick={modal.open}>Delete</DeleteLink>
              )}
            />
          </Fragment>
        )}
      </Content>
    </Comment>
  );
};

ProjectBoardIssueDetailsComment.propTypes = propTypes;

export default connect(null, { deleteComment, updateComment })(
  ProjectBoardIssueDetailsComment
);
