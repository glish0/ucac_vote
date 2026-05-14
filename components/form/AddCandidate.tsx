"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AddCandidateFormValues, addCandidateSchema } from "@/lib/schema";
import { useCreateCandidate } from "@/hooks/useCreateCandidate";





type AddCandidateModalProps = {
    trigger?: React.ReactNode;
    onCandidateCreated?: () => void;
};

export function AddCandidateModal({
    trigger,
    onCandidateCreated,
}: AddCandidateModalProps) {
    const { mutate: addCandidate, isPending } = useCreateCandidate()
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const form = useForm<AddCandidateFormValues>({
        resolver: zodResolver(addCandidateSchema),
        defaultValues: {
            name: "",
            title: "",
            faculty: "",
            category: "Miss",
            description: "",
            image_url: undefined,
        },
    });

    const imageUrl = form.watch("image_url");
    const category = form.watch("category");

    const previewTitle = useMemo(() => {
        if (category === "Miss") return "Candidate Miss UCAC";
        return "Candidat Master UCAC";
    }, [category]);

    const resetForm = () => {
        form.reset({
            name: "",
            title: "",
            faculty: "",
            category: "Miss",
            description: "",
            image_url: undefined,
        });

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(null);
    };

    const onSubmit = async (values: AddCandidateFormValues) => {
        await addCandidate({
            name: values.name,
            title: values.title,
            faculty: values.faculty,
            category: values.category,
            description: values.description,
            image_url: values.image_url,
        });

        /* resetForm();
        setOpen(false); */
        onCandidateCreated?.();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) resetForm();
                setOpen(value);
            }}
        >
            <DialogTrigger>
                {trigger ?? (
                    <Button className="rounded-full bg-[#b8252c] font-bold hover:bg-[#d32d35]">
                        Ajouter un candidat
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[2rem] border-white/10 bg-[#090909]/95 p-0 text-white shadow-2xl backdrop-blur-2xl sm:max-w-2xl">
                <div className="relative overflow-hidden rounded-[2rem] p-5 md:p-6">
                    <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#b8252c]/40 blur-3xl" />

                    <DialogHeader className="relative mb-6 text-left">
                        <DialogTitle className="text-3xl font-black text-white">
                            Ajouter un candidat
                        </DialogTitle>

                        <DialogDescription className="text-white/50">
                            Renseignez les informations du candidat pour l’afficher sur la
                            page publique du concours Miss/Master UCAC.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="relative grid gap-5 px-6"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white/80">
                                    Nom complet
                                </Label>

                                <Input
                                    id="name"
                                    placeholder="Ex : Grâce Mireille"
                                    {...form.register("name")}
                                    className="h-12 rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#ffb4b8]"
                                />

                                {form.formState.errors.name && (
                                    <p className="text-sm text-red-300">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white/80">Catégorie</Label>

                                <Select
                                    value={category}
                                    onValueChange={(value) => {
                                        if (value !== "Miss" && value !== "Master") return;

                                        form.setValue("category", value, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });

                                        form.setValue(
                                            "title",
                                            value === "Miss" ? "Candidate Miss UCAC" : "Candidat Master UCAC",
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            }
                                        );
                                    }}
                                >
                                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/10 text-white focus:ring-[#ffb4b8]">
                                        <SelectValue placeholder="Choisir une catégorie" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Miss">Miss</SelectItem>
                                        <SelectItem value="Master">Master</SelectItem>
                                    </SelectContent>
                                </Select>

                                {form.formState.errors.category && (
                                    <p className="text-sm text-red-300">
                                        {form.formState.errors.category.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-white/80">
                                    Titre
                                </Label>

                                <Input
                                    id="title"
                                    placeholder={previewTitle}
                                    {...form.register("title")}
                                    className="h-12 rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#ffb4b8]"
                                />

                                {form.formState.errors.title && (
                                    <p className="text-sm text-red-300">
                                        {form.formState.errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="faculty" className="text-white/80">
                                    Faculté / École / Filière
                                </Label>

                                <Input
                                    id="faculty"
                                    placeholder="Ex : Faculté des Sciences Sociales"
                                    {...form.register("faculty")}
                                    className="h-12 rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#ffb4b8]"
                                />

                                {form.formState.errors.faculty && (
                                    <p className="text-sm text-red-300">
                                        {form.formState.errors.faculty.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imageFile" className="text-white/80">
                                    Photo du candidat
                                </Label>

                                <Input
                                    id="image_url"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];

                                        if (!file) return;

                                        form.setValue("image_url", file, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });

                                        const localPreviewUrl = URL.createObjectURL(file);
                                        setPreviewUrl(localPreviewUrl);
                                    }}
                                    className="h-12 rounded-2xl border-white/10 bg-white/10 text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#b8252c] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white placeholder:text-white/30 focus-visible:ring-[#ffb4b8]"
                                />

                                {previewUrl && (
                                    <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                                        <img
                                            src={previewUrl}
                                            alt="Aperçu du candidat"
                                            className="h-64 w-full object-cover"
                                        />
                                    </div>
                                )}

                                {form.formState.errors.image_url && (
                                    <p className="text-sm text-red-300">
                                        {form.formState.errors.image_url.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-white/80">
                                    Description courte
                                </Label>

                                <Textarea
                                    id="description"
                                    placeholder="Ex : Ambassadrice de l’élégance, du leadership et de l’engagement étudiant."
                                    rows={4}
                                    {...form.register("description")}
                                    className="resize-none rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#ffb4b8]"
                                />

                                {form.formState.errors.description && (
                                    <p className="text-sm text-red-300">
                                        {form.formState.errors.description.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-13 w-full rounded-2xl bg-[#b8252c] text-sm font-black text-white shadow-[0_20px_50px_rgba(184,37,44,0.35)] hover:bg-[#d32d35]"
                            >
                                {isPending ? "Ajout en cours..." : "Enregistrer le candidat"}
                            </Button>
                        </div>

                        {/*  <div className="lg:sticky lg:top-5">
                            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10">
                                <div className="relative h-[360px] bg-white/5">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt="Preview candidat"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/40">
                                            L’aperçu de la photo apparaîtra ici.
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

                                    <div className="absolute left-4 top-4 rounded-full bg-[#b8252c] px-3 py-1 text-xs font-bold text-white">
                                        {category}
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb4b8]">
                                            {form.watch("title") || previewTitle}
                                        </p>

                                        <h3 className="mt-2 text-2xl font-black text-white">
                                            {form.watch("name") || "Nom du candidat"}
                                        </h3>

                                        <p className="mt-1 text-sm text-white/55">
                                            {form.watch("faculty") || "Faculté / Filière"}
                                        </p>

                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/65">
                                            {form.watch("description") ||
                                                "Description courte du candidat."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/55">
                                Cette carte montre comment le candidat apparaîtra sur la page
                                publique.
                            </div>
                        </div> */}
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}