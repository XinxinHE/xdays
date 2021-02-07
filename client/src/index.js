import React from "react";
import ReactDOM from "react-dom";
import Admin from "./Admin.js";
import TimelinePage from "./TimelinePage.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
    return(
        <Switch>
            <Route exact path="/" component={Admin}/>
            <Route exact path="/Story" component={TimelinePage}/>
            <Route exact path="/Story/:storyId" render={props => <TimelinePage {...props.match.params} />} />
        </Switch>
    );
}

ReactDOM.render(
    <Router>
        <App />
    </Router>, 
    document.getElementById("root")
);