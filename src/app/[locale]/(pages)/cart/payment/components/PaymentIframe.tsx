"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { useLocale } from "next-intl";
import { Button, Card, CardBody, Spinner } from "@nextui-org/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaymentIframeProps {
  iframeUrl: string;
  onSuccess: (transactionId: string, orderId: string) => void;
  onError: (error: string) => void;
}

const PaymentIframe = ({ iframeUrl, onSuccess, onError }: PaymentIframeProps) => {
  const { payment } = useContext(StoreContext);
  const locale = useLocale();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Make sure the message is from Paymob
      if (event.origin !== "https://accept.paymob.com") {
        return;
      }

      try {
        const data = event.data;

        if (data.type === "payment_success") {
          onSuccess(data.transactionId, data.orderId);
        } else if (data.type === "payment_error") {
          onError(data.message || "Payment failed");
        }
      } catch (error) {
        console.error("Error handling iframe message:", error);
      }
    };

    // Enhanced URL monitoring for Paymob callbacks
    const monitorIframeNavigation = () => {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const iframeWindow = iframeRef.current.contentWindow;

          // Try to access the URL (will fail due to CORS, but that's expected)
          try {
            const currentUrl = iframeWindow.location.href;

            // Check for success/failure patterns in URL
            if (currentUrl.includes("success=true") || currentUrl.includes("txn_response_code=APPROVED")) {
              const urlParams = new URLSearchParams(currentUrl.split("?")[1] || "");
              const transactionId = urlParams.get("id") || urlParams.get("txn_response_code") || "";
              const orderId = urlParams.get("order") || urlParams.get("merchant_order_id") || "";

              if (transactionId) {
                onSuccess(transactionId, orderId);
              }
            } else if (currentUrl.includes("success=false") || currentUrl.includes("txn_response_code=DECLINED")) {
              onError("Payment was declined or failed");
            }
          } catch (corsError) {
            // Expected CORS error - iframe navigation is restricted
            // We'll rely on postMessage instead
          }
        }
      } catch (error) {
        // Silently handle errors as they're expected due to cross-origin restrictions
      }
    };

    // Listen for iframe load events
    const handleIframeLoad = () => {
      monitorIframeNavigation();
    };

    // Set up event listeners
    window.addEventListener("message", handleMessage);

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", handleIframeLoad);
    }

    // Periodic check as fallback (less frequent to reduce overhead)
    const urlCheckInterval = setInterval(monitorIframeNavigation, 3000);

    // Timeout for payment (15 minutes)
    const paymentTimeout = setTimeout(() => {
      onError("Payment timeout - please try again");
    }, 15 * 60 * 1000);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (iframeRef.current) {
        iframeRef.current.removeEventListener("load", handleIframeLoad);
      }
      clearInterval(urlCheckInterval);
      clearTimeout(paymentTimeout);
    };
  }, [onSuccess, onError]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleGoBack = () => {
    payment.resetPaymentState();
  };

  return (
    <>
      <div className={`min-h-screen bg-gray-50 ${locale === "ar" ? "rtl" : "ltr"}`}>
        <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            startContent={locale === "ar" ? <FaArrowRight /> : <FaArrowLeft />}
            className="mb-4"
          >
            {locale === "ar" ? "العودة" : "Go Back"}
          </Button>
          
          <h1 className="text-2xl font-bold text-center">
            {locale === "ar" ? "إتمام الدفع" : "Complete Payment"}
          </h1>
          
          <p className="text-center text-gray-600 mt-2">
            {locale === "ar" 
              ? "أدخل بيانات بطاقتك لإتمام عملية الدفع بأمان"
              : "Enter your card details to complete the payment securely"
            }
          </p>
        </div>

        {/* Payment Status */}
        {payment.isProcessingPayment && (
          <Card className="mb-6">
            <CardBody className="text-center py-8">
              <Spinner size="lg" className="mb-4" />
              <p className="text-lg font-semibold">
                {locale === "ar" ? "جاري معالجة الدفع..." : "Processing payment..."}
              </p>
              <p className="text-gray-600 mt-2">
                {locale === "ar" 
                  ? "يرجى عدم إغلاق هذه الصفحة"
                  : "Please do not close this page"
                }
              </p>
            </CardBody>
          </Card>
        )}

        {/* Payment Iframe */}
        <Card className="overflow-hidden">
          <CardBody className="p-0">
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Spinner size="lg" className="mb-4" />
                  <p className="text-lg">
                    {locale === "ar" ? "جاري تحميل نموذج الدفع..." : "Loading payment form..."}
                  </p>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              width="100%"
              height="600"
              onLoad={handleIframeLoad}
              className={`${isLoading ? "hidden" : "block"} w-full border-0`}
              title="Payment Form"
              sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation allow-modals allow-popups"
            />
          </CardBody>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700">
              {locale === "ar" 
                ? "اتصال آمن ومشفر - بيانات بطاقتك محمية"
                : "Secure encrypted connection - Your card data is protected"
              }
            </span>
          </div>
        </div>

        {/* Payment Error */}
        {payment.paymentError && (
          <Card className="mt-6 border-red-200">
            <CardBody className="bg-red-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  {locale === "ar" ? "حدث خطأ في الدفع" : "Payment Error"}
                </h3>
                <p className="text-red-600 mb-4">{payment.paymentError}</p>
                <Button
                  color="danger"
                  variant="bordered"
                  onClick={handleGoBack}
                >
                  {locale === "ar" ? "المحاولة مرة أخرى" : "Try Again"}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {locale === "ar"
              ? "في حالة مواجهة أي مشاكل، يرجى التواصل مع خدمة العملاء"
              : "If you encounter any issues, please contact customer support"
            }
          </p>
        </div>
        </div>
      </div>
    </>
  );
};

export default observer(PaymentIframe);
