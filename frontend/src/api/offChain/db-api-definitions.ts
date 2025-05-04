export type AnnounceElectionPayload = {
    contractAddress: string;
    title: string;
    duration: number;
    status: string;
    candidates: {
      name: string;
      party: string;
      image: string; // base64 or multipart
    }[];
};