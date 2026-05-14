import { Candidate } from "@/types";



export const VOTE_PRICE = 100;

export const candidates: Candidate[] = [
    {
        id: "1",
        name: "Grâce Mireille",
        title: "Candidate Miss UCAC",
        faculty: "Faculté des Sciences Sociales",
        description:
            "Ambassadrice de l’élégance, du leadership et de l’engagement étudiant.",
        image: "/candidates/candidat1.jpg",
        category: "Miss",
    },
    {
        id: "2",
        name: "Kevin Armel",
        title: "Candidate Miss UCAC",
        faculty: "Faculté de Gestion",
        description:
            "Représentant d’une jeunesse responsable, ambitieuse et inspirante.",
        image: "/candidates/candidat2.jpg",
        category: "Miss",
    },
    {
        id: "3",
        name: "Stéphanie Laure",
        title: "Candidate Miss UCAC",
        faculty: "Faculté de Droit Canonique",
        description:
            "Un profil qui incarne la grâce, la confiance et les valeurs de l’UCAC.",
        image: "/candidates/candidat3.jpg",
        category: "Miss",
    },

];

export const steps = [
    {
        step: "01",
        title: "Choisissez",
        text: "Parcourez les photos et sélectionnez votre candidat préféré.",
    },
    {
        step: "02",
        title: "Indiquez vos votes",
        text: "Entrez votre nom, votre numéro et le nombre de votes souhaité.",
    },
    {
        step: "03",
        title: "Payez",
        text: "Confirmez le paiement Orange Money ou MTN Mobile Money.",
    },
    {
        step: "04",
        title: "Vote validé",
        text: "Les votes sont enregistrés après confirmation du paiement.",
    },
];

export const infos = [
    {
        title: "Vote payant",
        text: `Chaque vote coûte ${VOTE_PRICE} FCFA. Si vous choisissez 10 votes, le montant sera automatiquement de 1 000 FCFA.`,
    },
    {
        title: "Votes multiples",
        text: "Une personne peut soutenir son candidat avec plusieurs votes en une seule transaction.",
    },
    {
        title: "Confirmation obligatoire",
        text: "Les votes ne sont enregistrés qu’après confirmation du paiement par l’opérateur.",
    },
    {
        title: "Numéro valide",
        text: "Utilisez un numéro Orange Money ou MTN Mobile Money actif.",
    },
];

export const candidate = [
    {
        id: "1",
        name: "Grâce Mireille",
        category: "Miss",
        image: "/candidates/candidate-1.jpg",
        votes: 1250,
        amount: 125000,
    },
    {
        id: "2",
        name: "Kevin Armel",
        category: "Master",
        image: "/candidates/candidate-2.jpg",
        votes: 980,
        amount: 98000,
    },
    {
        id: "3",
        name: "Stéphanie Laure",
        category: "Miss",
        image: "/candidates/candidate-3.jpg",
        votes: 760,
        amount: 76000,
    },
    {
        id: "4",
        name: "Daniel Chris",
        category: "Master",
        image: "/candidates/candidate-4.jpg",
        votes: 430,
        amount: 43000,
    },
];

export const transactions = [
    {
        id: "TX-001",
        voterName: "Jean Marc",
        phone: "699000000",
        candidate: "Grâce Mireille",
        operator: "orange",
        voteCount: 10,
        amount: 1000,
        status: "success",
        createdAt: "2026-05-14 09:12",
    },
    {
        id: "TX-002",
        voterName: "Ange Patrick",
        phone: "677000000",
        candidate: "Kevin Armel",
        operator: "mtn",
        voteCount: 5,
        amount: 500,
        status: "pending",
        createdAt: "2026-05-14 09:15",
    },
    {
        id: "TX-003",
        voterName: "Marie Claire",
        phone: "690000000",
        candidate: "Stéphanie Laure",
        operator: "orange",
        voteCount: 20,
        amount: 2000,
        status: "success",
        createdAt: "2026-05-14 09:18",
    },
    {
        id: "TX-004",
        voterName: "Brice Junior",
        phone: "650000000",
        candidate: "Daniel Chris",
        operator: "mtn",
        voteCount: 3,
        amount: 300,
        status: "failed",
        createdAt: "2026-05-14 09:21",
    },
];

export type CandidateCategory = "Miss" | "Master";

export type CandidateResult = {
    id: string;
    name: string;
    title: string;
    faculty: string;
    description: string;
    image_url: string;
    category: CandidateCategory;
    total_votes: number;
};