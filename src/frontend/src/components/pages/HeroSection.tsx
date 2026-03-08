import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/dhansu-ghee-hero.dim_1200x500.jpg"
          alt="Dhansu Ghee - Pure Traditional Ghee"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-brown/70 via-brown/50 to-brown/80" />
        {/* Warm golden shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-deep/20 via-transparent to-saffron-deep/20" />
      </div>

      {/* Decorative corner ornaments */}
      <div className="absolute top-24 left-6 text-saffron/40 text-4xl select-none pointer-events-none hidden md:block">
        ✦
      </div>
      <div className="absolute top-24 right-6 text-saffron/40 text-4xl select-none pointer-events-none hidden md:block">
        ✦
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Eyebrow ornament */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="text-saffron/80 text-lg">❋</span>
          <span className="font-sans text-sm tracking-[0.3em] text-saffron/90 uppercase font-medium">
            Since Generations
          </span>
          <span className="text-saffron/80 text-lg">❋</span>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-4 leading-tight"
        >
          Dhansu
          <span className="block text-saffron italic">Ghee</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-lg md:text-2xl text-cream/85 mb-10 tracking-wide"
        >
          Pure. Traditional. Nourishing.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            data-ocid="hero.primary_button"
            className="bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-semibold px-10 py-6 text-lg rounded-full shadow-golden transition-all duration-300 hover:scale-105 hover:shadow-golden"
          >
            <a href="#product">Shop Now</a>
          </Button>
          <Button
            variant="outline"
            asChild
            className="border-cream/50 text-cream hover:bg-cream/10 hover:text-cream hover:border-cream/80 font-sans px-8 py-6 text-base rounded-full transition-all duration-300 bg-transparent backdrop-blur-sm"
          >
            <a href="#about">Our Story</a>
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-cream/70 text-sm font-sans"
        >
          {[
            "100% Pure",
            "No Additives",
            "Traditional Process",
            "A2 Cow Milk",
          ].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <span className="text-saffron text-xs">✦</span>
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 animate-bounce"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
