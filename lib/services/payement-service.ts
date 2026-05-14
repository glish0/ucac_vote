
import { CandidateVoteTotal, GetPaymentsParams, Payment, PaymentStats } from "@/types";
import { createClient } from "../config/client";


export async function getPayments(params?: GetPaymentsParams) {
    const supabase = createClient();

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("payments")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

    if (params?.status) {
        query = query.eq("status", params.status);
    }

    if (params?.candidateId) {
        query = query.eq("candidate_id", params.candidateId);
    }

    if (params?.search) {
        query = query.or(
            `voter_name.ilike.%${params.search}%,voter_phone.ilike.%${params.search}%,payer.ilike.%${params.search}%,freemopay_reference.ilike.%${params.search}%`
        );
    }

    const { data, error, count } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return {
        data: data as Payment[],
        total: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
    };
}

export async function getPaymentStats(): Promise<PaymentStats> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("payments")
        .select("status, amount, vote_count");

    if (error) {
        throw new Error(error.message);
    }

    const stats: PaymentStats = {
        total_payments: 0,
        success_payments: 0,
        pending_payments: 0,
        failed_payments: 0,
        total_amount: 0,
        total_votes: 0,
    };

    for (const payment of data ?? []) {
        stats.total_payments += 1;

        if (payment.status === "SUCCESS") {
            stats.success_payments += 1;
            stats.total_amount += Number(payment.amount ?? 0);
            stats.total_votes += Number(payment.vote_count ?? 0);
        }

        if (payment.status === "PENDING") {
            stats.pending_payments += 1;
        }

        if (payment.status === "FAILED") {
            stats.failed_payments += 1;
        }
    }

    return stats;
}

export async function getCandidateVoteTotals() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("candidate_vote_totals")
        .select("*")
        .order("total_votes", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []) as CandidateVoteTotal[];
}

export async function getCandidateVoteTotalByCandidateId(candidateId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("candidate_vote_totals")
        .select("*")
        .eq("candidate_id", candidateId)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data as CandidateVoteTotal | null;
}