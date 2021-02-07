import React from "react";
import { hot } from "react-hot-loader";
import AppNav from "./AppNav.js";
import TimelinePost from "./TimelinePost.js";
import AppBreadcrumbs from './AppBreadcrumbs.js';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

import "./Timeline.css";

const baseUrl = "http://localhost:8080";

const addBtnStyle = {
    'margin': '10px 0',
    'display': 'flex',
    'justifyContent': 'flex-end',
    'padding': '0px 32px',
};

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

        timelinePosts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        timelinePosts.forEach(item => {
            item.editMode = false;
            const createdAt = new Date(item.createdAt);
            item.createdAtStr = createdAt.toLocaleString('en-UK', { hour12: true });
        });

        this.postInEdit = false;

        this.setState({ timelinePosts });
    }

    addNewTimelinePost = () => {
        const timelinePosts = this.state.timelinePosts;
        timelinePosts.unshift({
            editMode: true,
            title: "",
            content: "",
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
                storyId: this.props.storyId,
            };

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            if (data.get('postId')) {
                body.updatedAt = Date.now();
                await fetch(`${baseUrl}/timelinePosts/${data.get('postId')}`, {
                    method: 'PUT',
                    headers: headers,
                    body: body
                });
            } else {
                body.createdAt = Date.now();
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
                    <div style={addBtnStyle} >
                        <Button variant="contained" color="primary"
                            onClick={this.addNewTimelinePost}
                            disabled={this.state.timelinePosts.disableAddBtn}>Add a new post</Button>
                    </div>
                    <Timeline>
                    {
                        this.state.timelinePosts.length > 0 ? (
                            this.state.timelinePosts.map(item =>
                                <TimelineItem key={item.id ?? -1}>
                                    <TimelineOppositeContent className="x-timeline-date">
                                        <Typography variant="body2" color="textSecondary" component="p">{item.createdAtStr}</Typography>
                                    </TimelineOppositeContent>

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
                    </Timeline>
                </Container>
            </div>
        );
    }

}
export default hot(module)(TimelinePage);
