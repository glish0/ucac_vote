import Image from "next/image";

type AppLoaderProps = {
    title?: string;
    description?: string;
};

export function AppLoader({
    title = "Chargement...",
    description = "Préparation de l’interface, veuillez patienter.",
}: AppLoaderProps) {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] text-white">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b8252c]/20 blur-3xl" />
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#b8252c]/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
                <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-white/10 border-t-[#b8252c]" />
                    <div className="absolute inset-3 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl" />

                    <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white p-2">
                        <Image
                            src="/logo-ucac.png"
                            alt="Logo UCAC"
                            width={56}
                            height={56}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#ffb4b8]">
                        Miss & Master UCAC
                    </p>

                    <h1 className="mt-3 text-3xl font-black">{title}</h1>

                    <p className="mt-3 text-sm leading-6 text-white/55">
                        {description}
                    </p>

                    <div className="mt-6 flex justify-center gap-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#b8252c]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#b8252c] [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#b8252c] [animation-delay:300ms]" />
                    </div>
                </div>
            </div>
        </main>
    );
}