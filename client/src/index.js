import React from "react";
import ReactDOM from "react-dom";
import Admin from "./Admin.js";
import Timeline from "./Timeline.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
    return(
        <Switch>
            <Route exact path="/" component={Admin}/>
            <Route exact path="/Story" component={Timeline}/>
            <Route exact path="/Story/:storyid" render={props => <Timeline {...props.match.params} />} />
        </Switch>
    );
}

ReactDOM.render(
    <Router>
        <App />
    </Router>, 
    document.getElementById("root")
);