import { Card, CardContent } from "@/components/ui/card";
import { steps } from "@/constants";



export function HowToVote() {
    return (
        <section id="comment-ca-marche" className="page-container pb-16">
            <Card className="glass rounded-[2rem] border-white/10 text-white">
                <CardContent className="p-6 md:p-8">
                    <div className="mb-8 max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ffb4b8]">
                            Processus de vote
                        </p>

                        <h2 className="mt-3 text-3xl font-black md:text-4xl">
                            Un vote simple, rapide et transparent
                        </h2>

                        <p className="mt-4 leading-7 text-white/60">
                            Pour faciliter la participation du public, la plateforme vous
                            permet de voter en quelques étapes avec votre téléphone Mobile
                            Money.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        {steps.map((item) => (
                            <div
                                key={item.step}
                                className="rounded-3xl border border-white/10 bg-black/30 p-5"
                            >
                                <p className="text-sm font-black text-[#ffb4b8]">
                                    {item.step}
                                </p>

                                <h3 className="mt-4 text-xl font-black">{item.title}</h3>

                                <p className="mt-3 text-sm leading-6 text-white/55">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}