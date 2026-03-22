export function TrustedBy() {


    return (
        <section className="w-full py-8 md:py-12 border-y border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">
                    Trusted by leading chains & protocols
                </p>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {[
                        { name: "Circle", color: "hover:text-[#2775CA]" },
                        { name: "Avalanche", color: "hover:text-[#E84142]" },
                        { name: "Cardano", color: "hover:text-[#0033AD]" },
                        { name: "Stellar", color: "hover:text-[#141414]" },
                        { name: "Midnight", color: "hover:text-[#12123F]" }
                    ].map((partner) => (
                        <span key={partner.name} className={`text-xl md:text-2xl font-bold text-slate-400 select-none transition-all duration-300 hover:scale-110 ${partner.color}`}>
                            {partner.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
