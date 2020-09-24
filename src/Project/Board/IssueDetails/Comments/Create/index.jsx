import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import uniqid from "uniqid";
import { updateIssue } from '../../../../../redux/actions/index';

import { getExactCurrentTime } from "../../../../../shared/utils/dateTime";

import BodyForm from "../BodyForm";
import ProTip from "./ProTip";
import { Create, UserAvatar, Right, FakeTextarea } from "./Styles";

const propTypes = {
  issue: PropTypes.object.isRequired,
};

// const issue = {
//   id: "12pf",
//   status: 'backlog',
//   title: "Second issue right here!",
//   description: `Before you start work on an issue, you can set a time or other type of estimate to calculate how much work you believe it'll take to resolve it. Once you've started to work on a specific issue, log time to keep a record of it.`,
//   type: "bug",
//   priority: "3",
//   reporterId: 2,
//   userIds: [1, 2],
//   comments: [
//     {
//       id: "com1",
//       createdAt: "87654345",
//       body: 'First Comment Today!!',
//       user: {
//         id: 2,
//         name: "Tran",
//         avatarUrl: "https://avatarfiles.alphacoders.com/700/70031.gif",
//       },
//     },
//     {
//       id: "com2",
//       createdAt: "98765456",
//       body: 'Second comment today!',
//       user: {
//         id: 1,
//         name: "Phi",
//         avatarUrl:
//           "https://icons.iconarchive.com/icons/diversity-avatars/avatars/1024/batman-icon.png",
//       },
//     },
//   ],
// };

const ProjectBoardIssueDetailsCommentsCreate = ({ issue, currentUser, updateIssue }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [body, setBody] = useState("");
  let date = new Date();
  const handleSubmitComment = (value) => {
    let newComments = {};
    if (issue.comments) {
      newComments = {...issue.comments};
    }
    let newComment = {
        id: `comment-${uniqid.time()}`,
        createdAt: date,
        body: value,
        user: currentUser
    }

    const newIssue = {...issue, comments: {...newComments, [newComment.id] : newComment}, updatedAt: getExactCurrentTime()}
    updateIssue(newIssue);
    setFormOpen(false);
    setBody('');
  };

  return (
    <Create>
      {currentUser ? (
        <UserAvatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} />
      ) : (
        ""
      )}
      <Right>
        {isFormOpen ? (
          <BodyForm
            value={body}
            onChange={setBody}
            isWorking={false}
            onSubmit={handleSubmitComment}
            onCancel={() => setFormOpen(false)}
          />
        ) : (
          <Fragment>
            <FakeTextarea onClick={() => setFormOpen(true)}>
              Add a comment...
            </FakeTextarea>
            <ProTip setFormOpen={setFormOpen} />
          </Fragment>
        )}
      </Right>
    </Create>
  );
};

ProjectBoardIssueDetailsCommentsCreate.propTypes = propTypes;

const mapStateToProps = (state) => {
  return {
    currentUser: state.project.currentUser,
  };
};

export default connect(mapStateToProps, {updateIssue})(ProjectBoardIssueDetailsCommentsCreate);
