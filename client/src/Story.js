import React from "react";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import ImageUpload from "./ImageUpload.js"; 
import "./Story.css";

function Story(props) {
    if (props.item.editMode) {
        return(
            <Card className="x-card-wrapper">
                <form encType="multipart/form-data" className="x-card-form" onSubmit={props.handleSubmit} name="formStory">
                    <input type="hidden" name="id" value={props.item.id} />
                    <FormControl>
                        <ImageUpload defaultImage={props.item.image}/>
                    </FormControl>
                    <FormControl fullWidth={true}>
                        <InputLabel>Title</InputLabel>
                        <Input type="text" name="title" placeholder="Enter title" defaultValue={props.item.title} />
                    </FormControl>
                    <FormControl fullWidth={true}>
                        <InputLabel>Description</InputLabel>
                        <Input type="text" name="content" placeholder="Enter content" defaultValue={props.item.content} />
                    </FormControl>
                    <Button size="small" color="primary" type="submit">Submit</Button>{' '}
                    <Button size="small" color="primary" type="button" onClick={props.handleCancel}>Cancel</Button>
                </form>
            </Card>
        );
    } else {
        const storyUrl = "/Story/" + props.item.id;
        return (
            <Card className="x-card-wrapper">
                <Link to={storyUrl} className="x-card-link">
                    <CardActionArea>
                        <CardMedia component="img" image={props.item.image} title="image"/>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">{props.item.title}</Typography>
                            <Typography variant="body2" color="textSecondary" component="p">{props.item.content}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Link>
                <CardActions>
                    <Button size="small" color="primary" onClick={props.handleEdit}>Edit</Button>{' '}
                    <Button size="small" color="primary" onClick={props.handleDelete}>Delete</Button>
                </CardActions>
            </Card>
        );
    }
}

export default Story;