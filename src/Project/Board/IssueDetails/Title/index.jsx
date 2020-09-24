import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { KeyCodes } from "../../../../shared/constants/keyCodes";
import { TitleTextarea, ErrorText } from "./Styles";

import { is, generateErrors } from "../../../../shared/utils/validation";

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsTitle = ({ issue, updateIssue }) => {
  const [title, setTitle] = useState(issue.title);
  const [error, setError] = useState(null);

  const handleTitleChange = () => {
    setError(null);

    const errors = generateErrors({ title }, { title: [is.required(), is.maxLength(200)] });

    if (errors.title) {
      setError(errors.title);
    } else {
      updateIssue({ title });
    }
  };

  return (
    <Fragment>
      <TitleTextarea
        minRows={1}
        placeholder="Short summary"
        defaultValue={issue.title}
        onChange={setTitle}
        onBlur={handleTitleChange}
        onKeyDown={event => {
          if (event.keyCode === KeyCodes.ENTER) {
            event.target.blur();
          }
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Fragment>
  );
};

ProjectBoardIssueDetailsTitle.propTypes = propTypes;

export default ProjectBoardIssueDetailsTitle;