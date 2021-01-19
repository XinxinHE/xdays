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
        this.state = { data: [], disableAddBtn: false };
    }

    componentDidMount() {
        this.getStories();
    }

    getStories = async () => {
        const response = await fetch(baseUrl + '/stories', {
            method: 'GET'
        });
        const data = await response.json();

        console.log("getStories: \n");
        console.log(data);

        data.forEach(item => item.editMode = false);
        this.setState({ data });
    }

    addNewStory = () => {
        const data = this.state.data;
        data.unshift({
            editMode: true,
            title: "",
            content: "",
            image: DefaultLogo
        });
        data.disableAddBtn = true;
        this.setState({ data });
    }

    handleCancel = async () => {
        await this.getStories();
    }

    handleEdit = (storyId) => {
        const data = this.state.data.map((item) => {
            if (item.id === storyId) {
                item.editMode = true;
            }
            return item;
        });
        this.setState({ data });
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
                                disabled={this.state.data.disableAddBtn}>Add a New Story</Button>
                    </div>
                    <Grid container spacing={3}>
                        {
                            this.state.data.length > 0 ? (
                                this.state.data.map(item =>
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