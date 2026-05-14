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

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type Payment = {
    id: string;
    external_id: string;
    freemopay_reference: string | null;

    payer: string;
    amount: number;
    description: string | null;

    status: PaymentStatus;

    candidate_id: string | null;
    voter_name: string | null;
    voter_phone: string | null;
    operator: "orange" | "mtn" | null;
    vote_count: number | null;

    transaction_type: string | null;
    message: string | null;

    raw_init_response: unknown | null;
    raw_webhook_response: unknown | null;

    paid_at: string | null;
    created_at: string;
    updated_at: string | null;
};

export type GetPaymentsParams = {
    status?: PaymentStatus;
    candidateId?: string;
    search?: string;
    page?: number;
    limit?: number;
};

export type PaymentStats = {
    total_payments: number;
    success_payments: number;
    pending_payments: number;
    failed_payments: number;
    total_amount: number;
    total_votes: number;
};

export type CandidateVoteTotal = {
    candidate_id: string;
    total_votes: number;
    total_amount: number;
    payment_count: number;
};