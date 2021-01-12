import React from "react";
import "./Post.css";

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file: props.defaultImage};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event.target.files[0]);
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        });
    }

    render() {
        return (
            <div className="x-image-uploader">
                <input type="file" name="image" onChange={this.handleChange} />
                <img src={this.state.file} />
            </div>
        );
    }
}
export default ImageUpload;