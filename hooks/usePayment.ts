"use client";

import { initiatePayment, InitiatePaymentPayload } from "@/lib/services/paiement-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount);
};

export const useInitiatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: InitiatePaymentPayload) => initiatePayment(payload),

        onMutate: () => {
            toast.loading("Initialisation du paiement...", {
                id: "initiate-payment",
                description: "Préparation de votre vote.",
            });
        },

        onSuccess: (data) => {
            toast.success("Vote enregistré", {
                id: "initiate-payment",
                description: `${data.voteCount} vote(s) validé(s) pour ${formatAmount(
                    data.totalAmount
                )} FCFA.`,
            });

            queryClient.invalidateQueries({
                queryKey: ["candidate-results"],
            });

            queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
        },

        onError: (error) => {
            toast.error("Vote impossible", {
                id: "initiate-payment",
                description:
                    error instanceof Error
                        ? error.message
                        : "Une erreur est survenue.",
            });
        },
    });
};