"use client";

import { getCandidateResults } from "@/lib/services/result-service";
import { useQuery } from "@tanstack/react-query";


export const useCandidateResults = () => {
    return useQuery({
        queryKey: ["candidate-results"],
        queryFn: getCandidateResults,
        refetchInterval: 10_000,
        staleTime: 5_000,
        refetchOnWindowFocus: true,
    });
};