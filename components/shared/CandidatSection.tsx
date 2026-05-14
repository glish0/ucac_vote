
import { Candidate, CandidateResponse } from "@/types";
import { VOTE_PRICE } from "@/constants";
import { CandidateCard } from "./CandidatCard";
import { useCandidates } from "@/hooks/useCreateCandidate";

type CandidateGridProps = {
    candidates: CandidateResponse[];
    onSelectCandidate: (candidate: CandidateResponse) => void;
};

export function CandidateGrid({
    candidates,
    onSelectCandidate,
}: CandidateGridProps) {

    return (
        <section id="candidats" className="page-container pb-20">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ffb4b8]">
                        Candidats officiels
                    </p>

                    <h2 className="mt-3 text-3xl font-black md:text-5xl">
                        Sélectionnez votre favori
                    </h2>

                    <p className="mt-4 max-w-2xl leading-7 text-white/60">
                        Cliquez sur la carte d’un candidat pour ouvrir le formulaire de
                        vote. Vous pouvez <span className="text-red-500">acheter un ou plusieurs votes </span>en une seule
                        transaction.
                    </p>
                </div>

                <div className="badge-glass">{VOTE_PRICE} FCFA / vote</div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {candidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onClick={() => onSelectCandidate(candidate)}
                    />
                ))}
            </div>
        </section>
    );
}