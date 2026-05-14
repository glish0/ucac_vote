"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    BarChart3,
    Crown,
    RefreshCw,
    Trophy,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useCandidateResults } from "@/hooks/useCandidateResult";

const formatNumber = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value);
};

const ResultsPage = () => {
    const {
        data: results = [],
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useCandidateResults();

    const totalVotes = results.reduce(
        (sum, candidate) => sum + Number(candidate.total_votes || 0),
        0
    );

    const missResults = results.filter(
        (candidate) => candidate.category === "Miss"
    );

    const masterResults = results.filter(
        (candidate) => candidate.category === "Master"
    );

    const leader = results[0];

    return (
        <main className="min-h-screen ucac-page-bg text-white">
            <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
                <div className="page-container flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <Button

                            variant="outline"
                            className="rounded-full border-white/10 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                        >
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour
                            </Link>
                        </Button>

                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold">UCAC Awards</p>
                            <p className="text-xs text-white/50">
                                Résultats Miss & Master
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded-full bg-[#b8252c] font-bold hover:bg-[#d32d35]"
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""
                                }`}
                        />
                        Actualiser
                    </Button>
                </div>
            </header>

            <section className="page-container py-10">
                <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div>
                        <Badge className="mb-4 bg-white/10 text-white hover:bg-white/10">
                            Résultats en direct
                        </Badge>

                        <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-4xl">
                            Classement du concours Miss & Master UCAC
                        </h1>

                        <p className="mt-5 max-w-2xl leading-7 text-white/60">
                            Les votes affichés ici sont uniquement les votes confirmés après
                            validation du paiement Mobile Money.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-2xl">
                        <p className="text-sm text-white/50">Dernière mise à jour</p>
                        <p className="mt-1 text-lg font-black">Automatique / 10 sec</p>
                    </div>
                </div>

                {isLoading && (
                    <div className="grid gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <Card
                                key={item}
                                className="glass rounded-[2rem] border-white/10 text-white"
                            >
                                <CardContent className="p-6">
                                    <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
                                    <div className="mt-6 h-12 w-28 animate-pulse rounded-xl bg-white/10" />
                                    <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/10" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {isError && (
                    <Card className="glass rounded-[2rem] border-red-400/20 text-white">
                        <CardContent className="p-6">
                            <p className="text-lg font-black text-red-300">
                                Impossible de charger les résultats.
                            </p>

                            <p className="mt-2 text-sm text-white/55">
                                {error instanceof Error
                                    ? error.message
                                    : "Une erreur est survenue."}
                            </p>

                            <Button
                                onClick={() => refetch()}
                                className="mt-5 rounded-full bg-[#b8252c] hover:bg-[#d32d35]"
                            >
                                Réessayer
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {!isLoading && !isError && (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <Card className="glass rounded-[2rem] border-white/10 text-white">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-2xl bg-[#b8252c]/20 p-4 text-[#ffb4b8]">
                                        <Users className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-white/50">Total votes</p>
                                        <p className="text-3xl font-black">
                                            {formatNumber(totalVotes)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass rounded-[2rem] border-white/10 text-white">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-2xl bg-pink-500/15 p-4 text-pink-200">
                                        <Crown className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-white/50">Candidates Miss</p>
                                        <p className="text-3xl font-black">
                                            {missResults.length}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass rounded-[2rem] border-white/10 text-white">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-2xl bg-blue-500/15 p-4 text-blue-200">
                                        <Trophy className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-white/50">Candidats Master</p>
                                        <p className="text-3xl font-black">
                                            {masterResults.length}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass rounded-[2rem] border-white/10 text-white">
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div className="rounded-2xl bg-emerald-500/15 p-4 text-emerald-200">
                                        <BarChart3 className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-white/50">En tête</p>
                                        <p className="line-clamp-1 text-2xl font-black">
                                            {leader ? leader.name : "Aucun"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {results.length === 0 ? (
                            <Card className="glass mt-8 rounded-[2rem] border-white/10 text-white">
                                <CardContent className="p-8 text-center">
                                    <p className="text-2xl font-black">
                                        Aucun vote pour le moment
                                    </p>

                                    <p className="mt-3 text-white/55">
                                        Les résultats apparaîtront dès que les premiers paiements
                                        seront confirmés.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                                <Card className="glass rounded-[2rem] border-white/10 text-white">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-2xl">
                                            <Trophy className="h-6 w-6 text-[#ffb4b8]" />
                                            Classement général
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {results.map((candidate, index) => {
                                            const candidateVotes = Number(
                                                candidate.total_votes || 0
                                            );

                                            const percentage =
                                                totalVotes > 0
                                                    ? Math.round((candidateVotes / totalVotes) * 100)
                                                    : 0;

                                            const isFirst = index === 0;

                                            return (
                                                <div
                                                    key={candidate.id}
                                                    className={`rounded-3xl border p-4 ${isFirst
                                                        ? "border-[#ffb4b8]/40 bg-[#b8252c]/20"
                                                        : "border-white/10 bg-black/30"
                                                        }`}
                                                >
                                                    <div className="mb-4 flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-black ${isFirst
                                                                    ? "bg-[#b8252c] text-white"
                                                                    : "bg-white text-black"
                                                                    }`}
                                                            >
                                                                {index + 1}
                                                            </div>

                                                            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/10">
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
                                                                    {candidate.category} · {candidate.faculty}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-2xl font-black">
                                                                {formatNumber(candidateVotes)}
                                                            </p>
                                                            <p className="text-xs text-white/45">votes</p>
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
                                                        <span>{candidate.category}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    {leader && (
                                        <Card className="glass rounded-[2rem] border-[#ffb4b8]/30 text-white">
                                            <CardContent className="p-5">
                                                <div className="relative h-[420px] overflow-hidden rounded-[1.5rem] bg-white/10">
                                                    {leader.image_url ? (
                                                        <Image
                                                            src={leader.image_url}
                                                            alt={leader.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-white/40">
                                                            Aucune image
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

                                                    <div className="absolute left-4 top-4">
                                                        <Badge className="bg-[#b8252c] text-white hover:bg-[#b8252c]">
                                                            En tête
                                                        </Badge>
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ffb4b8]">
                                                            Leader actuel
                                                        </p>

                                                        <h2 className="mt-2 text-3xl font-black">
                                                            {leader.name}
                                                        </h2>

                                                        <p className="mt-1 text-sm text-white/55">
                                                            {leader.category} · {leader.faculty}
                                                        </p>

                                                        <p className="mt-4 text-4xl font-black">
                                                            {formatNumber(Number(leader.total_votes || 0))}{" "}
                                                            votes
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Card className="glass rounded-[2rem] border-white/10 text-white">
                                        <CardHeader>
                                            <CardTitle>Note importante</CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <p className="leading-7 text-white/60">
                                                Les résultats sont calculés sur la base des paiements
                                                confirmés. Une transaction en attente ou échouée ne
                                                compte pas dans le total des votes.
                                            </p>

                                            <Button

                                                className="mt-6 w-full rounded-2xl bg-[#b8252c] font-bold hover:bg-[#d32d35]"
                                            >
                                                <Link href="/">Voter maintenant</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}

export default ResultsPage