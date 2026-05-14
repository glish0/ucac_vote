"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateCandidatePayload } from "@/types";
import { createCandidate, getCandidates } from "@/lib/services/candidate-service";



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

export {
    useCandidates,
    useCreateCandidate
}