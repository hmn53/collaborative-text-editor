import React from "react";
import { RouteComponentProps } from "react-router";

interface GroupEditorProps {}

export const GroupEditor: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
}) => {
  return <h1>Hi this is group {id}</h1>;
};
