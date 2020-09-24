import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteIssue } from '../../../redux/actions/index';

import Button from '../../../shared/components/Button';
import ConfirmModal from '../../../shared/components/ConfirmModal';

const propTypes = {
    issue: PropTypes.object.isRequired,
    modalClose: PropTypes.func.isRequired,
  };

const ProjectBoardIssueDetailsDelete = ({issue, modalClose, deleteIssue}) => {

    const handleIssueDelete =() => {
        modalClose();
        deleteIssue(issue);
    }

    return (
        <ConfirmModal
      title="Are you sure you want to delete this issue?"
      message="Once you delete, it's gone for good."
      confirmText="Delete issue"
      onConfirm={handleIssueDelete}
      renderLink={modal => (
        <Button icon="trash" iconSize={19} variant="empty" onClick={modal.open} />
      )}
    />
    );
}  

ProjectBoardIssueDetailsDelete.propTypes=propTypes;
export default connect(null, {deleteIssue})(ProjectBoardIssueDetailsDelete);