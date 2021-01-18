import React from "react";
import ReactDOM from "react-dom";
import Admin from "./Admin.js";
import Storyline from "./Storyline.js";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return(
        <Switch>
            <Route exact path="/" component={Admin}/>
            <Route exact path="/storyline" component={Storyline}/>
        </Switch>
    );
}

ReactDOM.render(
    <Router>
        <App />
    </Router>, 
    document.getElementById("root")
);