import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Candidate, CandidateResponse } from "@/types";

type CandidateCardProps = {
    candidate: CandidateResponse;
    onClick: () => void;
};

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
    return (
        <Button
            type="button"
            onClick={onClick}
            className="candidate-card group text-left"
        >
            <div className="candidate-overlay z-10" />

            <div className="relative h-[420px] overflow-hidden bg-white/5">
                <Image
                    src={candidate.image_url}
                    alt={candidate.name}
                    fill
                    className="object-cover opacity-90 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
                />
            </div>

            <div className="absolute left-0 right-0 top-0 z-20 flex justify-between p-4">
                <Badge className="rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-xl hover:bg-black/40">
                    {candidate.category}
                </Badge>

                <Badge className="rounded-full bg-[#b8252c] text-white hover:bg-[#b8252c]">
                    Voter
                </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb4b8]">
                    {candidate.title}
                </p>

                <h3 className="mt-2 text-2xl font-black text-white">
                    {candidate.name}
                </h3>

                <p className="mt-1 text-sm text-white/55">{candidate.faculty}</p>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/65">
                    {candidate.description}
                </p>

                <Button className="mt-5 w-full rounded-2xl bg-white font-black text-black hover:bg-[#b8252c] hover:text-white">
                    Choisir cette candidate
                </Button>
            </div>
        </Button>
    );
}