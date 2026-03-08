import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProduct } from "@/hooks/useQueries";
import { Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductSectionProps {
  onAddToCart: (quantity: number) => void;
}

function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(rupees);
}

export function ProductSection({ onAddToCart }: ProductSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, isError } = useGetProduct();

  const handleAddToCart = () => {
    onAddToCart(quantity);
    toast.success(`${quantity} jar${quantity > 1 ? "s" : ""} added to cart!`, {
      description: "Dhansu Pure Ghee",
    });
  };

  const decreaseQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQty = () => {
    const max = product ? Number(product.availableStock) : 10;
    setQuantity((prev) => Math.min(max, prev + 1));
  };

  return (
    <section
      id="product"
      className="py-24 bg-cream mandala-bg"
      data-ocid="product.section"
    >
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
            Our Signature Product
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brown mb-4">
            Pure Desi Ghee
          </h2>
          <div className="ornament-divider max-w-xs mx-auto">
            <span className="text-saffron text-xl">❋</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-warm">
              <img
                src="/assets/generated/dhansu-ghee-product.dim_600x600.jpg"
                alt="Dhansu Ghee - Pure Desi Cow Ghee"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {/* Stock badge */}
              {product && Number(product.availableStock) > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-700/90 text-white border-0 font-sans text-xs px-3 py-1 backdrop-blur-sm">
                    In Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Decorative frame element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-saffron/30 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-terracotta/20 rounded-xl -z-10" />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {isLoading ? (
              <ProductSkeleton />
            ) : isError ? (
              <div className="text-destructive font-sans">
                Unable to load product. Please refresh.
              </div>
            ) : product ? (
              <>
                {/* Star rating */}
                <div className="flex items-center gap-1">
                  {["s1", "s2", "s3", "s4", "s5"].map((id) => (
                    <Star
                      key={id}
                      className="h-4 w-4 fill-saffron text-saffron"
                    />
                  ))}
                  <span className="font-sans text-sm text-brown/60 ml-2">
                    (128 reviews)
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-brown mb-3">
                    {product.name}
                  </h3>
                  <p className="font-sans text-brown/70 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3">
                  <span className="font-serif text-4xl font-bold text-saffron-deep">
                    {formatPrice(product.pricePaise)}
                  </span>
                  <span className="font-sans text-sm text-brown/50 mb-1">
                    per jar
                  </span>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "🐄 A2 Cow Milk",
                    "🌿 No Preservatives",
                    "🔥 Bilona Method",
                    "✨ Pure & Natural",
                  ].map((feat) => (
                    <span
                      key={feat}
                      className="font-sans text-xs text-brown/70 flex items-center gap-1.5 bg-cream-deep/80 rounded-lg px-3 py-2 border border-border"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="font-sans text-sm font-medium text-brown/60">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-border rounded-full overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={decreaseQty}
                      className="px-3 py-2 hover:bg-saffron/10 transition-colors text-brown"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      max={product ? Number(product.availableStock) : 10}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value);
                        if (!Number.isNaN(val) && val >= 1) setQuantity(val);
                      }}
                      data-ocid="product.input"
                      className="w-12 text-center font-sans font-medium text-brown bg-transparent border-x border-border py-2 focus:outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={increaseQty}
                      className="px-3 py-2 hover:bg-saffron/10 transition-colors text-brown"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {product && (
                    <span className="font-sans text-xs text-brown/40">
                      {Number(product.availableStock)} available
                    </span>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-saffron/10 rounded-xl border border-saffron/20">
                  <span className="font-sans text-sm text-brown/70">
                    Total ({quantity} jar{quantity > 1 ? "s" : ""})
                  </span>
                  <span className="font-serif text-xl font-bold text-brown">
                    {formatPrice(product.pricePaise * BigInt(quantity))}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  data-ocid="product.primary_button"
                  className="w-full bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-semibold py-6 text-base rounded-full shadow-golden transition-all duration-300 hover:scale-[1.02] gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              </>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}
