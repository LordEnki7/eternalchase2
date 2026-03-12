import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Using a simple div instead of Separator component
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Download, Headphones, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { shippingAddressSchema, type ShippingAddress } from '@shared/schema';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutData {
  itemId: string;
  itemType: string;
  itemName: string;
  price: number;
  requiresShipping: boolean;
}

const CheckoutForm = ({ checkoutData }: { checkoutData: CheckoutData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const translations = {
    en: {
      processing: 'Processing payment...',
      paymentFailed: 'Payment Failed',
      paymentSuccessful: 'Payment Successful',
      thankYou: 'Thank you for your purchase!',
      completePayment: 'Complete Payment',
      email: 'Email Address',
      shippingInfo: 'Shipping Information',
      fullName: 'Full Name',
      streetAddress: 'Street Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      country: 'Country'
    },
    es: {
      processing: 'Procesando pago...',
      paymentFailed: 'Pago Fallido',
      paymentSuccessful: 'Pago Exitoso',
      thankYou: '¡Gracias por tu compra!',
      completePayment: 'Completar Pago',
      email: 'Correo Electrónico',
      shippingInfo: 'Información de Envío',
      fullName: 'Nombre Completo',
      streetAddress: 'Dirección',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: 'Código Postal',
      country: 'País'
    }
  };

  const trans = translations[language as keyof typeof translations];



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // Validate shipping address if required
    let validatedShippingAddress = null;
    if (checkoutData.requiresShipping) {
      try {
        validatedShippingAddress = shippingAddressSchema.parse(shippingAddress);
      } catch (error) {
        toast({
          title: "Invalid Shipping Information",
          description: "Please fill in all required shipping fields.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/purchase-success`,
        receipt_email: email,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: trans.paymentFailed,
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: trans.paymentSuccessful,
        description: trans.thankYou,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-100">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-purple-200">{trans.email}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-700 border-purple-500/30 text-purple-100"
              placeholder="your-email@example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information (only for physical books) */}
      {checkoutData.requiresShipping && (
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-100">{trans.shippingInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-purple-200">{trans.fullName}</Label>
              <Input
                id="fullName"
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                required
                className="bg-slate-700 border-purple-500/30 text-purple-100"
              />
            </div>
            <div>
              <Label htmlFor="streetAddress" className="text-purple-200">{trans.streetAddress}</Label>
              <Input
                id="streetAddress"
                value={shippingAddress.streetAddress}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
                required
                className="bg-slate-700 border-purple-500/30 text-purple-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-purple-200">{trans.city}</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  required
                  className="bg-slate-700 border-purple-500/30 text-purple-100"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-purple-200">{trans.state}</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  required
                  className="bg-slate-700 border-purple-500/30 text-purple-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode" className="text-purple-200">{trans.zipCode}</Label>
                <Input
                  id="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  required
                  className="bg-slate-700 border-purple-500/30 text-purple-100"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-purple-200">{trans.country}</Label>
                <Input
                  id="country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                  required
                  className="bg-slate-700 border-purple-500/30 text-purple-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Information */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-100">Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement className="stripe-payment-element" />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6"
      >
        {isProcessing ? trans.processing : `${trans.completePayment} - $${checkoutData.price.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Get checkout data from sessionStorage
    const storedData = sessionStorage.getItem('checkoutData');
    if (!storedData) {
      window.location.href = '/bookstore';
      return;
    }

    const data: CheckoutData = JSON.parse(storedData);
    setCheckoutData(data);

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", {
      amount: data.price,
      itemId: data.itemId,
      itemType: data.itemType,
      itemName: data.itemName,
      email: 'placeholder@example.com', // Will be updated in the form
      ...(data.requiresShipping && { shippingAddress: null })
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
      });
  }, []);

  if (!clientSecret || !checkoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/bookstore'}
            className="text-purple-300 hover:text-purple-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookstore
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-2">
              Complete Your Purchase
            </h1>
            <p className="text-purple-200">
              Secure checkout powered by Stripe
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-slate-800/50 border-purple-500/20 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-purple-100">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    {(function getProductIcon(itemType: string) {
                      switch (itemType) {
                        case 'hardcover_book':
                        case 'paperback_book':
                          return <BookOpen className="w-5 h-5 text-purple-400" />;
                        case 'digital_book':
                          return <Download className="w-5 h-5 text-green-400" />;
                        case 'audiobook':
                          return <Headphones className="w-5 h-5 text-pink-400" />;
                        default:
                          return <Package className="w-5 h-5 text-blue-400" />;
                      }
                    })(checkoutData.itemType)}
                    <div className="flex-1">
                      <h3 className="text-purple-100 font-medium text-sm leading-tight">
                        {checkoutData.itemName}
                      </h3>
                      <div className="mt-2">
                        {(function getProductBadge(itemType: string) {
                          switch (itemType) {
                            case 'hardcover_book':
                              return <Badge className="bg-purple-600">Hardcover</Badge>;
                            case 'paperback_book':
                              return <Badge className="bg-blue-600">Paperback</Badge>;
                            case 'digital_book':
                              return <Badge className="bg-green-600">Digital</Badge>;
                            case 'audiobook':
                              return <Badge className="bg-pink-600">Audiobook</Badge>;
                            default:
                              return <Badge className="bg-gray-600">Bundle</Badge>;
                          }
                        })(checkoutData.itemType)}
                      </div>
                    </div>
                    <div className="text-purple-100 font-semibold">
                      ${checkoutData.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="h-px bg-purple-500/20" />
                  
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-purple-100">Total</span>
                    <span className="text-purple-100">${checkoutData.price.toFixed(2)}</span>
                  </div>

                  {checkoutData.requiresShipping && (
                    <div className="text-sm text-purple-300 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Free shipping included</span>
                    </div>
                  )}

                  {!checkoutData.requiresShipping && (
                    <div className="text-sm text-purple-300 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Instant download after payment</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm checkoutData={checkoutData} />
              </Elements>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Stripe Element Styles */}
      <style>{`
        .stripe-payment-element {
          --p-color-text: rgb(196 181 253);
          --p-color-text-secondary: rgb(147 129 255);
          --p-color-background: rgb(51 65 85);
          --p-color-border: rgba(139 92 246 / 0.3);
          --p-color-border-focus: rgba(147 51 234 / 0.6);
        }
      `}</style>
    </div>
  );
}