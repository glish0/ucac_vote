"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateCandidatePayload, GetPaymentsParams } from "@/types";
import { createCandidate, getCandidates } from "@/lib/services/candidate-service";
import { getCandidateVoteTotalByCandidateId, getCandidateVoteTotals, getPayments, getPaymentStats } from "@/lib/services/payement-service";



const useCreateCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCandidatePayload) => createCandidate(payload),

        onMutate: () => {
            toast.loading("Ajout du candidat...", {
                id: "create-candidate",
                description: "Upload de la photo et enregistrement du candidat.",
            });
        },

        onSuccess: (candidate) => {
            toast.success("Candidat ajouté", {
                id: "create-candidate",
                description: `${candidate.name} a été ajouté avec succès.`,
            });

            queryClient.invalidateQueries({
                queryKey: ["candidates"],
            });

            queryClient.invalidateQueries({
                queryKey: ["candidate-results"],
            });
        },

        onError: (error) => {
            toast.error("Ajout impossible", {
                id: "create-candidate",
                description:
                    error instanceof Error
                        ? error.message
                        : "Une erreur est survenue pendant l’ajout du candidat.",
            });
        },
    });
};


const useCandidates = () => {
    return useQuery({
        queryKey: ["candidates"],
        queryFn: getCandidates,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
};



function usePaymentStats() {
    return useQuery({
        queryKey: ["payment_stats"],
        queryFn: getPaymentStats,
    });
}

function useCandidateVoteTotals() {
    return useQuery({
        queryKey: ["candidate_vote_totals"],
        queryFn: getCandidateVoteTotals,
    });
}

function useCandidateVoteTotal(candidateId?: string) {
    return useQuery({
        queryKey: ["candidate_vote_totals", candidateId],
        queryFn: () => getCandidateVoteTotalByCandidateId(candidateId!),
        enabled: !!candidateId,
    });
}

function usePayments(params?: GetPaymentsParams) {
    return useQuery({
        queryKey: ["payments", params],
        queryFn: () => getPayments(params),
    });
}

export {
    useCandidates,
    usePaymentStats,
    useCreateCandidate,
    usePayments,
    useCandidateVoteTotals,
    useCandidateVoteTotal

}