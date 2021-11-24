import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Events from "./components/events/Events";
import Page from "./components/Page";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Event from "./components/events/Event";
import Profil from "./components/Profil";
import CreateEvent from "./components/events/CreateEvent";
import ProfilView from "./components/ProfilView";

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
          <Route exact path="/events/event">
            <Page>
              <Event />
            </Page>
          </Route>
          <Route exact path="/events/nouveau">
            <Page>
              <CreateEvent />
            </Page>
          </Route>
          <Route exact path="/profil">
            <Page>
              <Profil />
            </Page>
          </Route>
          <Route exact path="/profil/id">
            <Page>
              <ProfilView />
            </Page>
          </Route>
          <Route exact path="/connexion">
            <Page>
              <Login />
            </Page>
          </Route>
          <Route exact path="/inscription">
            <Page>
              <Register />
            </Page>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
