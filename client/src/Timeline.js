import React from "react";
import { hot } from "react-hot-loader";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppNav from "./AppNav.js";
import TimelinePost from "./TimelinePost.js";

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {timelinePosts: [{id: 123, title: "1", content: "test"}, {id: 124, title: "2", content: "test2"}]};
    }

    getTimelinePosts = async () => {
        const response = await fetch(baseUrl + '/timelinePosts', {
            method: 'GET'
        });
        const timelinePosts = await response.json();

        console.log("getTimelinePosts: \n");
        console.log(timelinePosts);

        timelinePosts.forEach(item => item.editMode = false);
        this.setState({ timelinePosts });
    }

    addNewTimelinePost = () => {
        const timelinePosts = this.state.timelinePosts;
        timelinePosts.unshift({
            editMode: true,
            title: "",
            content: ""
        });
        timelinePosts.disableAddBtn = true;
        console.log(timelinePosts);
        this.setState({ timelinePosts });
    }


    render() {
        return (
            <div className="x-container">
                <AppNav/>
                <Link to="/">Back to home</Link>
                <h2>Story {this.props.storyid}</h2>
                <Container>
                    <div className="x-btn-addpost" >
                        <Button variant="contained" color="primary"
                                onClick={this.addNewTimelinePost} 
                                disabled={this.state.timelinePosts.disableAddBtn}>Add a new post</Button>
                    </div>
                    <Grid container spacing={3}>
                        {
                            this.state.timelinePosts.length > 0 ? (
                                this.state.timelinePosts.map(item =>
                                    <Grid item xs={12} key={item.id ?? -1}>
                                        <TimelinePost item={item}/>
                                    </Grid>)) 
                            : (
                                <div>
                                    <div>You don't have any posts. Use the "Add New Story" button to add some new stories!</div>
                                </div>
                            )
                        }
                    </Grid>
                </Container>
            </div>
        );
    }

}
export default hot(module)(Timeline);