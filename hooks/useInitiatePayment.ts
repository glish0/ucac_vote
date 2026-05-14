import { useMutation } from "@tanstack/react-query";

type InitiatePaymentPayload = {
    candidateId: string;
    fullName: string;
    phone: string;
    operator: "orange" | "mtn";
    voteCount: number;
};

type InitiatePaymentResponse = {
    success: boolean;
    message: string;
    externalId: string;
    reference: string;
    payment: {
        reference: string;
        status: string;
        message: string;
    };
};

const initiatePayment = async (
    payload: InitiatePaymentPayload
): Promise<InitiatePaymentResponse> => {
    const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
        console.error("Payment initiate API error:", data);

        throw new Error(
            data?.message ||
            data?.error ||
            "Erreur lors de l'initialisation du paiement."
        );
    }

    return data;
};

export function useInitiatePayment() {
    return useMutation({
        mutationFn: initiatePayment,
    });
}