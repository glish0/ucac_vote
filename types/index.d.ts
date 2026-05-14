export type Operator = "orange" | "mtn";

export type Candidate = {
    id: string;
    name: string;
    title: string;
    faculty: string;
    description: string;
    image: string;
    category: "Miss" | "Master";
};

export type CandidateCategory = "Miss" | "Master";

export type Candidate = {
    id: string;
    name: string;
    title: string;
    faculty: string;
    description: string;
    image: string;
    category: CandidateCategory;
};

export type CreateCandidatePayload = {
    name: string;
    title: string;
    faculty: string;
    category: CandidateCategory;
    description: string;
    image_url: File;
};

export type CandidateResponse = {
    id: string;
    name: string;
    title: string;
    faculty: string;
    description: string;
    image_url: string;
    category: CandidateCategory;
    is_active: boolean;
    created_at: string;
};

export type VoteModalProps = {
    candidate: CandidateResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};