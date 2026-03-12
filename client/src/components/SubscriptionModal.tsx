import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Book, Headphones } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Eternal Chase Premium!",
        description: "Your subscription is now active. Enjoy unlimited access to the cosmic universe.",
      });
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isProcessing ? "Processing..." : "Subscribe for $9.99/month"}
      </Button>
    </form>
  );
};

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { createSubscription, subscriptionStatus, isLoading } = useSubscription();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartSubscription = async () => {
    try {
      const result = await createSubscription.mutateAsync() as any;
      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
      } else if (result.message) {
        toast({
          title: "Already Subscribed",
          description: result.message,
        });
        onClose();
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleSuccess = () => {
    setClientSecret(null);
    onClose();
  };

  if ((subscriptionStatus as any)?.hasAccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-gradient-to-br from-gray-900 to-black border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              <Crown className="inline mr-2 h-5 w-5" />
              Premium Active
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-green-400 text-lg mb-4">
              ✨ You have full access to Eternal Chase Premium
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Active Subscription
            </Badge>
          </div>
          <Button onClick={onClose} className="w-full">
            Continue Exploring
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-black border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            <Sparkles className="inline mr-2 h-6 w-6" />
            Unlock the Eternal Chase Universe
          </DialogTitle>
        </DialogHeader>
        
        {!clientSecret ? (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-purple-300">Premium Subscription</CardTitle>
                <CardDescription className="text-gray-300">
                  Get unlimited access to the complete Eternal Chase trilogy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-white">
                  $9.99 <span className="text-lg text-gray-400">/ month</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-200">
                    <Book className="h-5 w-5 text-purple-400" />
                    Complete trilogy access with all three books
                  </div>
                  <div className="flex items-center gap-3 text-gray-200">
                    <Headphones className="h-5 w-5 text-blue-400" />
                    Premium audiobook editions with professional narration
                  </div>
                  <div className="flex items-center gap-3 text-gray-200">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Exclusive cosmic content and character deep-dives
                  </div>
                  <div className="flex items-center gap-3 text-gray-200">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Ad-free premium experience
                  </div>
                </div>

                <Button 
                  onClick={handleStartSubscription}
                  disabled={createSubscription.isPending || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {createSubscription.isPending ? "Setting up..." : "Start Premium Subscription"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Complete Your Subscription</h3>
              <p className="text-gray-300">Enter your payment information to unlock premium access</p>
            </div>
            
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#8b5cf6',
                  }
                }
              }}
            >
              <CheckoutForm onSuccess={handleSuccess} />
            </Elements>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}