import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DefaultLogo from "./img/placeholder-img.png";

function Post(props) {
    if (props.item.editMode) {
        return(
            <Card style={{width: '18rem'}}>
                <Form onSubmit={props.handleSubmit}>
                    <Form.Group controlId="formPostTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" placeholder="Enter title" />
                    </Form.Group>
                    <Form.Group controlId="formPostContent">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="content" placeholder="Enter content" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>{' '}
                    <Button variant="primary" type="button" onClick={props.handleCancel}>Cancel</Button>
                </Form>
            </Card>
        );
    } else {
        return (
            <Card style={{width: '18rem'}}>
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