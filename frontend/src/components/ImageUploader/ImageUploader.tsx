import uploadImage from '../../assets/upload-svgrepo-com.svg';
import ImagePreview from './ImagePreview';
import './image-uploader.css'
interface ImageUploaderProps {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    maxSizeMB: string;
    accept: string;
    initialImage: File | string | null;
}

const ImageUploader = (props: ImageUploaderProps) => {
    return (
        <>
            <div className="upload-file-container">
                {props.initialImage ? (
                    typeof props.initialImage === "string" ? (
                        <img src={props.initialImage} alt="preview" className="uploaded-image" />
                    ) : (
                        <ImagePreview file={props.initialImage} />
                    )
                    ) : (
                    <>
                        <img className="upload-image-logo" src={uploadImage} alt="upload" />
                        <h3>Click box to upload</h3>
                        <p>Maximum file size {props.maxSizeMB}mb</p>
                    </>
                )}

                <input
                    type="file"
                    accept={props.accept}
                    aria-label="Upload"
                    name="file"
                    onChange={props.handleFileUpload}
                />
            </div>
        </>
    );
};

export default ImageUploader;