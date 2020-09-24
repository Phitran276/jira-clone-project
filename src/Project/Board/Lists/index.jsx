import React from "react";
import PropTypes from "prop-types";
import { DragDropContext } from "react-beautiful-dnd";
import {connect} from 'react-redux';
import {updateIssue} from '../../../redux/actions/index';

import { IssueStatus } from "../../../shared/constants/issues";
import { moveItemWithinArray, insertItemIntoArray } from '../../../shared/utils/javascript';

import { Lists } from "./Styles";
import List from "./List";

const propTypes = {
  filters: PropTypes.object.isRequired
};

const ProjectBoardLists = ({ filters, allIssues, updateIssue }) => {
  const handleIssueDrop = ({ draggableId, destination, source }) => {
    if(!isPositionChanged(destination, source)) return ;
    const issue = allIssues.find(item => item.id === draggableId);
    const newPosition = calculateIssueListPosition(allIssues, destination, source, draggableId);
    const newIssue = {...issue, status: destination.droppableId, listPosition: newPosition};

    updateIssue(newIssue);

  }
  return (
    <DragDropContext onDragEnd={handleIssueDrop}>
      <Lists>
        {Object.values(IssueStatus).map((status) => (
          <List key={status} 
          status={status} 
          filters={filters} 
          />
        ))}
      </Lists>
    </DragDropContext>
  );
};

const isPositionChanged = (destination, source) => {
  if(!destination) return false;
  const isSameList = destination.droppableId === source.droppableId;
  const isSamePosition = destination.index === source.index;

  return !isSameList || !isSamePosition;
}

const calculateIssueListPosition = (...args) => {
     const {prevIssue, nextIssue} = getAfterDropPrevNextIssue(...args);
     let position;

     if(!prevIssue && !nextIssue){
       position = 1;
     }else if (!prevIssue) {
      position = nextIssue.listPosition - 1;
    } else if (!nextIssue) {
      position = prevIssue.listPosition + 1;
    } else {
      position = prevIssue.listPosition + (nextIssue.listPosition - prevIssue.listPosition) / 2;
    }

     return position;
}

const getAfterDropPrevNextIssue = (allIssues, destination, source, droppedIssueId) => {
  const beforeDropDestinationIssues = getSortedListIssues(allIssues, destination.droppableId);
  const droppedIssue = allIssues.find(issue => issue.id === droppedIssueId );
  const isSameList = destination.droppableId === source.droppableId;

  const afterDropDestinationIssues = isSameList ? 
          moveItemWithinArray(beforeDropDestinationIssues, droppedIssue, destination.index) : 
          insertItemIntoArray(beforeDropDestinationIssues, droppedIssue, destination.index)

  return {
    prevIssue: afterDropDestinationIssues[destination.index - 1],
    nextIssue: afterDropDestinationIssues[destination.index + 1]
  }        
}

const getSortedListIssues = (issues, status) =>
  issues.filter(issue => issue.status === status).sort((a, b) => a.listPosition - b.listPosition);

ProjectBoardLists.propTypes = propTypes;

const mapStateToProps = state => {
    return {
      allIssues: state.project.issues
    }
}

export default connect(mapStateToProps, {updateIssue} )(ProjectBoardLists);
