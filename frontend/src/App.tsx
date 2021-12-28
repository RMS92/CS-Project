import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import Events from "./components/events/Events";
import Page from "./components/Page";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Event from "./components/events/ShowEvent";
import Profil from "./components/Profil";
import CreateEvent from "./components/events/CreateEvent";
import ProfilView from "./components/ProfilView";
import { User } from "./types";
import { apiFetch } from "./utils/api";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [onConnect, setOnConnect] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const user = await apiFetch("/me");
        if (!user) {
          return;
        }
        setUser(user);
        setOnConnect(true);
      } catch (e) {
        // @ts-ignore
        setUser(null);
      }
    })();
  }, [onConnect]);

  return (
    <div className="page-wrapper">
      <Router>
        <Header user={user} onConnect={onConnect} setOnConnect={setOnConnect} />
        <Switch>
          <Route exact path="/">
            <Events />
          </Route>
          <Route exact path="/events/nouveau">
            {user ? <CreateEvent user={user} /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/events/:id">
            <Event user={user} />
          </Route>
          <Route exact path="/profil">
            {user ? <Profil user={user} /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/profil/:id">
            <ProfilView />
          </Route>
          <Route exact path="/connexion">
            {onConnect ? (
              <Redirect to="/" />
            ) : (
              <Login onConnect={setOnConnect} />
            )}
          </Route>
          <Route exact path="/inscription">
            {onConnect ? <Redirect to="/" /> : <Register />}
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
