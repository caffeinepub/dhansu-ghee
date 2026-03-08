import { motion } from "motion/react";

export function AboutSection() {
  const values = [
    {
      icon: "🐄",
      title: "A2 Cow Milk",
      desc: "Sourced only from healthy desi Gir cows, known for producing the finest A2 milk.",
    },
    {
      icon: "🔥",
      title: "Bilona Method",
      desc: "The ancient bilona churning process preserves all natural nutrients and aroma.",
    },
    {
      icon: "🌿",
      title: "Zero Additives",
      desc: "Absolutely no preservatives, artificial colors, or chemical additives. Ever.",
    },
    {
      icon: "✨",
      title: "Slow-Cooked",
      desc: "Simmered on low flame for hours until perfectly golden, just like grandma made.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-cream-deep traditional-pattern">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-sans text-sm tracking-[0.3em] text-saffron uppercase font-medium mb-3">
            Our Heritage
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brown mb-6">
            The Dhansu Story
          </h2>
          <div className="ornament-divider max-w-xs mx-auto mb-8">
            <span className="text-saffron text-xl">❋</span>
          </div>
        </motion.div>

        {/* Main story */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative p-8 md:p-12 bg-cream rounded-3xl border border-border shadow-warm mb-16 ornament-frame"
          >
            <div className="absolute top-6 left-8 text-saffron/20 font-serif text-8xl leading-none select-none">
              "
            </div>
            <p className="font-sans text-base md:text-lg text-brown/75 leading-relaxed relative z-10 mb-6">
              Made from{" "}
              <strong className="text-brown font-semibold">
                100% pure cow milk
              </strong>
              , Dhansu Ghee has been crafted with traditional Indian methods
              passed down through generations. Our ghee is prepared using the
              sacred{" "}
              <strong className="text-brown font-semibold">
                Bilona process
              </strong>{" "}
              — curd is hand-churned to butter, then slow-cooked over a wood
              fire until it transforms into liquid gold.
            </p>
            <p className="font-sans text-base md:text-lg text-brown/75 leading-relaxed relative z-10">
              No additives, no preservatives — just{" "}
              <strong className="text-brown font-semibold">
                pure goodness
              </strong>{" "}
              in every spoon. The rich, nutty aroma of Dhansu Ghee will take you
              back to your grandmother's kitchen, where food was made with love
              and wisdom.
            </p>
            <div className="absolute bottom-6 right-8 text-saffron/20 font-serif text-8xl leading-none select-none rotate-180">
              "
            </div>
          </motion.div>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 bg-cream rounded-2xl border border-border hover:border-saffron/40 hover:shadow-golden transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="font-serif font-bold text-brown text-lg mb-2 group-hover:text-saffron-deep transition-colors">
                  {value.title}
                </h3>
                <p className="font-sans text-sm text-brown/60 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
