import { TFunction } from 'i18next';

export function formatDate(timestamp: string | undefined) : string {
  if(!timestamp) return ''
  return new Date(timestamp).toLocaleString();
};

export const getTimeLeft = (time: string | undefined, t: TFunction) => {
  if(!time) return t("votingEnded")
  const now = new Date();
  const end = new Date(time);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return t("votingEnded");

  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return t("timeLeft", { days, hours, minutes });
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

export const downloadSaltFile = (salt: string, filename = "BVS_SECRET_SALT_DO_NOT_SHARE.txt") => {
  const blob = new Blob([salt], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};