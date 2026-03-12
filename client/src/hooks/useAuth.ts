import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    // Don't show loading indefinitely for 401 errors in freemium model
    staleTime: 5000,
  });

  // In freemium model, 401 errors are expected for non-authenticated users
  const authLoading = isLoading && !error;

  return {
    user,
    isLoading: authLoading,
    isAuthenticated: !!user,
  };
}