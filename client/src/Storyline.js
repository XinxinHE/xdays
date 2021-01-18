import React from "react";
import { hot } from "react-hot-loader";
import { Link } from "react-router-dom";
import AppNav from "./AppNav.js";

class Storyline extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="x-container">
                <AppNav/>
                Storyline
                <Link to="/">Back to home</Link>
            </div>
        );
    }

}
export default hot(module)(Storyline);