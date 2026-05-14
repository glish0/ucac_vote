export type InitiatePaymentPayload = {
    candidateId: string;
    fullName: string;
    phone: string;
    operator: "orange" | "mtn";
    voteCount: number;
};

export type InitiatePaymentResponse = {
    transactionId: string;
    reference: string;
    totalAmount: number;
    voteCount: number;
    status: string;
};

export const initiatePayment = async (
    payload: InitiatePaymentPayload
): Promise<InitiatePaymentResponse> => {
    const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Impossible d'initialiser le paiement.");
    }

    return result.data;
};