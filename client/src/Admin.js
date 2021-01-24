import React from "react";
import { hot } from "react-hot-loader";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppNav from "./AppNav.js";
import Story from "./Story.js";
import DefaultLogo from "./img/placeholder-img.png";
import "./Admin.css";

const baseUrl = "http://localhost:8080";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stories: [], disableAddBtn: false };
        this.postInEdit = false; // Only allow one post in Edit
    }

    componentDidMount() {
        this.getStories();
    }

    getStories = async () => {
        const response = await fetch(baseUrl + '/stories', {
            method: 'GET'
        });
        const stories = await response.json();

        console.log("getStories: \n");
        console.log(stories);

        stories.forEach(item => item.editMode = false);
        this.postInEdit = false;

        this.setState({ stories });
    }

    addNewStory = () => {
        const stories = this.state.stories;
        stories.unshift({
            editMode: true,
            title: "",
            content: "",
            image: DefaultLogo,
            croppedImage: null
        });
        stories.disableAddBtn = true;
        this.setState({ stories });
    }

    handleCancel = async () => {
        await this.getStories();
    }

    handleEdit = (storyId) => {
        if (this.postInEdit) {
            return;
        }
        const stories = this.state.stories.map((item) => {
            if (item.id === storyId) {
                item.editMode = true;
                this.postInEdit = true;
            }
            return item;
        });
        this.setState({ stories });
    }

    handleDelete = async (storyId) => {
        await fetch(baseUrl + `/stories/${storyId}`, {
            method: 'DELETE'
        });
        await this.getStories();
    }

    handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const data = new FormData(event.target);
            const body = new FormData();
            body.append("image", data.get("image"), "postImage");
            body.append("title", data.get("title"));
            body.append("content", data.get("content"));
            body.append("croppedImage", document.getElementById("storyPic").src);

            if (data.get('id')) {
                await fetch(`${baseUrl}/stories/${data.get('id')}`, {
                    method: 'PUT',
                    body: body
                });
            } else {
                await fetch(`${baseUrl}/stories`, {
                    method: 'POST',
                    body: body
                });
            }
            await this.getStories();
        } catch (err) {
            console.error(err);
            await this.getStories();
        }
    }

    render() {
        return (
            <div className="x-container">
                <AppNav/>
                <Container>
                    <div className="x-btn-addpost" >
                        <Button variant="contained" color="primary" 
                                onClick={this.addNewStory} 
                                disabled={this.state.stories.disableAddBtn}>Add a New Story</Button>
                    </div>
                    <Grid container spacing={3}>
                        {
                            this.state.stories.length > 0 ? (
                                this.state.stories.map(item =>
                                    <Grid item xs={12} sm={6} md={3} lg={2} key={item.id ?? -1}>
                                        <Story item={item}
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

export default hot(module)(Admin);