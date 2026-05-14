type PaymentStatusResponse = {
    success: boolean;
    payment: {
        reference: string;
        status: "CREATED" | "PENDING" | "SUCCESS" | "FAILED";
        message?: string;
    };
};

export async function getPaymentStatus(reference: string): Promise<PaymentStatusResponse> {
    const response = await fetch(`/api/payment/status/${reference}`, {
        method: "GET",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Impossible de vérifier le statut du paiement.");
    }

    return data;
}

export async function pollPaymentStatus(reference: string) {
    const maxAttempts = 10;
    const delay = 3000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, delay));

        const result = await getPaymentStatus(reference);

        const status = result.payment.status;

        if (status === "SUCCESS") {
            return {
                success: true,
                status,
                payment: result.payment,
            };
        }

        if (status === "FAILED") {
            return {
                success: false,
                status,
                payment: result.payment,
            };
        }
    }

    return {
        success: false,
        status: "PENDING",
        payment: null,
    };
}