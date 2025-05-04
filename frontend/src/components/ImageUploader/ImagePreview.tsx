interface ImagePreviewProps {
    file: File | null;
};
  
  const ImagePreview = ({ file }: ImagePreviewProps) => {
    if (!file) {
      return null;
    }
  
    return (
      <div>
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          style={{ width: '200px', height: '200px', objectFit: "contain" }}
        />
      </div>
    );
  };
  
  export default ImagePreview;