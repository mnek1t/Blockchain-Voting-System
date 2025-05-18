import { CircularProgress } from '@mui/material';
import './loading-spinner.css'
interface LoadButtonProps {
  innertText: string;
  loading?: boolean;
}

export default function LoadingSpinner({innertText, loading}: LoadButtonProps) {
  return (
    <div className="loading-spinner">
    {loading && (
      <>
        <CircularProgress sx={{ color: '#012169' }} size={50} />
        <p className="loading-spinner__inner-text">{innertText}</p>
      </>
    )}
  </div>
  );
}
