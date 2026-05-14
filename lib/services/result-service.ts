import { CandidateResult } from "@/constants";
import { createClient } from "../config/client";

const supabase = createClient()
export const getCandidateResults = async (): Promise<CandidateResult[]> => {
    const { data, error } = await supabase
        .from("candidate_results")
        .select("*")
        .order("total_votes", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []) as CandidateResult[];
};