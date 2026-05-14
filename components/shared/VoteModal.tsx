"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { VoteModalProps } from "@/types";
import { VOTE_PRICE } from "@/constants";
import { toast } from "sonner";
import { VoteFormInput, VoteFormValues, voteSchema } from "@/lib/schema";

import { pollPaymentStatus } from "@/lib/services/getStatus-service";
import { useInitiatePayment } from "@/hooks/useInitiatePayment";



export function VoteModal({ candidate, open, onOpenChange }: VoteModalProps) {
    const [loading, setLoading] = useState(false);
    const initiatePaymentMutation = useInitiatePayment();



    const form = useForm<VoteFormInput, unknown, VoteFormValues>({
        resolver: zodResolver(voteSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            operator: "orange",
            voteCount: 1,
        },
    });

    const voteCount = form.watch("voteCount");
    const operator = form.watch("operator");

    const totalAmount = useMemo(() => {
        return Number(voteCount || 1) * VOTE_PRICE;
    }, [voteCount]);

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat("fr-FR").format(amount);
    };

    const resetForm = () => {
        form.reset({
            fullName: "",
            phone: "",
            operator: "orange",
            voteCount: 1,
        });
        setLoading(false);
    };

    const incrementVote = () => {
        const current = Number(form.getValues("voteCount") || 1);
        form.setValue("voteCount", Math.min(current + 1, 1000), {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const decrementVote = () => {
        const current = Number(form.getValues("voteCount") || 1);
        form.setValue("voteCount", Math.max(current - 1, 1), {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const onSubmit = async (values: VoteFormValues) => {
        if (!candidate) {
            toast.error("Aucun candidat sélectionné.");
            return;
        }

        const amount = values.voteCount * VOTE_PRICE;

        setLoading(true);

        const loadingToast = toast.loading("Initialisation du paiement...", {
            description: `Préparation du paiement de ${formatAmount(amount)} FCFA.`,
        });

        try {
            const paymentResult = await initiatePaymentMutation.mutateAsync({
                candidateId: candidate.id,
                fullName: values.fullName,
                phone: values.phone,
                operator: values.operator,
                voteCount: values.voteCount,
            });

            toast.loading("Paiement en attente", {
                id: loadingToast,
                description: `Confirmez le paiement de ${formatAmount(
                    amount
                )} FCFA sur votre téléphone.`,
            });

            const statusResult = await pollPaymentStatus(paymentResult.reference);
            console.log("PAYMENT STATUS RESULT:", statusResult);
            if (statusResult.status === "SUCCESS") {
                toast.success("Paiement confirmé", {
                    id: loadingToast,
                    description: "Votre vote a bien été pris en compte.",
                });

                resetForm();
                onOpenChange(false);
                return;
            }

            if (statusResult.status === "FAILED") {
                toast.error("Paiement échoué", {
                    id: loadingToast,
                    description: "Le paiement a échoué ou a été annulé.",
                });

                return;
            }

            toast.info("Paiement toujours en attente", {
                id: loadingToast,
                description:
                    "Votre paiement est en cours de traitement. Vous pouvez vérifier plus tard.",
            });
        } catch (error) {
            console.error("Payment modal error:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                        ? error
                        : "Une erreur est survenue pendant l'initialisation du paiement.";

            toast.error("Erreur de paiement", {
                id: loadingToast,
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!candidate) return null;

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) resetForm();
                onOpenChange(value);
            }}
        >
            <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[2rem] border-white/10 bg-[#090909]/95 p-0 text-white shadow-2xl backdrop-blur-2xl sm:max-w-lg">
                <div className="relative overflow-hidden rounded-[2rem] p-5">
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#b8252c]/40 blur-3xl" />

                    <DialogHeader className="relative mb-5 text-left">
                        <DialogDescription className="text-white/50">
                            Vous votez pour
                        </DialogDescription>

                        <DialogTitle className="text-3xl font-black text-white">
                            {candidate.name}
                        </DialogTitle>

                        <p className="text-sm text-[#ffb4b8]">{candidate.title}</p>
                    </DialogHeader>

                    <div className="relative mb-5 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                        <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white/10">
                            <Image
                                src={candidate.image_url}
                                alt={candidate.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <p className="font-black">{candidate.name}</p>
                            <p className="text-sm text-white/50">{candidate.faculty}</p>
                            <p className="mt-1 text-sm font-bold text-white">
                                {VOTE_PRICE} FCFA / vote
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="relative space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-white/80">
                                Nom complet
                            </Label>

                            <Input
                                id="fullName"
                                placeholder="Ex : Jean Marc"
                                {...form.register("fullName")}
                                className="h-12 rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#ffb4b8]"
                            />

                            {form.formState.errors.fullName && (
                                <p className="text-sm text-red-300">
                                    {form.formState.errors.fullName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-white/80">
                                Numéro de téléphone Mobile Money
                            </Label>

                            <Input
                                id="phone"
                                placeholder="Ex : 6XXXXXXXX"
                                {...form.register("phone")}
                                className="h-12 rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#ffb4b8]"
                            />

                            {form.formState.errors.phone && (
                                <p className="text-sm text-red-300">
                                    {form.formState.errors.phone.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="voteCount" className="text-white/80">
                                Nombre de votes
                            </Label>

                            <div className="grid grid-cols-[48px_1fr_48px] gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={decrementVote}
                                    className="h-12 rounded-2xl border-white/10 bg-white/10 text-xl text-white hover:bg-white/20 hover:text-white"
                                >
                                    -
                                </Button>

                                <Input
                                    id="voteCount"
                                    type="number"
                                    min={1}
                                    max={1000}
                                    {...form.register("voteCount")}
                                    className="h-12 rounded-2xl border-white/10 bg-white/10 text-center text-lg font-black text-white placeholder:text-white/30 focus-visible:ring-[#ffb4b8]"
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={incrementVote}
                                    className="h-12 rounded-2xl border-white/10 bg-white/10 text-xl text-white hover:bg-white/20 hover:text-white"
                                >
                                    +
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {[5, 10, 20, 50].map((value) => (
                                    <Button
                                        key={value}
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            form.setValue("voteCount", value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            })
                                        }
                                        className="h-9 rounded-full border-white/10 bg-white/10 text-xs text-white hover:bg-white/20 hover:text-white"
                                    >
                                        {value} votes
                                    </Button>
                                ))}
                            </div>

                            {form.formState.errors.voteCount && (
                                <p className="text-sm text-red-300">
                                    {form.formState.errors.voteCount.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white/80">Opérateur de paiement</Label>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        form.setValue("operator", "orange", {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                    }
                                    className={`h-14 rounded-2xl font-black ${operator === "orange"
                                        ? "border-orange-400 bg-orange-500/20 text-orange-100 hover:bg-orange-500/25 hover:text-orange-100"
                                        : "border-white/10 bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
                                        }`}
                                >
                                    Orange Money
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        form.setValue("operator", "mtn", {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                    }
                                    className={`h-14 rounded-2xl font-black ${operator === "mtn"
                                        ? "border-yellow-300 bg-yellow-400/20 text-yellow-100 hover:bg-yellow-400/25 hover:text-yellow-100"
                                        : "border-white/10 bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
                                        }`}
                                >
                                    MTN MoMo
                                </Button>
                            </div>

                            {form.formState.errors.operator && (
                                <p className="text-sm text-red-300">
                                    {form.formState.errors.operator.message}
                                </p>
                            )}
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                            <div className="flex items-center justify-between text-sm text-white/60">
                                <span>Prix unitaire</span>
                                <span>{formatAmount(VOTE_PRICE)} FCFA</span>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-sm text-white/60">
                                <span>Nombre de votes</span>
                                <span>{Number(voteCount || 1)}</span>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm font-semibold text-white">
                                    Montant total
                                </span>

                                <span className="text-2xl font-black text-[#ffb4b8]">
                                    {formatAmount(totalAmount)} FCFA
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/55">
                            En cliquant sur “Confirmer et payer”, une demande de paiement de{" "}
                            <strong className="text-white">
                                {formatAmount(totalAmount)} FCFA
                            </strong>{" "}
                            sera envoyée sur votre téléphone. Vos{" "}
                            <strong className="text-white">{Number(voteCount || 1)}</strong>{" "}
                            vote(s) seront validés uniquement après confirmation du paiement.
                        </div>

                        <Button
                            type="submit"
                            disabled={initiatePaymentMutation.isPending}
                            className="h-14 w-full rounded-2xl bg-[#b8252c] text-sm font-black text-white shadow-[0_20px_50px_rgba(184,37,44,0.35)] hover:bg-[#d32d35]"
                        >
                            {initiatePaymentMutation.isPending
                                ? "Initialisation..."
                                : `Confirmer et payer ${formatAmount(totalAmount)} FCFA`}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}