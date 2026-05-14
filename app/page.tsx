"use client";

import { useState } from "react";

import { CandidateGrid } from "@/components/shared/CandidatSection";
import { HowToVote } from "@/components/shared/CommentVoter";
import { VoteFooter } from "@/components/shared/Footer";
import { VoteHeader } from "@/components/shared/Header";
import { VoteHero } from "@/components/shared/HeroSection";
import { ImportantInfo } from "@/components/shared/InformationVote";
import { VoteModal } from "@/components/shared/VoteModal";


import { CandidateResponse } from "@/types";
import { AppLoader } from "@/components/shared/AppLoader";
import { Button } from "@/components/ui/button";
import { useCandidates } from "@/hooks/useCreateCandidate";

export default function HomePage() {
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateResponse | null>(null);

  const {
    data: candidates = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCandidates();

  if (isLoading) {
    return (
      <AppLoader
        title="Chargement des candidats"
        description="Nous préparons la liste des candidats Miss & Master UCAC."
      />
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center ucac-page-bg px-6 text-white">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 text-center backdrop-blur-2xl">
          <h1 className="text-2xl font-black">
            Impossible de charger les candidats
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/60">
            {error instanceof Error
              ? error.message
              : "Une erreur est survenue pendant le chargement."}
          </p>

          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-6 rounded-full bg-[#b8252c] font-bold hover:bg-[#d32d35]"
          >
            {isFetching ? "Chargement..." : "Réessayer"}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden ucac-page-bg text-white">
      <VoteHeader />

      <VoteHero candidates={candidates} />

      <HowToVote />

      <CandidateGrid
        candidates={candidates}
        onSelectCandidate={setSelectedCandidate}
      />

      <ImportantInfo />

      <VoteFooter />

      <VoteModal
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onOpenChange={(open) => {
          if (!open) setSelectedCandidate(null);
        }}
      />
    </main>
  );
}