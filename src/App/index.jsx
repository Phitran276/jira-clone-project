import React, { Fragment } from "react";
import './fontStyles.css';
import NormalizeStyles from "./NormalizeStyles";
import BaseStyles from "./BaseStyles";
import Notify from "./Notify";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import Project from '../Project';

const App = () => {
  return (
    <Fragment>
      <NormalizeStyles />
      <BaseStyles />
      <Notify />
      <BrowserRouter>
        <Redirect exact from="/" to="/project" />
        <Route path="/project" component={Project} />
      </BrowserRouter>
    </Fragment>
  );
};

export default App;
