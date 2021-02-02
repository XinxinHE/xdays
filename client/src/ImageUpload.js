import React from "react";
import ReactCrop from 'react-image-crop'; 
import 'react-image-crop/dist/ReactCrop.css';

import "./Story.css";

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null,
            crop: {
                unit: 'px',
                width: 250,
                aspect: 3 / 4
            }
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            imageSrc: URL.createObjectURL(event.target.files[0])
        });
    }

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'CroppedImage.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        
        return canvas.toDataURL("image/jpeg", 1);
        // return new Promise((resolve, reject) => {
        //     resolve(canvas.toDataURL("image/jpeg"));
        //     // canvas.toBlob(blob => {
        //     //     if (!blob) {
        //     //         //reject(new Error('Canvas is empty'));
        //     //         console.error('Canvas is empty');
        //     //         return;
        //     //     }
        //     //     this.props.setCoverPicBlob(blob);
        //     //     blob.name = fileName;
        //     //     window.URL.revokeObjectURL(this.fileUrl);
        //     //     this.fileUrl = window.URL.createObjectURL(blob);
        //     //     resolve(this.fileUrl);
        //     // }, 'image/jpeg');
        // });
    }
    
    render() {
        const { crop, croppedImageUrl, imageSrc } = this.state;
        return (
            <div className="x-image-uploader">
                <input type="file" name="image" onChange={this.handleChange} />
                {imageSrc && (
                    <ReactCrop
                        src={imageSrc}
                        crop={crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                )}
                <img id="storyPic" src={croppedImageUrl} />
            </div>
        );
    }
}
export default ImageUpload;