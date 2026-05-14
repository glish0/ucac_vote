// app/api/payments/initiate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { initFreemopayPayment } from "@/lib/freemopay";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { VOTE_PRICE } from "@/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
        const body = await request.json();


        console.log("Vote modal payload received:", body);

        const {
            candidateId,
            fullName,
            phone,
            operator,
            voteCount,
        } = body;

        if (!candidateId || typeof candidateId !== "string") {
            return NextResponse.json(
                { success: false, message: "Aucun candidat sélectionné." },
                { status: 400 }
            );
        }

        if (!fullName || typeof fullName !== "string") {
            return NextResponse.json(
                { success: false, message: "Le nom complet est requis." },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string") {
            return NextResponse.json(
                { success: false, message: "Le numéro de téléphone est requis." },
                { status: 400 }
            );
        }

        if (!operator || !["orange", "mtn"].includes(operator)) {
            return NextResponse.json(
                { success: false, message: "L'opérateur est invalide." },
                { status: 400 }
            );
        }

        if (!voteCount || typeof voteCount !== "number" || voteCount <= 0) {
            return NextResponse.json(
                { success: false, message: "Le nombre de votes est invalide." },
                { status: 400 }
            );
        }

        const amount = voteCount * VOTE_PRICE;

        const supabase = getSupabaseAdmin();

        const externalId = `vote_${randomUUID()}`;

        function normalizeCameroonPhone(phone: string) {
            return phone.replace(/\s/g, "").replace("+", "");
        }

        const normalizedPhone = normalizeCameroonPhone(phone);

        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook/freemopay`;

        const freemopayResponse = await initFreemopayPayment({
            payer: normalizedPhone,
            amount,
            externalId,
            description: `Paiement de ${voteCount} vote(s) pour ${fullName}`,
            callback: callbackUrl,
        });

        const paymentRecord = {
            external_id: externalId,
            freemopay_reference: freemopayResponse?.reference ?? null,

            payer: normalizedPhone,
            amount,
            description: `Paiement de ${voteCount} vote(s) pour ${fullName}`,

            status: "PENDING",

            candidate_id: candidateId,
            voter_name: fullName,
            voter_phone: normalizedPhone,
            operator,
            vote_count: voteCount,

            raw_init_response: freemopayResponse,
        };

        const { error: insertError } = await supabase
            .from("payments")
            .insert(paymentRecord);

        if (insertError) {
            console.error("Supabase insert payment error:", insertError);

            return NextResponse.json(
                {
                    success: false,
                    message: "Paiement initialisé, mais erreur lors de l'enregistrement local.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Paiement initialisé avec succès.",
            externalId,
            reference: freemopayResponse?.reference ?? null,
            payment: freemopayResponse,
        });
    } catch (error) {
        console.error("Payment initiate error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de l'initialisation du paiement.",
            },
            { status: 500 }
        );
    }
}