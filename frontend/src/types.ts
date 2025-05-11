export type AuthUserDataResponse = {
    role: string;
    name: string;
    voter_id: string;
};
export type CandidateResponse = {
    candidate_id: string;
    name: string;
    party: string;
    image: {
        data: number[];
        type: string;
    };
};
export type ElectionResponse = {
    election_id: string;
    title: string;
    contract_address: string;
    status: string;
    created_at: string,
    created_by: string;
    Candidates: CandidateResponse[];
    duration: number,
    end_time: string,
    updated_at: string
};

export type DurationUnit = 'Days' | 'Weeks' | 'Months';

export type CandidateRequest = {
    id: string,
    name: string,
    party: string,
    image: File | null,
    imagePreview: string
}