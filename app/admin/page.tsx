"use client";

import Image from "next/image";
import {
    Banknote,
    CheckCircle2,
    Clock,
    Download,
    Search,
    Trophy,
    Users,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AddCandidateModal } from "@/components/form/AddCandidate";
import { useCandidates, useCandidateVoteTotals, useCreateCandidate, usePayments, usePaymentStats } from "@/hooks/useCreateCandidate";
import { candidate, transactions } from "@/constants";
import { formatAmount, getOperatorBadge, getStatusBadge } from "@/lib/utils";






export default function AdminPage() {
    const { mutate: createCandidateMutation } = useCreateCandidate();

    const { data: candidates = [], isLoading: candidatesLoading } =
        useCandidates();

    const { data: voteTotals = [], isLoading: voteTotalsLoading } =
        useCandidateVoteTotals();

    const { data: stats, isLoading: statsLoading } = usePaymentStats();

    const { data: payments, isLoading: paymentsLoading } = usePayments({
        page: 1,
        limit: 20,
    });
    const paymentStats = stats ?? {
        total_payments: 0,
        success_payments: 0,
        pending_payments: 0,
        failed_payments: 0,
        total_amount: 0,
        total_votes: 0,
    };

    const paymentRows = payments?.data ?? [];




    const candidatesWithVotes = candidates.map((candidate) => {
        const total = voteTotals.find(
            (item) => item.candidate_id === candidate.id
        );

        return {
            ...candidate,
            total_votes: total?.total_votes ?? 0,
            total_amount: total?.total_amount ?? 0,
            payment_count: total?.payment_count ?? 0,
        };
    });

    const sortedCandidates = [...candidatesWithVotes].sort(
        (a, b) => b.total_votes - a.total_votes
    );


    const isLoading =
        candidatesLoading || voteTotalsLoading || statsLoading || paymentsLoading;

    return (
        <main className="min-h-screen ucac-page-bg text-white">
            <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
                <div className="page-container flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 items-center rounded-2xl border border-white/10 bg-white/10 px-3">
                            <Image
                                src="/logo-ucac.png"
                                alt="Logo UCAC"
                                width={160}
                                height={45}
                                className="h-9 w-auto object-contain"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Administration</p>
                            <p className="text-xs text-white/50">
                                Miss & Master UCAC — Tableau de bord
                            </p>
                        </div>
                    </div>

                    <Button className="rounded-full bg-[#b8252c] font-bold hover:bg-[#d32d35]">
                        <Download className="mr-2 h-4 w-4" />
                        Exporter
                    </Button>
                </div>
            </header>

            <section className="page-container py-8">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <Badge className="mb-4 bg-white/10 text-white hover:bg-white/10">
                            Événement en cours
                        </Badge>

                        <h1 className="text-xl font-black md:text-3xl">
                            Tableau de bord administrateur
                        </h1>

                        <p className="mt-3 max-w-2xl text-white/60">
                            Suivez les votes, les paiements Mobile Money et le classement des
                            candidats en temps réel.
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white/70">
                        Chargement du tableau de bord...
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-4">
                            <Card className="glass rounded-[2rem] border-white/10 text-white">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-2xl bg-[#b8252c]/20 p-4 text-[#ffb4b8]">
                                        <Trophy className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-white/50">Total votes</p>
                                        <p className="text-xl font-black">
                                            {formatAmount(paymentStats.total_votes)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass rounded-[2rem] border-white/10 text-white">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-2xl bg-emerald-500/15 p-4 text-emerald-300">
                                        <Banknote className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-white/50">Montant collecté</p>
                                        <p className="text-xl font-black">
                                            {formatAmount(paymentStats.total_amount)} FCFA
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass rounded-[2rem] border-white/10 text-white">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-2xl bg-blue-500/15 p-4 text-blue-300">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-white/50">Paiements réussis</p>
                                        <p className="text-xl font-black">
                                            {paymentStats.success_payments}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass rounded-[2rem] border-white/10 text-white">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-2xl bg-yellow-500/15 p-4 text-yellow-300">
                                        <Clock className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-white/50">En attente</p>
                                        <p className="text-3xl font-black">
                                            {paymentStats.pending_payments}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Tabs defaultValue="overview" className="mt-8">
                            <TabsList className="rounded-full border border-white/10 bg-white/10 p-1">
                                <TabsTrigger
                                    value="overview"
                                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black"
                                >
                                    Vue d’ensemble
                                </TabsTrigger>

                                <TabsTrigger
                                    value="transactions"
                                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black"
                                >
                                    Transactions
                                </TabsTrigger>

                                <TabsTrigger
                                    value="candidates"
                                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black"
                                >
                                    Candidats
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6">
                                <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                                    <Card className="glass rounded-[2rem] border-white/10 text-white">
                                        <CardHeader>
                                            <CardTitle>Classement des candidats</CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {sortedCandidates.length === 0 ? (
                                                <p className="text-sm text-white/50">
                                                    Aucun candidat enregistré pour le moment.
                                                </p>
                                            ) : (
                                                sortedCandidates.map((candidate, index) => {
                                                    const percentage =
                                                        paymentStats.total_votes > 0
                                                            ? Math.round(
                                                                (candidate.total_votes /
                                                                    paymentStats.total_votes) *
                                                                100
                                                            )
                                                            : 0;

                                                    return (
                                                        <div
                                                            key={candidate.id}
                                                            className="rounded-xl border border-white/10 bg-black/30 p-4"
                                                        >
                                                            <div className="mb-3 flex items-center justify-between gap-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-black">
                                                                        {index + 1}
                                                                    </div>

                                                                    <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white/10">
                                                                        {candidate.image_url ? (
                                                                            <Image
                                                                                src={candidate.image_url}
                                                                                alt={candidate.name}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                                                                                N/A
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <p className="font-black">
                                                                            {candidate.name}
                                                                        </p>
                                                                        <p className="text-sm text-white/50">
                                                                            {candidate.category}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right">
                                                                    <p className="text-xl font-black">
                                                                        {formatAmount(candidate.total_votes)}
                                                                    </p>
                                                                    <p className="text-xs text-white/45">
                                                                        votes
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                                                <div
                                                                    className="h-full rounded-full bg-[#b8252c]"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>

                                                            <div className="mt-2 flex justify-between text-xs text-white/45">
                                                                <span>{percentage}% des votes</span>
                                                                <span>
                                                                    {formatAmount(candidate.total_amount)} FCFA
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="glass rounded-[2rem] border-white/10 text-white">
                                        <CardHeader>
                                            <CardTitle>Santé des paiements</CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="rounded-3xl border border-white/10 bg-emerald-500/10 p-5">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-white/50">Réussis</p>
                                                        <p className="text-3xl font-black">
                                                            {paymentStats.success_payments}
                                                        </p>
                                                    </div>
                                                    <CheckCircle2 className="h-8 w-8 text-emerald-300" />
                                                </div>
                                            </div>

                                            <div className="rounded-3xl border border-white/10 bg-yellow-500/10 p-5">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-white/50">En attente</p>
                                                        <p className="text-3xl font-black">
                                                            {paymentStats.pending_payments}
                                                        </p>
                                                    </div>
                                                    <Clock className="h-8 w-8 text-yellow-300" />
                                                </div>
                                            </div>

                                            <div className="rounded-3xl border border-white/10 bg-red-500/10 p-5">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-white/50">Échoués</p>
                                                        <p className="text-3xl font-black">
                                                            {paymentStats.failed_payments}
                                                        </p>
                                                    </div>
                                                    <XCircle className="h-8 w-8 text-red-300" />
                                                </div>
                                            </div>

                                            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                                                <p className="text-sm font-semibold">
                                                    Règle importante
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-white/55">
                                                    Les votes sont comptabilisés uniquement lorsque le
                                                    paiement passe au statut réussi.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="transactions" className="mt-6">
                                <Card className="glass rounded-[2rem] border-white/10 text-white">
                                    <CardHeader>
                                        <CardTitle>Dernières transactions</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="overflow-hidden rounded-3xl border border-white/10">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-white/10 hover:bg-transparent">
                                                        <TableHead className="text-white/60">
                                                            Référence
                                                        </TableHead>
                                                        <TableHead className="text-white/60">
                                                            Votant
                                                        </TableHead>
                                                        <TableHead className="text-white/60">
                                                            Candidat
                                                        </TableHead>
                                                        <TableHead className="text-white/60">
                                                            Opérateur
                                                        </TableHead>
                                                        <TableHead className="text-white/60">
                                                            Votes
                                                        </TableHead>
                                                        <TableHead className="text-white/60">
                                                            Montant
                                                        </TableHead>
                                                        <TableHead className="text-white/60">
                                                            Statut
                                                        </TableHead>
                                                        <TableHead className="text-white/60">
                                                            Date
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {paymentRows.length === 0 ? (
                                                        <TableRow className="border-white/10">
                                                            <TableCell
                                                                colSpan={8}
                                                                className="py-8 text-center text-white/50"
                                                            >
                                                                Aucune transaction trouvée.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        paymentRows.map((payment) => {
                                                            const candidate = candidates.find(
                                                                (item) => item.id === payment.candidate_id
                                                            );

                                                            return (
                                                                <TableRow
                                                                    key={payment.id}
                                                                    className="border-white/10 hover:bg-white/5"
                                                                >
                                                                    <TableCell className="max-w-[180px] truncate font-medium text-white">
                                                                        {payment.freemopay_reference ??
                                                                            payment.external_id}
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <div>
                                                                            <p className="font-semibold text-white">
                                                                                {payment.voter_name ?? "—"}
                                                                            </p>
                                                                            <p className="text-xs text-white/45">
                                                                                {payment.voter_phone ?? payment.payer}
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell className="text-white/75">
                                                                        {candidate?.name ??
                                                                            payment.candidate_id ??
                                                                            "—"}
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {payment.operator
                                                                            ? getOperatorBadge(payment.operator)
                                                                            : "—"}
                                                                    </TableCell>

                                                                    <TableCell className="font-bold text-white">
                                                                        {payment.vote_count ?? 0}
                                                                    </TableCell>

                                                                    <TableCell className="font-bold text-white">
                                                                        {formatAmount(Number(payment.amount ?? 0))}{" "}
                                                                        FCFA
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        {getStatusBadge(payment.status)}
                                                                    </TableCell>

                                                                    <TableCell className="text-white/50">
                                                                        {payment.created_at
                                                                            ? new Date(
                                                                                payment.created_at
                                                                            ).toLocaleString("fr-FR")
                                                                            : "—"}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="candidates" className="mt-6">
                                <Card className="glass rounded-[2rem] border-white/10 text-white">
                                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <CardTitle>Gestion rapide des candidats</CardTitle>

                                        <AddCandidateModal
                                            trigger={
                                                <Button className="rounded-full bg-[#b8252c] font-bold hover:bg-[#d32d35]">
                                                    Ajouter un candidat
                                                </Button>
                                            }
                                        />
                                    </CardHeader>

                                    <CardContent>
                                        {sortedCandidates.length === 0 ? (
                                            <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-center text-white/50">
                                                Aucun candidat enregistré pour le moment.
                                            </div>
                                        ) : (
                                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                                {sortedCandidates.map((candidate, index) => (
                                                    <Card
                                                        key={candidate.id}
                                                        className="overflow-hidden rounded-[1.5rem] border-white/10 bg-black/30 text-white"
                                                    >
                                                        <div className="relative h-60 bg-white/10">
                                                            {candidate.image_url ? (
                                                                <Image
                                                                    src={candidate.image_url}
                                                                    alt={candidate.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-white/40">
                                                                    Aucune image
                                                                </div>
                                                            )}

                                                            <div className="absolute left-3 top-3">
                                                                <Badge className="bg-black/50 text-white hover:bg-black/50">
                                                                    Rang #{index + 1}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <CardContent className="p-4">
                                                            <div className="mb-3 flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-black">
                                                                        {candidate.name}
                                                                    </p>
                                                                    <p className="text-sm text-white/50">
                                                                        {candidate.category}
                                                                    </p>
                                                                </div>

                                                                <Users className="h-5 w-5 text-white/40" />
                                                            </div>

                                                            <div className="rounded-2xl bg-white/10 p-3">
                                                                <p className="text-xs text-white/50">
                                                                    Total votes
                                                                </p>
                                                                <p className="text-2xl font-black">
                                                                    {formatAmount(candidate.total_votes)}
                                                                </p>
                                                            </div>

                                                            <div className="mt-3 rounded-2xl bg-white/10 p-3">
                                                                <p className="text-xs text-white/50">
                                                                    Montant collecté
                                                                </p>
                                                                <p className="text-lg font-black">
                                                                    {formatAmount(candidate.total_amount)} FCFA
                                                                </p>
                                                            </div>

                                                            <Button
                                                                variant="outline"
                                                                className="mt-4 w-full rounded-2xl border-white/10 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                                                            >
                                                                Voir détails
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </section>
        </main>
    );
}

