import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GheeProduct, Order, OrderStatus } from "../backend.d";
import { useActor } from "./useActor";

export function useGetProduct() {
  const { actor, isFetching } = useActor();
  return useQuery<GheeProduct>({
    queryKey: ["product"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getProduct();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isStripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      customerName,
      customerEmail,
      address,
      quantity,
    }: {
      customerName: string;
      customerEmail: string;
      address: string;
      quantity: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(customerName, customerEmail, address, quantity);
    },
  });
}

export function useCreateStripeCheckout() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      orderId,
      successUrl,
      cancelUrl,
    }: {
      orderId: bigint;
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createStripeCheckout(orderId, successUrl, cancelUrl);
    },
  });
}

export function useGetStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeSessionStatus", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) throw new Error("Missing dependencies");
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
    retry: 3,
    retryDelay: 2000,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: bigint;
      newStatus: OrderStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(orderId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedProduct: GheeProduct) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(updatedProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
}
