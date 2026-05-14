// app/api/payment/status/[reference]/route.ts

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getFreemopayPaymentStatus(reference: string) {
    const baseUrl = process.env.FREEMOPAY_BASE_URL;
    const appKey = process.env.FREEMOPAY_APP_KEY;
    const secretKey = process.env.FREEMOPAY_SECRET_KEY;

    if (!baseUrl || !appKey || !secretKey) {
        throw new Error("Missing Freemopay environment variables");
    }

    const basicAuth = Buffer.from(`${appKey}:${secretKey}`).toString("base64");

    const response = await fetch(`${baseUrl}/api/v2/payment/${reference}`, {
        method: "GET",
        headers: {
            Authorization: `Basic ${basicAuth}`,
        },
        cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        console.error("Freemopay status error:", data);

        throw new Error(data?.message || "Erreur lors de la vérification du paiement.");
    }

    return data;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ reference: string }> }
) {
    try {
        const { reference } = await params;

        if (!reference) {
            return NextResponse.json(
                { success: false, message: "Référence de paiement manquante." },
                { status: 400 }
            );
        }

        const payment = await getFreemopayPaymentStatus(reference);

        return NextResponse.json({
            success: true,
            payment,
        });
    } catch (error) {
        console.error("Payment status error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la vérification du statut du paiement.",
            },
            { status: 500 }
        );
    }
}