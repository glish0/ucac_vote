import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FreemopayWebhookPayload = {
    status: "SUCCESS" | "FAILED";
    reference: string;
    amount: number;
    transactionType?: string;
    externalId: string;
    message?: string;
};

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Missing Supabase admin environment variables");
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const payload = (await request.json()) as FreemopayWebhookPayload;

        console.log("Freemopay webhook received:", payload);

        const {
            status,
            reference,
            amount,
            transactionType,
            externalId,
            message,
        } = payload;

        if (!status || !["SUCCESS", "FAILED"].includes(status)) {
            return NextResponse.json(
                { success: false, message: "Invalid payment status." },
                { status: 400 }
            );
        }

        if (!reference || !externalId) {
            return NextResponse.json(
                { success: false, message: "Missing payment reference or externalId." },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .select("*")
            .or(`external_id.eq.${externalId},freemopay_reference.eq.${reference}`)
            .single();

        if (paymentError || !payment) {
            console.error("Payment not found:", paymentError);

            return NextResponse.json(
                { success: false, message: "Payment not found." },
                { status: 404 }
            );
        }

        /**
         * Sécurité importante :
         * Si le paiement est déjà SUCCESS, on ne doit pas ajouter les votes une deuxième fois.
         * Le webhook peut parfois être envoyé plusieurs fois.
         */
        if (payment.status === "SUCCESS") {
            return NextResponse.json({
                success: true,
                message: "Payment already processed.",
            });
        }

        /**
         * Vérification du montant.
         * Le montant reçu doit correspondre au montant attendu.
         */
        if (Number(payment.amount) !== Number(amount)) {
            console.error("Payment amount mismatch:", {
                expected: payment.amount,
                received: amount,
            });

            await supabase
                .from("payments")
                .update({
                    status: "FAILED",
                    message: "Montant reçu différent du montant attendu.",
                    raw_webhook_response: payload,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", payment.id);

            return NextResponse.json(
                { success: false, message: "Payment amount mismatch." },
                { status: 400 }
            );
        }

        /**
         * Cas paiement échoué.
         */
        if (status === "FAILED") {
            const { error: updateFailedError } = await supabase
                .from("payments")
                .update({
                    status: "FAILED",
                    transaction_type: transactionType ?? null,
                    message: message ?? "Paiement échoué.",
                    raw_webhook_response: payload,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", payment.id);

            if (updateFailedError) {
                console.error("Failed to update payment as FAILED:", updateFailedError);

                return NextResponse.json(
                    { success: false, message: "Could not update failed payment." },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Payment marked as FAILED.",
            });
        }

        /**
         * Cas paiement réussi.
         */
        if (status === "SUCCESS") {
            const { error: updateSuccessError } = await supabase
                .from("payments")
                .update({
                    status: "SUCCESS",
                    transaction_type: transactionType ?? null,
                    message: message ?? "Paiement réussi.",
                    raw_webhook_response: payload,
                    paid_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", payment.id);

            if (updateSuccessError) {
                console.error("Failed to update payment as SUCCESS:", updateSuccessError);

                return NextResponse.json(
                    { success: false, message: "Could not update successful payment." },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Payment SUCCESS processed.",
            });
        }

        return NextResponse.json(
            { success: false, message: "Unhandled webhook status." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Freemopay webhook error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Webhook processing error.",
            },
            { status: 500 }
        );
    }
}