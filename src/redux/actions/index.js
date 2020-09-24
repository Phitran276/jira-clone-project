import axios from '../../shared/utils/axios';
import * as TYPE from '../actions/types';

export const fetchIssues = () => async dispatch => {
    const response = await axios.get('/issues.json');

    dispatch({ type: TYPE.FETCH_ISSUES, payload: response.data});
}

export const fetchInfo = () => async dispatch => {
    const response = await axios.get('/info.json');

    dispatch({ type: TYPE.FETCH_INFO, payload: response.data});
}

export const updateInfo = (info) => async dispatch => {
    await axios.put('/info.json', info);

    dispatch({ type: TYPE.UPDATE_INFO, payload: info});
}

export const fetchUsers = () => async dispatch => {
    const response = await axios.get('/users.json');

    dispatch({ type: TYPE.FETCH_USERS, payload: response.data});
}

export const createIssue = (issue) => async dispatch => {
    await axios.post('issues.json', issue);

    dispatch({ type: TYPE.CREATE_ISSUE, payload: issue });
}

export const updateIssue = (issue) => async dispatch => {
    dispatch({ type: TYPE.UPDATE_ISSUE, payload: issue });

    await axios.put(`/issues/${issue.IdFirebase}.json`, issue );

}

export const deleteIssue = (issue) => async dispatch => {
    dispatch({ type: TYPE.DELETE_ISSUE, payload: issue});
        
    await axios.delete(`/issues/${issue.IdFirebase}.json`);
}

export const deleteComment = (issueId, comment) => async dispatch => {
    dispatch({ type: TYPE.DELETE_COMMENT, payload: {issueId, commentId: comment.id}});

    await axios.delete(`/issues/${issueId}/comments/${comment.IdFirebase}.json`);
}

export const updateComment = (issueId, comment) => async dispatch => {
    dispatch({ type: TYPE.UPDATE_COMMENT, payload: {issueId, comment}});

    await axios.put(`/issues/${issueId}/comments/${comment.IdFirebase}.json`, comment);
}

// axios.put('/issues/-MHqg-OSeutGCnajSqn7/title'+'.json', {text: 'How are you to day Tran Ngoc Phi 123?'} )
// .then(res => console.log(res));
