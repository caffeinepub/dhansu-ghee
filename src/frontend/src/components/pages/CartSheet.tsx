import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateStripeCheckout,
  useGetProduct,
  useIsStripeConfigured,
  usePlaceOrder,
} from "@/hooks/useQueries";
import { Loader2, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(rupees);
}

export function CartSheet({
  open,
  onOpenChange,
  quantity,
  onQuantityChange,
}: CartSheetProps) {
  const { data: product } = useGetProduct();
  const { data: isStripeConfigured } = useIsStripeConfigured();
  const placeOrder = usePlaceOrder();
  const createStripeCheckout = useCreateStripeCheckout();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = product ? product.pricePaise * BigInt(quantity) : 0n;

  const handleCheckout = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsProcessing(true);
    try {
      const orderId = await placeOrder.mutateAsync({
        customerName: form.name,
        customerEmail: form.email,
        address: form.address,
        quantity: BigInt(quantity),
      });

      if (isStripeConfigured) {
        const sessionId = "{CHECKOUT_SESSION_ID}";
        const successUrl = `${window.location.origin}/success?session_id=${sessionId}`;
        const cancelUrl = `${window.location.origin}/`;
        const stripeUrl = await createStripeCheckout.mutateAsync({
          orderId,
          successUrl,
          cancelUrl,
        });
        window.location.href = stripeUrl;
      } else {
        // Stripe not configured - show success without payment
        toast.success("Order placed successfully!", {
          description: `Order #${orderId.toString()} created. We'll contact you for payment.`,
        });
        setCheckoutOpen(false);
        onOpenChange(false);
        setForm({ name: "", email: "", address: "" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isEmpty = quantity === 0;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          data-ocid="cart.sheet"
          className="w-full sm:max-w-md flex flex-col bg-cream border-l border-border p-0"
        >
          <SheetHeader className="px-6 py-5 border-b border-border">
            <SheetTitle className="font-serif text-xl text-brown flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-saffron" />
              Your Cart
            </SheetTitle>
            <SheetDescription className="font-sans text-sm text-brown/50">
              Review your order before checkout
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-saffron/50" />
                </div>
                <p className="font-serif text-xl text-brown/60">
                  Your cart is empty
                </p>
                <p className="font-sans text-sm text-brown/40">
                  Add some pure ghee to get started
                </p>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full border-saffron/40 text-saffron hover:bg-saffron/10"
                  onClick={() => onOpenChange(false)}
                >
                  <a href="#product">Browse Product</a>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {product && (
                  <div className="flex gap-4 items-start">
                    <img
                      src="/assets/generated/dhansu-ghee-product.dim_600x600.jpg"
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl border border-border"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif font-semibold text-brown text-base mb-1">
                        {product.name}
                      </h3>
                      <p className="font-sans text-sm text-saffron-deep font-medium mb-3">
                        {formatPrice(product.pricePaise)} / jar
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-border rounded-full overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              onQuantityChange(Math.max(1, quantity - 1))
                            }
                            className="px-3 py-1.5 hover:bg-saffron/10 transition-colors text-brown"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 font-sans font-medium text-brown text-sm w-8 text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onQuantityChange(
                                Math.min(
                                  Number(product.availableStock),
                                  quantity + 1,
                                ),
                              )
                            }
                            className="px-3 py-1.5 hover:bg-saffron/10 transition-colors text-brown"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(0)}
                          className="text-brown/40 hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="bg-border" />

                {/* Order summary */}
                <div className="space-y-2 font-sans text-sm">
                  <div className="flex justify-between text-brown/70">
                    <span>
                      Subtotal ({quantity} jar{quantity > 1 ? "s" : ""})
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-brown/70">
                    <span>Shipping</span>
                    <span className="text-green-700 font-medium">Free</span>
                  </div>
                  <Separator className="bg-border my-2" />
                  <div className="flex justify-between font-semibold text-brown text-base">
                    <span>Total</span>
                    <span className="font-serif text-lg text-saffron-deep">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                {!isStripeConfigured && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-sans text-amber-800">
                    💡 Online payment is being set up. You can still place an
                    order and we'll contact you for payment.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Checkout button */}
          {!isEmpty && (
            <div className="px-6 py-5 border-t border-border">
              <Button
                onClick={() => setCheckoutOpen(true)}
                data-ocid="cart.checkout_button"
                className="w-full bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-semibold py-6 text-base rounded-full shadow-golden transition-all duration-300 hover:scale-[1.01]"
              >
                Proceed to Checkout →
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent
          data-ocid="checkout.dialog"
          className="bg-cream border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-brown">
              Complete Your Order
            </DialogTitle>
            <DialogDescription className="font-sans text-sm text-brown/60">
              {product && formatPrice(product.pricePaise * BigInt(quantity))}{" "}
              for {quantity} jar{quantity > 1 ? "s" : ""} of {product?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <div>
              <Label className="font-sans text-sm font-medium text-brown mb-1.5 block">
                Full Name *
              </Label>
              <Input
                placeholder="Your full name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                data-ocid="checkout.input"
                className="border-border bg-cream-deep/50 font-sans text-brown placeholder:text-brown/40 focus:ring-saffron"
              />
            </div>

            <div>
              <Label className="font-sans text-sm font-medium text-brown mb-1.5 block">
                Email Address *
              </Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                data-ocid="checkout.input"
                className="border-border bg-cream-deep/50 font-sans text-brown placeholder:text-brown/40"
              />
            </div>

            <div>
              <Label className="font-sans text-sm font-medium text-brown mb-1.5 block">
                Delivery Address *
              </Label>
              <Textarea
                placeholder="Complete delivery address with pincode"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
                data-ocid="checkout.input"
                rows={3}
                className="border-border bg-cream-deep/50 font-sans text-brown placeholder:text-brown/40 resize-none"
              />
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              data-ocid="checkout.submit_button"
              className="w-full bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-semibold py-5 rounded-full shadow-golden transition-all duration-300 mt-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : isStripeConfigured ? (
                "Pay Securely with Stripe →"
              ) : (
                "Place Order →"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
