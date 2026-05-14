
import { createClient } from "../config/client";

const supabase = createClient()



export type CandidateResult = {
    id: string;
    name: string;
    category: "Miss" | "Master" | string;
    faculty: string | null;
    image_url: string | null;
    total_votes: number;
    total_amount?: number;
    payment_count?: number;
};

export async function getCandidateResults() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("candidates_with_votes")
        .select("*")
        .order("total_votes", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []) as CandidateResult[];
}