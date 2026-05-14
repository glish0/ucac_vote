'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";

export function VoteHeader() {
    const router = useRouter()
    const handleResult = () => {
        router.push('/results')
    }
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
            <div className="page-container flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 items-center rounded-2xl border border-white/10 bg-white/10 px-3 backdrop-blur-xl">
                        <Image
                            src="/logo-ucac.png"
                            alt="Logo UCAC"
                            width={170}
                            height={45}
                            className="h-9 w-auto object-contain"
                        />
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold">UCAC Awards</p>
                        <p className="text-xs text-white/50">Miss & Master Contest</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleResult}
                        className="hidden rounded-full border-white/10 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:inline-flex"
                    >
                        Résultats
                    </Button>

                    <Button className="rounded-full bg-[#b8252c] hover:bg-[#d32d35]">
                        <a href="#candidats">Voter maintenant</a>
                    </Button>
                </div>
            </div>
        </header>
    );
}