import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useSubscription() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptionStatus, isLoading } = useQuery({
    queryKey: ["/api/subscription/status"],
    retry: false,
  });

  const createSubscription = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/subscription/create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to access premium features",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/subscription/cancel");
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
      toast({
        title: "Subscription Canceled",
        description: data.message || "Your subscription has been canceled",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to manage your subscription",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  return {
    subscriptionStatus,
    isLoading,
    createSubscription,
    cancelSubscription,
    hasAccess: true, // Everyone has basic access to the site
    hasPremiumAccess: (subscriptionStatus as any)?.hasAccess || false,
    isActive: (subscriptionStatus as any)?.status === 'active',
  };
}