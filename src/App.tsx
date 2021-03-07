import React from "react";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import { SyncingEditor } from "./SyncingEditor";
import { GroupEditor } from "./GroupEditor";

function App() {
  return (
    <BrowserRouter>
      <Route
        path="/"
        exact
        render={() => {
          return <Redirect to={`/group/${Date.now()}`} />;
        }}
      />
      <Route path="/group/:id" exact component={GroupEditor} />
    </BrowserRouter>
  );
}

export default App;
