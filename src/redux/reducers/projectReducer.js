import * as TYPE from '../actions/types';
import _ from 'lodash';

const initialState = {
  name: null,
  category: null,
  url: null,
  description: null,
  issues: null,
  users: null,
  currentUser: {
    id: 2,
    name: "Tran Ngoc",
    avatarUrl: 'https://avatarfiles.alphacoders.com/700/70031.gif'
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.FETCH_ISSUES: {
      const newIssues = Object.keys(action.payload).map(key => {
        return { ...action.payload[key], IdFirebase: key }
      })
      return { ...state, issues: newIssues };
    }
    case TYPE.FETCH_INFO: {
      return { ...state, ...action.payload };
    }
    case TYPE.UPDATE_INFO: {
      return { ...state, ...action.payload };
    }
    case TYPE.FETCH_USERS:
      return { ...state, users: Object.values(action.payload) };
    case TYPE.CREATE_ISSUE: {
      const newIssues = [...state.issues];
      newIssues.push(action.payload);
      return { ...state, issues: newIssues };
    }
    case TYPE.UPDATE_ISSUE: {
      const index = state.issues.findIndex(issue => issue.id === action.payload.id);
      const newIssues = [...state.issues];
      newIssues.splice(index, 1, action.payload);
      return { ...state, issues: newIssues };
    }
    case TYPE.DELETE_ISSUE: {
      const index = state.issues.findIndex(issue => issue.id === action.payload.id);
      const newIssues = [...state.issues];
      newIssues.splice(index, 1);
      return { ...state, issues: newIssues };
    }
    case TYPE.DELETE_COMMENT: {
      let newIssues = [...state.issues]
      let indexIssue = newIssues.findIndex(item => item.IdFirebase === action.payload.issueId);

      const newComments = _.omit(newIssues[indexIssue].comments, [action.payload.commentId] );
      
      newIssues[indexIssue].comments = newComments;
      return { ...state, issues: newIssues};
    }
    case TYPE.UPDATE_COMMENT: {
      let newIssues = [...state.issues]
      let indexIssue = newIssues.findIndex(item => item.IdFirebase === action.payload.issueId);

      newIssues[indexIssue].comments = {...newIssues[indexIssue].comments, [action.payload.comment.IdFirebase]: action.payload.comment};
      
      return { ...state, issues: newIssues};
    }
    default:
      return state;
  }
}