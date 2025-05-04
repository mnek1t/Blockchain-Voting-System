export function formatDate(timestamp: string | undefined) : string {
  if(!timestamp) return ''
  return new Date(timestamp).toLocaleString();
};

export const getTimeLeft = (time: string | undefined) => {
  if(!time) return "Voting ended"
  const now = new Date();
  const end = new Date(time);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Voting ended";

  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m`;
};

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject('Could not convert to base64');
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};