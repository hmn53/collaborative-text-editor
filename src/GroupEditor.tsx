import React from "react";
import { RouteComponentProps } from "react-router";
import { SyncingEditor } from "./SyncingEditor";

interface GroupEditorProps {}

export const GroupEditor: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
}) => {
  return (
    <div>
      <SyncingEditor groupId={id} />
    </div>
  );
};
