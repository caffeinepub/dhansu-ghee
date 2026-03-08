import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStripeSessionStatus } from "@/hooks/useQueries";
import { CheckCircle, Home, Loader2, Package, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

interface SuccessPageProps {
  sessionId: string | null;
}

export function SuccessPage({ sessionId }: SuccessPageProps) {
  const {
    data: status,
    isLoading,
    isError,
  } = useGetStripeSessionStatus(sessionId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isCompleted = status?.__kind__ === "completed";
  const isFailed = status?.__kind__ === "failed";

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 mandala-bg">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          data-ocid="order.success_state"
          className="bg-cream rounded-3xl border border-border shadow-warm p-8 text-center"
        >
          {isLoading && (
            <div
              className="flex flex-col items-center gap-6"
              data-ocid="order.loading_state"
            >
              <div className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-saffron animate-spin" />
              </div>
              <div className="space-y-2 w-full">
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>
              <p className="font-sans text-sm text-brown/50">
                Verifying your payment...
              </p>
            </div>
          )}

          {isError && (
            <div
              className="flex flex-col items-center gap-4"
              data-ocid="order.error_state"
            >
              <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                <Package className="h-10 w-10 text-amber-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brown">
                Order Placed!
              </h2>
              <p className="font-sans text-brown/60 text-sm leading-relaxed">
                Your order has been placed. We'll verify your payment and send
                you a confirmation email shortly.
              </p>
              <Button
                asChild
                className="mt-4 bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-semibold px-8 py-5 rounded-full shadow-golden transition-all"
              >
                <a href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </a>
              </Button>
            </div>
          )}

          {isFailed && (
            <div
              className="flex flex-col items-center gap-4"
              data-ocid="order.error_state"
            >
              <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brown">
                Payment Failed
              </h2>
              <p className="font-sans text-brown/60 text-sm leading-relaxed">
                {status.__kind__ === "failed"
                  ? status.failed.error
                  : "Your payment could not be processed. Please try again."}
              </p>
              <Button
                asChild
                className="mt-4 bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-semibold px-8 py-5 rounded-full shadow-golden"
              >
                <a href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Try Again
                </a>
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="flex flex-col items-center gap-6">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center"
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>

              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-serif text-2xl md:text-3xl font-bold text-brown mb-2"
                >
                  Order Confirmed! 🎉
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-sans text-brown/60 text-sm"
                >
                  Thank you for choosing Dhansu Ghee
                </motion.p>
              </div>

              {/* Order details */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full p-5 bg-saffron/10 rounded-2xl border border-saffron/20 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-5 w-5 text-saffron-deep" />
                  <span className="font-serif font-semibold text-brown">
                    Your Order is Being Prepared
                  </span>
                </div>
                <p className="font-sans text-sm text-brown/60 leading-relaxed">
                  Pure Dhansu Ghee will be carefully packaged and shipped to
                  you. You'll receive a tracking number via email once
                  dispatched.
                </p>
              </motion.div>

              {/* What's next */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="w-full space-y-2"
              >
                {[
                  "✅ Payment confirmed",
                  "📦 Order being prepared",
                  "🚚 Shipping within 1-2 business days",
                  "📧 Confirmation email sent",
                ].map((step) => (
                  <div
                    key={step}
                    className="flex items-center font-sans text-sm text-brown/70"
                  >
                    {step}
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="w-full"
              >
                <Button
                  asChild
                  className="w-full bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-semibold py-5 rounded-full shadow-golden transition-all hover:scale-[1.01]"
                >
                  <a href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </a>
                </Button>
              </motion.div>
            </div>
          )}

          {/* Ornament */}
          <div className="mt-8 flex items-center justify-center gap-2 text-saffron/30 text-sm">
            <span>❋</span>
            <span className="font-sans text-xs text-brown/30">Dhansu Ghee</span>
            <span>❋</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
