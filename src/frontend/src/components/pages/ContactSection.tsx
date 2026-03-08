import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";

export function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "oyeyadav06@gmail.com",
      href: "mailto:oyeyadav06@gmail.com",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+91 99558 91290",
      href: "tel:+919955891290",
    },
    {
      icon: MapPin,
      label: "Our Location",
      value: "Raghopur, Vaishali, Bihar",
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-24 bg-cream mandala-bg">
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
            Get In Touch
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brown mb-4">
            We'd Love to Hear From You
          </h2>
          <div className="ornament-divider max-w-xs mx-auto mb-6">
            <span className="text-saffron text-xl">❋</span>
          </div>
          <p className="font-sans text-brown/60 max-w-md mx-auto">
            Have questions about our ghee, bulk orders, or just want to say
            hello? Reach out to us anytime.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {contactInfo.map((item, i) => {
            const Icon = item.icon;
            const cardContent = (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group text-center p-8 bg-cream rounded-2xl border border-border hover:border-saffron/40 hover:shadow-warm transition-all duration-300 h-full"
              >
                <div className="w-14 h-14 rounded-full bg-saffron/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-saffron/25 transition-colors">
                  <Icon className="h-6 w-6 text-saffron-deep" />
                </div>
                <p className="font-sans text-xs tracking-widest uppercase text-brown/50 mb-2">
                  {item.label}
                </p>
                <p className="font-sans font-medium text-brown text-sm leading-relaxed">
                  {item.value}
                </p>
              </motion.div>
            );

            return item.href ? (
              <a key={item.label} href={item.href} className="block">
                {cardContent}
              </a>
            ) : (
              <div key={item.label}>{cardContent}</div>
            );
          })}
        </div>

        {/* Decorative bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="font-sans text-sm text-brown/40 italic">
            "A spoon of ghee a day keeps the doctor at bay" — Ancient Ayurvedic
            Wisdom
          </p>
        </motion.div>
      </div>
    </section>
  );
}
