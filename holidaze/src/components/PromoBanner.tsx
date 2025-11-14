export default function PromoBanner() {
    return (
        <section
        aria-label="Welcome offer"
        className="bg-coral text-white border-y border-white/40"
        >
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-center py-4 md:py-5 font-serif text-base md:text-lg">
                Not a member yet? <span className="font-semibold">Get 10% off your first booking!</span>
                </p>
            </div>
        </section>
    );
}