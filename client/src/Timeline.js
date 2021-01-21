import React from "react";
import { hot } from "react-hot-loader";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppNav from "./AppNav.js";
import TimelinePost from "./TimelinePost.js";

const baseUrl = "http://localhost:8080";

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = { timelinePosts: [], disableAddBtn: false };
        this.postInEdit = false; // Only allow one post in Edit
    }

    componentDidMount() {
        this.getTimelinePosts();
    }

    getTimelinePosts = async () => {
        const response = await fetch(`${baseUrl}/timelinePosts/${this.props.storyId}`, {
            method: 'GET'
        });
        const timelinePosts = await response.json();

        console.log("getTimelinePosts: \n");
        console.log(timelinePosts);

        timelinePosts.forEach(item => item.editMode = false);
        this.postInEdit = false;

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
        this.setState({ timelinePosts });
    }

    handleEdit = (postId) => {
        if (this.postInEdit) {
            return;
        }
        const timelinePosts = this.state.timelinePosts.map((item) => {
            if (item.id === postId) {
                item.editMode = true;
                this.postInEdit = true;
            }
            return item;
        });
        this.setState({ timelinePosts });
    }

    handleCancel = async () => {
        await this.getTimelinePosts();
    }

    handleDelete = async (postId) => {
        await fetch(`${baseUrl}/timelinePosts/${this.props.storyId}/${postId}`, {
            method: 'DELETE'
        });
        await this.getTimelinePosts();
    }

    handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const data = new FormData(event.target);
            const body = {
                title: data.get("postTitle"),
                content: data.get("postContent"),
                storyId: this.props.storyId
            };

            if (data.get('postId')) {
                await fetch(`${baseUrl}/timelinePosts/${data.get('postId')}`, {
                    method: 'PUT',
                    body: body
                });
            } else {
                await fetch(`${baseUrl}/timelinePosts`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
            }
        } catch (err) {
            console.error(err);
        }
        await this.getTimelinePosts();
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
                                        <TimelinePost item={item}
                                            handleSubmit={this.handleSubmit}
                                            handleEdit={this.handleEdit.bind(this, item.id)}
                                            handleDelete={this.handleDelete.bind(this, item.id)}
                                            handleCancel={this.handleCancel}
                                        />
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