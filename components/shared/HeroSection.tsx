
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VOTE_PRICE } from "@/constants";
import { CandidateResponse } from "@/types";

type VoteHeroProps = {
    candidates: CandidateResponse[];
};

export function VoteHero({ candidates }: VoteHeroProps) {
    const missCount = candidates.filter((candidate) => candidate.category === "Miss").length;
    const masterCount = candidates.filter((candidate) => candidate.category === "Master").length;

    return (
        <section className="page-container grid items-center gap-10 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pb-14 lg:pt-14">
            <div>
                <div className="badge-glass mb-6">
                    Concours officiel Miss & Master UCAC
                </div>

                <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-4xl lg:text-4xl">
                    Votez pour l’élégance, le charisme et le leadership étudiant.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-5 text-white/65 md:text-base">
                    Participez au choix du public pour le concours Miss/Master UCAC.
                    Sélectionnez votre candidat préféré, choisissez le nombre de votes,
                    puis confirmez le paiement via Orange Money ou MTN Mobile Money.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Card className="glass-soft rounded-xl border-white/10 text-white">
                        <CardContent className="p-3">
                            <p className="text-xs text-white/50">Prix d’un vote</p>
                            <p className="text-xl font-black">{VOTE_PRICE} FCFA</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-soft rounded-xl border-white/10 text-white">
                        <CardContent className="p-3">
                            <p className="text-xs text-white/50">Candidats</p>
                            <p className="text-xl font-black">{candidates.length}</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-soft rounded-xl border-white/10 text-white">
                        <CardContent className="p-3">
                            <p className="text-xs text-white/50">Paiement</p>
                            <p className="text-xl font-black">OM / MTN</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button

                        className="h-12 rounded-full bg-[#b8252c] px-6 font-bold hover:bg-[#d32d35]"
                    >
                        <a href="#candidats">Découvrir les candidats</a>
                    </Button>

                    <Button

                        variant="outline"
                        className="h-12 rounded-full border-white/15 bg-white/10 px-6 font-bold text-white hover:bg-white/20 hover:text-white"
                    >
                        <a href="#comment-ca-marche">Comment voter ?</a>
                    </Button>
                </div>
            </div>

            <Card className="glass rounded-[1rem] border-white/10 text-white">
                <CardContent className="p-5">
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                        <p className="text-sm text-white/50">Événement</p>
                        <h2 className="mt-1 text-2xl font-black">Miss & Master UCAC</h2>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                <p className="text-3xl font-black">{missCount}</p>
                                <p className="text-sm text-white/50">Candidates Miss</p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                <p className="text-3xl font-black">{masterCount}</p>
                                <p className="text-sm text-white/50">Candidats Master</p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4">
                            <p className="text-sm font-semibold">Votes multiples autorisés</p>
                            <p className="mt-2 text-sm leading-6 text-white/55">
                                Vous pouvez soutenir un candidat avec plusieurs votes en une
                                seule transaction. Le montant est calculé automatiquement.
                            </p>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-orange-500/15 p-4 text-orange-200">
                                <p className="text-sm font-bold">Orange Money</p>
                                <p className="mt-1 text-xs text-orange-100/60">
                                    Paiement rapide
                                </p>
                            </div>

                            <div className="rounded-2xl bg-yellow-400/15 p-4 text-yellow-100">
                                <p className="text-sm font-bold">MTN MoMo</p>
                                <p className="mt-1 text-xs text-yellow-100/60">
                                    Paiement sécurisé
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}