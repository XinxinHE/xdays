import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DefaultLogo from "./img/placeholder-img.png";
import "./Post.css";

function Post(props) {
    if (props.item.editMode) {
        return(
            <Card className="x-card-wrapper">
                <Form onSubmit={props.handleSubmit}>
                    <input type="hidden" name="id" value={props.item.id} />
                    <Form.Group controlId="formPostTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" placeholder="Enter title" defaultValue={props.item.title} />
                    </Form.Group>
                    <Form.Group controlId="formPostContent">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="content" placeholder="Enter content" defaultValue={props.item.content}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>{' '}
                    <Button variant="primary" type="button" onClick={props.handleCancel}>Cancel</Button>
                </Form>
            </Card>
        );
    } else {
        return (
            <Card className="x-card-wrapper">
                <Card.Img variant="top" src={DefaultLogo} />
                <Card.Body>
                    <Card.Title>{props.item.title}</Card.Title>
                    <Card.Text>{props.item.content}</Card.Text>
                    <Button variant="primary" type="button" onClick={props.handleEdit}>Edit</Button>{' '}
                    <Button variant="primary" type="button" onClick={props.handleDelete}>Delete</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default Post;