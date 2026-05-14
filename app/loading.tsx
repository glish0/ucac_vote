import { AppLoader } from "@/components/shared/AppLoader";

export default function Loading() {
    return (
        <AppLoader
            title="Chargement de la page"
            description="Nous préparons les informations du concours."
        />
    );
}