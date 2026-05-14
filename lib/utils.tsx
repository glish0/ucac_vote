import { Badge } from "@/components/ui/badge";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatAmount(amount: number) {
    return new Intl.NumberFormat("fr-FR").format(amount);
}

export function getStatusBadge(status: string) {
    if (status === "success") {
        return (
            <Badge className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">
                Réussi
            </Badge>
        );
    }

    if (status === "pending") {
        return (
            <Badge className="bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/15">
                En attente
            </Badge>
        );
    }

    return (
        <Badge className="bg-red-500/15 text-red-300 hover:bg-red-500/15">
            Échoué
        </Badge>
    );
}

export function getOperatorBadge(operator: string) {
    if (operator === "orange") {
        return (
            <Badge className="bg-orange-500/15 text-orange-300 hover:bg-orange-500/15">
                Orange Money
            </Badge>
        );
    }

    return (
        <Badge className="bg-yellow-400/15 text-yellow-200 hover:bg-yellow-400/15">
            MTN MoMo
        </Badge>
    );
}