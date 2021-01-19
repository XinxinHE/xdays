import React from "react";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

function TimelinePost(props) {
    if (props.item.editMode) {
        return(
            <Card className="x-card-wrapper">
                <form encType="multipart/form-data" className="x-card-form" onSubmit={props.handleSubmit} name="formPost">
                    <input type="hidden" name="id" value={props.item.id} />
                    <FormControl controlId="formPostTitle">
                        <InputLabel>Title</InputLabel>
                        <Input type="text" name="title" placeholder="Enter title" defaultValue={props.item.title} />
                    </FormControl>
                    <FormControl controlId="formPostContent">
                        <InputLabel>Description</InputLabel>
                        <Input type="text" name="content" placeholder="Enter content" defaultValue={props.item.content}/>
                    </FormControl>
                    <Button variant="primary" type="submit">Submit</Button>{' '}
                    <Button variant="primary" type="button" onClick={props.handleCancel}>Cancel</Button>
                </form>
            </Card>
        );
    } else {
        return (
            <Card className="x-card-wrapper">
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">{props.item.title}</Typography>
                        <Typography variant="body2" color="textSecondary" component="p">{props.item.content}</Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={props.handleEdit}>Edit</Button>{' '}
                    <Button size="small" color="primary" onClick={props.handleDelete}>Delete</Button>
                </CardActions>
            </Card>
        );
    }
}

export default TimelinePost;