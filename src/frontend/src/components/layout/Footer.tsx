export function Footer() {
  const currentYear = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-brown text-cream/80 py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/dhansu-ghee-logo-transparent.dim_300x300.png"
                alt="Dhansu Ghee"
                className="w-10 h-10 object-contain brightness-0 invert"
              />
              <span className="font-serif text-xl font-bold text-cream">
                Dhansu Ghee
              </span>
            </div>
            <p className="font-sans text-sm text-cream/60 leading-relaxed">
              Pure. Traditional. Nourishing.
            </p>
            <p className="font-sans text-sm text-cream/50 mt-3 leading-relaxed">
              Bringing the authentic taste of traditional Indian ghee to your
              kitchen.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-serif text-base font-semibold text-cream mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "#home" },
                { label: "Our Product", href: "#product" },
                { label: "About Us", href: "#about" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-cream/60 hover:text-saffron transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-serif text-base font-semibold text-cream mb-4">
              Contact
            </h3>
            <ul className="space-y-2 font-sans text-sm text-cream/60">
              <li>
                <a
                  href="mailto:oyeyadav06@gmail.com"
                  className="hover:text-saffron transition-colors"
                >
                  oyeyadav06@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919955891290"
                  className="hover:text-saffron transition-colors"
                >
                  +91 99558 91290
                </a>
              </li>
              <li>Raghopur, Vaishali, Bihar</li>
            </ul>
          </div>
        </div>

        {/* Divider with ornament */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-cream/10" />
          <span className="text-saffron/60 text-sm">❋</span>
          <div className="flex-1 h-px bg-cream/10" />
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-sans text-cream/40">
          <p>© {currentYear} Dhansu Ghee. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron/70 hover:text-saffron transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
