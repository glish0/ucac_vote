// lib/freemopay.ts

type InitFreemopayPaymentPayload = {
    payer: string;
    amount: number;
    externalId: string;
    description: string;
    callback: string;
};

export async function initFreemopayPayment(payload: InitFreemopayPaymentPayload) {
    const baseUrl = process.env.FREEMOPAY_BASE_URL;
    const appKey = process.env.FREEMOPAY_APP_KEY;
    const secretKey = process.env.FREEMOPAY_SECRET_KEY;

    if (!baseUrl || !appKey || !secretKey) {
        throw new Error("Missing Freemopay environment variables");
    }

    if (!payload.externalId || typeof payload.externalId !== "string") {
        console.error("Invalid externalId before Freemopay call:", payload.externalId);

        throw new Error("Local error: externalId must be a string");
    }

    const freemopayBody = {
        payer: String(payload.payer),
        amount: Number(payload.amount),
        externalId: String(payload.externalId),
        description: String(payload.description),
        callback: String(payload.callback),
    };

    console.log("Freemopay body sent:", freemopayBody);

    const basicAuth = Buffer.from(`${appKey}:${secretKey}`).toString("base64");

    const response = await fetch(`${baseUrl}/api/v2/payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify(freemopayBody),
        cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        console.error("Freemopay init payment error:", data);

        throw new Error(
            data?.message || "Failed to initialize Freemopay payment"
        );
    }

    return data;
}