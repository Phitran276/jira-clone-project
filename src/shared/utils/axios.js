import axios from 'axios';

const instance = axios.create({
     baseURL: 'https://jira-clone-project.firebaseio.com/'
});

export default instance;