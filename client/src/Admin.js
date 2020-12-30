import React from "react";
import { hot } from "react-hot-loader";
import AppNav from "./AppNav.js";
import Post from "./Post.js";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts = async () => {
        const response = await fetch('/posts');
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
        await fetch(`/posts/${postId}`, {
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
            title: data.get('title'),
            content: data.get('content'),
            image: DefaultLogo,
        });

        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
        };

        if (data.get('id')) {
            await fetch(`/posts/${data.get('id')}`, {
                method: 'PUT',
                headers,
                body,
            });
        } else {
            await fetch('/posts', {
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
                <Post />
            </div>
        );
    }
}

export default hot(module)(Admin);