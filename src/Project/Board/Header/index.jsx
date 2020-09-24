import React from "react";

import Button from "../../../shared/components/Button";

import { Header, BoardName } from "./Styles";

const ProjectBoardHeader = () => (
  <Header>
    <BoardName>Kanban board</BoardName>
    <a
      href="https://github.com/Phitran276/jira-clone-project"
      target="_blank"
      rel="noreferrer noopener"
    >
      <Button icon="github">Github Repo</Button>
    </a>
  </Header>
);

export default ProjectBoardHeader;
