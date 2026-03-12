import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Package, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PurchaseSuccess() {
  const { language } = useLanguage();
  const [purchaseData, setPurchaseData] = useState<any>(null);

  const translations = {
    en: {
      title: 'Purchase Successful!',
      subtitle: 'Thank you for your order',
      orderComplete: 'Your order has been completed successfully',
      downloadReady: 'Your digital content is ready for download',
      shippingInfo: 'Your physical book will be shipped within 2-3 business days',
      downloadNow: 'Download Now',
      backToBookstore: 'Back to Bookstore',
      backToHome: 'Back to Home',
      orderNumber: 'Order Number',
      whatNext: 'What\'s Next?',
      accessContent: 'Access your purchased content from your library',
      trackShipping: 'Track your shipment via email confirmation',
      enjoyReading: 'Enjoy your cosmic journey!'
    },
    es: {
      title: '¡Compra Exitosa!',
      subtitle: 'Gracias por tu pedido',
      orderComplete: 'Tu pedido se ha completado con éxito',
      downloadReady: 'Tu contenido digital está listo para descargar',
      shippingInfo: 'Tu libro físico será enviado en 2-3 días hábiles',
      downloadNow: 'Descargar Ahora',
      backToBookstore: 'Volver a la Librería',
      backToHome: 'Volver al Inicio',
      orderNumber: 'Número de Pedido',
      whatNext: '¿Qué Sigue?',
      accessContent: 'Accede a tu contenido comprado desde tu biblioteca',
      trackShipping: 'Rastrea tu envío a través del correo de confirmación',
      enjoyReading: '¡Disfruta tu viaje cósmico!'
    }
  };

  const trans = translations[language as keyof typeof translations];

  useEffect(() => {
    // Get purchase data from URL params or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    
    if (paymentIntent) {
      // In a real app, you'd fetch the purchase details from your API
      const mockPurchaseData = {
        id: paymentIntent,
        itemName: 'Eternal Chase: The Pursuit for Love',
        itemType: 'digital_book',
        price: 9.99,
        isDigital: true
      };
      setPurchaseData(mockPurchaseData);
    }
  }, []);

  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    alert('Download would start here - redirect to digital library');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-green-600 mb-2">
              {trans.title}
            </h1>
            <p className="text-xl text-purple-200">
              {trans.subtitle}
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-green-500/20 mb-6">
              <CardHeader>
                <CardTitle className="text-green-100 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {trans.orderComplete}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {purchaseData && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Item:</span>
                      <span className="text-purple-100 font-medium">{purchaseData.itemName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Type:</span>
                      <span className="text-purple-100">{purchaseData.itemType.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">Amount:</span>
                      <span className="text-purple-100 font-semibold">${purchaseData.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200">{trans.orderNumber}:</span>
                      <span className="text-purple-100 font-mono text-sm">{purchaseData.id.slice(-8).toUpperCase()}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            {/* Digital Download Card */}
            {purchaseData?.isDigital && (
              <Card className="bg-gradient-to-r from-green-900/50 to-purple-900/50 border-green-400/40">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="w-6 h-6 text-green-400" />
                    <div>
                      <h3 className="text-green-100 font-semibold">{trans.downloadReady}</h3>
                      <p className="text-green-200 text-sm">Access your digital content immediately</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {trans.downloadNow}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Shipping Info Card */}
            {purchaseData && !purchaseData.isDigital && (
              <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-400/40">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="text-blue-100 font-semibold">Shipping Information</h3>
                      <p className="text-blue-200 text-sm">{trans.shippingInfo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-slate-800/50 border-purple-500/20 mb-6">
              <CardHeader>
                <CardTitle className="text-purple-100">{trans.whatNext}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5" />
                  <p className="text-purple-200">{trans.accessContent}</p>
                </div>
                {!purchaseData?.isDigital && (
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5" />
                    <p className="text-purple-200">{trans.trackShipping}</p>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5" />
                  <p className="text-purple-200">{trans.enjoyReading}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              onClick={() => window.location.href = '/bookstore'}
              variant="outline"
              className="flex-1 border-purple-500/40 text-purple-200 hover:bg-purple-800/20"
            >
              {trans.backToBookstore}
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Home className="w-4 h-4 mr-2" />
              {trans.backToHome}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}