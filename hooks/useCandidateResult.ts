"use client";


import { getCandidateResults } from "@/lib/services/result-service";
import { useQuery } from "@tanstack/react-query";


export function useCandidateResults() {
    return useQuery({
        queryKey: ["candidate-results"],
        queryFn: getCandidateResults,
        refetchInterval: 10_000,
    });
}