import React from "react";
import { hot } from "react-hot-loader";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppNav from "./AppNav.js";
import TimelinePost from "./TimelinePost.js";
import AppBreadcrumbs from './AppBreadcrumbs.js';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

const baseUrl = "http://localhost:8080";

class TimelinePage extends React.Component {
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

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            if (data.get('postId')) {
                await fetch(`${baseUrl}/timelinePosts/${data.get('postId')}`, {
                    method: 'PUT',
                    headers: headers,
                    body: body
                });
            } else {
                await fetch(`${baseUrl}/timelinePosts`, {
                    method: 'POST',
                    headers: headers,
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
                <AppNav />
                <Container>
                    <AppBreadcrumbs storyTitle={this.props.storyId} />
                    <div className="x-btn-addpost" >
                        <Button variant="contained" color="primary"
                            onClick={this.addNewTimelinePost}
                            disabled={this.state.timelinePosts.disableAddBtn}>Add a new post</Button>
                    </div>
                    {
                        this.state.timelinePosts.length > 0 ? (
                            this.state.timelinePosts.map(item =>
                                <TimelineItem key={item.id ?? -1}>
                                    <TimelineOppositeContent>10:00am</TimelineOppositeContent>

                                    <TimelineSeparator>
                                        <TimelineDot />
                                        <TimelineConnector />
                                    </TimelineSeparator>

                                    <TimelineContent>
                                        <TimelinePost item={item}
                                            handleSubmit={this.handleSubmit}
                                            handleEdit={this.handleEdit.bind(this, item.id)}
                                            handleDelete={this.handleDelete.bind(this, item.id)}
                                            handleCancel={this.handleCancel}
                                        />
                                    </TimelineContent>
                                </TimelineItem>))
                            : (
                                <div>
                                    <div>You don't have any posts. Use the "Add New Story" button to add some new stories!</div>
                                </div>
                            )
                    }
                </Container>
            </div>
        );
    }

}
export default hot(module)(TimelinePage);