import {
    CandidateResponse,
    CreateCandidatePayload,
} from "@/types";
import { createClient } from "../config/client";




const supabase = createClient();

const CANDIDATE_BUCKET = "candidate";

const generateImagePath = (file: File) => {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    return `photos/${fileName}`;
};

export const uploadCandidateImage = async (file: File): Promise<string> => {
    const filePath = generateImagePath(file);

    const { error: uploadError } = await supabase.storage
        .from(CANDIDATE_BUCKET)
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
        .from(CANDIDATE_BUCKET)
        .getPublicUrl(filePath);

    if (!data.publicUrl) {
        throw new Error("Impossible de récupérer l’URL publique de l’image.");
    }

    return data.publicUrl;
};

export const createCandidate = async (
    payload: CreateCandidatePayload
): Promise<CandidateResponse> => {
    const image_url = await uploadCandidateImage(payload.image_url);
    const { data, error } = await supabase
        .from("candidates")
        .insert({
            name: payload.name,
            title: payload.title,
            faculty: payload.faculty,
            category: payload.category,
            description: payload.description,
            image_url: image_url,
            is_active: true,
        })
        .select("*")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("Aucun candidat retourné après l’enregistrement.");
    }

    return data as CandidateResponse;
};

export const getCandidates = async (): Promise<CandidateResponse[]> => {
    const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []) as CandidateResponse[];
};