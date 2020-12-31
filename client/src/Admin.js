import React from "react";
import { hot } from "react-hot-loader";
import Button from 'react-bootstrap/Button';
import AppNav from "./AppNav.js";
import Post from "./Post.js";
import DefaultLogo from "./img/placeholder-img.png";

const baseUrl = "http://localhost:8080";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts = async () => {
        const response = await fetch(baseUrl + '/posts');
        const data = await response.json();
        data.forEach(item => item.editMode = false);
        this.setState({ data })
    }

    addNewPost = () => {
        const data = this.state.data;
        data.unshift({
            editMode: true,
            title: "",
            content: ""
        })
        this.setState({ data })
    }

    handleCancel = async () => {
        await this.getPosts();
    }

    handleEdit = (postId) => {
        const data = this.state.data.map((item) => {
            if (item.id === postId) {
                item.editMode = true;
            }
            return item;
        });
        this.setState({ data });
    }

    handleDelete = async (postId) => {
        await fetch(baseUrl + `/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
        });
        await this.getPosts();
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);

        const body = JSON.stringify({
            title: data.get('title') ?? "empty",
            content: data.get('content') ?? "empty",
            image: DefaultLogo,
        });
        
        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
        };

        if (data.get('id')) {
            await fetch(baseUrl + `/posts/${data.get('id')}`, {
                method: 'PUT',
                headers,
                body,
            });
        } else {
            await fetch(baseUrl + '/posts', {
                method: 'POST',
                headers,
                body,
            });
        }
        await this.getPosts();
    }

    render() {
        return (
            <div>
                <AppNav />
                <Button onClick={this.addNewPost}>
                    Add New Post
               </Button>
               {
                    this.state.data.length > 0 ? (
                        this.state.data.map(item =>
                            <Post item={item} key={item.id ?? -1}
                                handleSubmit={this.handleSubmit}
                                handleEdit={this.handleEdit.bind(this, item.id)}
                                handleDelete={this.handleDelete.bind(this, item.id)}
                                handleCancel={this.handleCancel}
                            />)
                    ) : (
                            <div>
                                <div>You don't have any posts. Use the "Add New Post" button to add some new posts!</div>
                            </div>
                        )
                }
            </div>
        );
    }
}

export default hot(module)(Admin);