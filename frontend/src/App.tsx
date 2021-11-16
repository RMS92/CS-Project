import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Events from "./components/Events";
import Page from "./components/Page";

function App() {
  return (
    <div className="page-wrapper">
      <Router>
        <Switch>
          <Route exact path="/">
            <Page>
              <Events />
            </Page>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
