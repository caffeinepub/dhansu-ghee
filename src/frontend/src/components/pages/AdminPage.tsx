import type { GheeProduct, OrderStatus } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetAllOrders,
  useGetProduct,
  useIsCallerAdmin,
  useIsStripeConfigured,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "@/hooks/useQueries";
import {
  AlertTriangle,
  Check,
  Loader2,
  LogIn,
  Package,
  RefreshCw,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(rupees);
}

function formatDate(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
};

export function AdminPage() {
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const { data: product, isLoading: productLoading } = useGetProduct();
  const { data: isStripeConfigured } = useIsStripeConfigured();

  const updateOrderStatus = useUpdateOrderStatus();
  const updateProduct = useUpdateProduct();

  const [productForm, setProductForm] = useState<Partial<GheeProduct> | null>(
    null,
  );
  const [savingProduct, setSavingProduct] = useState(false);

  const initProductForm = () => {
    if (product) {
      setProductForm({
        name: product.name,
        description: product.description,
        pricePaise: product.pricePaise,
        availableStock: product.availableStock,
      });
    }
  };

  const handleSaveProduct = async () => {
    if (!productForm || !product) return;
    setSavingProduct(true);
    try {
      await updateProduct.mutateAsync({
        name: productForm.name ?? product.name,
        description: productForm.description ?? product.description,
        pricePaise: productForm.pricePaise ?? product.pricePaise,
        availableStock: productForm.availableStock ?? product.availableStock,
      });
      toast.success("Product updated successfully");
      setProductForm(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleStatusChange = async (orderId: bigint, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({
        orderId,
        newStatus: newStatus as OrderStatus,
      });
      toast.success("Order status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Not logged in
  if (!identity) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 mandala-bg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream rounded-3xl border border-border shadow-warm p-10 text-center max-w-sm w-full"
        >
          <div className="w-16 h-16 rounded-full bg-saffron/15 flex items-center justify-center mx-auto mb-6">
            <LogIn className="h-8 w-8 text-saffron-deep" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brown mb-3">
            Admin Access
          </h2>
          <p className="font-sans text-sm text-brown/60 mb-8">
            Please log in with your Internet Identity to access the admin panel.
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-semibold py-5 rounded-full shadow-golden"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login to Continue"
            )}
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full mt-3 text-brown/60 hover:text-brown font-sans text-sm"
          >
            <a href="/">← Back to Home</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  // Checking admin status
  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-saffron animate-spin" />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brown mb-3">
            Access Denied
          </h2>
          <p className="font-sans text-sm text-brown/60 mb-6">
            You don't have admin privileges to access this page.
          </p>
          <Button
            variant="outline"
            asChild
            className="border-saffron/40 text-saffron rounded-full font-sans"
          >
            <a href="/">← Back to Home</a>
          </Button>
          <Button
            variant="ghost"
            onClick={() => clear()}
            className="ml-2 text-brown/50 font-sans text-sm"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/dhansu-ghee-logo-transparent.dim_300x300.png"
              alt="Dhansu Ghee"
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="font-serif font-bold text-brown">
                Dhansu Ghee
              </span>
              <span className="ml-2 font-sans text-xs text-saffron bg-saffron/10 px-2 py-0.5 rounded-full border border-saffron/20">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-brown/60 font-sans text-sm hover:text-brown"
            >
              <a href="/">← Store</a>
            </Button>
            <Button
              variant="outline"
              onClick={() => clear()}
              className="border-border text-brown font-sans text-sm rounded-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-10">
        {/* Stripe warning */}
        {!isStripeConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-sans font-semibold text-amber-800 text-sm">
                Stripe Not Configured
              </p>
              <p className="font-sans text-xs text-amber-700 mt-1">
                Payment processing is not set up. Add your Stripe secret key and
                allowed countries to enable online payments.
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders section */}
          <div className="lg:col-span-2">
            <div className="bg-cream rounded-2xl border border-border shadow-xs overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-saffron-deep" />
                  <h2 className="font-serif font-bold text-brown text-lg">
                    Orders
                  </h2>
                  {orders && (
                    <Badge className="bg-saffron/15 text-saffron-deep border-saffron/20 font-sans text-xs">
                      {orders.length}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-brown/50 hover:text-brown"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="overflow-x-auto">
                {ordersLoading ? (
                  <div className="p-6 space-y-3">
                    {["sk1", "sk2", "sk3", "sk4"].map((id) => (
                      <Skeleton key={id} className="h-12 w-full" />
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <Table data-ocid="admin.table">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="font-sans text-xs text-brown/50 uppercase tracking-wide">
                          Order
                        </TableHead>
                        <TableHead className="font-sans text-xs text-brown/50 uppercase tracking-wide">
                          Customer
                        </TableHead>
                        <TableHead className="font-sans text-xs text-brown/50 uppercase tracking-wide">
                          Qty
                        </TableHead>
                        <TableHead className="font-sans text-xs text-brown/50 uppercase tracking-wide">
                          Amount
                        </TableHead>
                        <TableHead className="font-sans text-xs text-brown/50 uppercase tracking-wide">
                          Date
                        </TableHead>
                        <TableHead className="font-sans text-xs text-brown/50 uppercase tracking-wide">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, i) => (
                        <TableRow
                          key={order.id.toString()}
                          className="border-border hover:bg-saffron/5 transition-colors"
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell className="font-sans text-sm font-medium text-brown">
                            #{order.id.toString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-sans text-sm text-brown font-medium">
                                {order.customerName}
                              </p>
                              <p className="font-sans text-xs text-brown/50">
                                {order.customerEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-sans text-sm text-brown/70">
                            {order.quantity.toString()}
                          </TableCell>
                          <TableCell className="font-sans text-sm font-medium text-brown">
                            {formatPrice(order.totalAmountPaise)}
                          </TableCell>
                          <TableCell className="font-sans text-xs text-brown/50">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(val) =>
                                handleStatusChange(order.id, val)
                              }
                            >
                              <SelectTrigger
                                className={`h-7 text-xs w-28 font-sans border ${STATUS_COLORS[order.status] ?? ""} rounded-full px-3`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "pending",
                                  "paid",
                                  "shipped",
                                  "delivered",
                                ].map((s) => (
                                  <SelectItem
                                    key={s}
                                    value={s}
                                    className="font-sans text-xs capitalize"
                                  >
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-12 text-center">
                    <Package className="h-10 w-10 text-brown/20 mx-auto mb-3" />
                    <p className="font-sans text-sm text-brown/40">
                      No orders yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product management */}
          <div className="lg:col-span-1">
            <div className="bg-cream rounded-2xl border border-border shadow-xs overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center gap-2">
                <Settings className="h-5 w-5 text-saffron-deep" />
                <h2 className="font-serif font-bold text-brown text-lg">
                  Product
                </h2>
              </div>

              <div className="p-6">
                {productLoading ? (
                  <div className="space-y-4">
                    {["p1", "p2", "p3", "p4"].map((id) => (
                      <Skeleton key={id} className="h-10 w-full" />
                    ))}
                  </div>
                ) : product ? (
                  <>
                    {!productForm ? (
                      <div className="space-y-4">
                        <div>
                          <p className="font-sans text-xs text-brown/50 uppercase tracking-wide mb-1">
                            Name
                          </p>
                          <p className="font-sans text-sm font-medium text-brown">
                            {product.name}
                          </p>
                        </div>
                        <Separator className="bg-border" />
                        <div>
                          <p className="font-sans text-xs text-brown/50 uppercase tracking-wide mb-1">
                            Price
                          </p>
                          <p className="font-serif text-lg font-bold text-saffron-deep">
                            {formatPrice(product.pricePaise)}
                          </p>
                        </div>
                        <Separator className="bg-border" />
                        <div>
                          <p className="font-sans text-xs text-brown/50 uppercase tracking-wide mb-1">
                            Stock
                          </p>
                          <p className="font-sans text-sm font-medium text-brown">
                            {product.availableStock.toString()} units
                          </p>
                        </div>
                        <Button
                          onClick={initProductForm}
                          className="w-full bg-saffron/15 hover:bg-saffron/25 text-saffron-deep border border-saffron/20 font-sans font-medium rounded-full mt-2 transition-all"
                        >
                          Edit Product
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label className="font-sans text-xs text-brown/60 uppercase tracking-wide mb-1 block">
                            Name
                          </Label>
                          <Input
                            value={productForm.name ?? ""}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="border-border bg-cream-deep/50 font-sans text-sm text-brown"
                          />
                        </div>
                        <div>
                          <Label className="font-sans text-xs text-brown/60 uppercase tracking-wide mb-1 block">
                            Description
                          </Label>
                          <Textarea
                            value={productForm.description ?? ""}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            className="border-border bg-cream-deep/50 font-sans text-sm text-brown resize-none"
                          />
                        </div>
                        <div>
                          <Label className="font-sans text-xs text-brown/60 uppercase tracking-wide mb-1 block">
                            Price (in Paise)
                          </Label>
                          <Input
                            type="number"
                            value={Number(productForm.pricePaise ?? 0)}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                pricePaise: BigInt(e.target.value || "0"),
                              }))
                            }
                            className="border-border bg-cream-deep/50 font-sans text-sm text-brown"
                          />
                          <p className="font-sans text-xs text-brown/40 mt-1">
                            ₹
                            {(
                              Number(productForm.pricePaise ?? 0) / 100
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <Label className="font-sans text-xs text-brown/60 uppercase tracking-wide mb-1 block">
                            Stock
                          </Label>
                          <Input
                            type="number"
                            value={Number(productForm.availableStock ?? 0)}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                availableStock: BigInt(e.target.value || "0"),
                              }))
                            }
                            className="border-border bg-cream-deep/50 font-sans text-sm text-brown"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveProduct}
                            disabled={savingProduct}
                            data-ocid="admin.save_button"
                            className="flex-1 bg-saffron hover:bg-saffron-deep text-primary-foreground font-sans font-medium rounded-full shadow-golden"
                          >
                            {savingProduct ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setProductForm(null)}
                            className="flex-1 border-border text-brown font-sans rounded-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
