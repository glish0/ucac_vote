import { Card, CardContent } from "@/components/ui/card";
import { infos } from "@/constants";




export function ImportantInfo() {
    return (
        <section className="page-container pb-20">
            <Card className="glass rounded-[2rem] border-white/10 text-white">
                <CardContent className="p-6 md:p-8">
                    <div className="grid gap-6 md:grid-cols-[1fr_1.5fr] md:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ffb4b8]">
                                Informations importantes
                            </p>

                            <h2 className="mt-3 text-3xl font-black">
                                Avant de valider votre vote
                            </h2>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {infos.map((info) => (
                                <div
                                    key={info.title}
                                    className="rounded-3xl border border-white/10 bg-black/30 p-5"
                                >
                                    <h3 className="font-black">{info.title}</h3>

                                    <p className="mt-2 text-sm leading-6 text-white/55">
                                        {info.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}