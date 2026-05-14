import z from "zod";

export const addCandidateSchema = z.object({
    name: z
        .string()
        .min(2, "Le nom du candidat est obligatoire.")
        .max(100, "Le nom est trop long."),

    title: z
        .string()
        .min(2, "Le titre est obligatoire.")
        .max(100, "Le titre est trop long."),

    faculty: z
        .string()
        .min(2, "La faculté est obligatoire.")
        .max(150, "La faculté est trop longue."),

    category: z.enum(["Miss", "Master"], {
        message: "Veuillez choisir une catégorie.",
    }),

    description: z
        .string()
        .min(10, "La description doit contenir au moins 10 caractères.")
        .max(500, "La description est trop longue."),

    image_url: z
        .custom<File>((file) => file instanceof File, {
            message: "Veuillez sélectionner une photo.",
        })
        .refine((file) => file.size <= 3 * 1024 * 1024, {
            message: "L’image ne doit pas dépasser 3 Mo.",
        })
        .refine(
            (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            {
                message: "Formats acceptés : JPG, PNG ou WEBP.",
            }
        ),
});

export type AddCandidateFormValues = z.infer<typeof addCandidateSchema>;

export const voteSchema = z.object({
    fullName: z
        .string()
        .min(2, "Le nom complet est obligatoire.")
        .max(100, "Le nom est trop long."),

    phone: z
        .string()
        .min(9, "Le numéro doit contenir au moins 9 chiffres.")
        .max(15, "Le numéro est trop long.")
        .regex(/^[0-9+ ]+$/, "Le numéro de téléphone est invalide."),

    operator: z.enum(["orange", "mtn"], {
        message: "Veuillez choisir un opérateur.",
    }),

    voteCount: z.coerce
        .number()
        .int("Le nombre de votes doit être un nombre entier.")
        .min(1, "Le nombre de votes doit être au moins égal à 1.")
        .max(1000, "Le nombre maximum de votes autorisé est 1000."),
});

export type VoteFormValues = z.infer<typeof voteSchema>;

export type VoteFormInput = z.input<typeof voteSchema>;

