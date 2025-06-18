import { makeAutoObservable, runInAction } from 'mobx';
import PaymobService from '@/services/paymobService';
import {
  validatePaymentData,
  validatePaymobCallback,
  validateShippingData,
  formatPaymentAmount,
  generateOrderId,
  maskSensitiveData,
  validatePaymentConfig
} from '@/utils/paymentValidation';

export interface PaymentData {
  amount: number;
  orderId: string;
  customerData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  items: Array<{
    name: string;
    description: string;
    amount_cents: number;
    quantity: number;
  }>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  amount?: number;
  message?: string;
}

class PaymentStore {
  // Loading states
  isInitiatingPayment = false;
  isProcessingPayment = false;
  
  // Payment data
  currentPaymentKey: string | null = null;
  currentIframeUrl: string | null = null;
  paymentResult: PaymentResult | null = null;
  
  // Error handling
  paymentError: string | null = null;
  
  // Services
  private paymobService: PaymobService;

  constructor() {
    makeAutoObservable(this);
    this.paymobService = new PaymobService();

  }

  // Reset payment state
  resetPaymentState = () => {
    runInAction(() => {
      this.isInitiatingPayment = false;
      this.isProcessingPayment = false;
      this.currentPaymentKey = null;
      this.currentIframeUrl = null;
      this.paymentResult = null;
      this.paymentError = null;
    });
  };

  // Initiate payment process
  initiatePayment = async (paymentData: PaymentData): Promise<string | null> => {
    runInAction(() => {
      this.isInitiatingPayment = true;
      this.paymentError = null;
    });

    try {
      // Validate payment configuration
      const configValidation = validatePaymentConfig();
      if (!configValidation.isValid) {
        throw new Error(`Configuration error: ${configValidation.errors.join(', ')}`);
      }

      // Validate payment data
      const validation = validatePaymentData({
        amount: paymentData.amount,
        currency: 'EGP',
        orderId: paymentData.orderId,
        customerEmail: paymentData.customerData.email,
        customerPhone: paymentData.customerData.phone
      });

      if (!validation.isValid) {
        throw new Error(`Validation error: ${validation.errors.join(', ')}`);
      }

      // Log warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Payment validation warnings:', validation.warnings);
      }

      // Validate shipping data
      const shippingValidation = validateShippingData(paymentData.customerData);
      if (!shippingValidation.isValid) {
        throw new Error(`Shipping data error: ${shippingValidation.errors.join(', ')}`);
      }

      // Format amount to ensure it's valid
      const formattedPaymentData = {
        ...paymentData,
        amount: formatPaymentAmount(paymentData.amount)
      };

      // Log masked data for debugging
      console.log('Initiating payment with data:', maskSensitiveData(formattedPaymentData));

      const paymentKey = await this.paymobService.initiatePayment(formattedPaymentData);
      const iframeUrl = this.paymobService.getIframeUrl(paymentKey);

      runInAction(() => {
        this.currentPaymentKey = paymentKey;
        this.currentIframeUrl = iframeUrl;
        this.isInitiatingPayment = false;
      });

      return paymentKey;
    } catch (error) {
      console.error('Payment initiation error:', error);
      runInAction(() => {
        this.paymentError = error instanceof Error ? error.message : 'Payment initiation failed';
        this.isInitiatingPayment = false;
      });
      return null;
    }
  };

  // Handle payment callback
  handlePaymentCallback = (params: URLSearchParams) => {
    runInAction(() => {
      this.isProcessingPayment = true;
    });

    try {
      // Validate callback parameters
      const validation = validatePaymobCallback(params);
      if (!validation.isValid) {
        console.error('Invalid callback parameters:', validation.errors);
        throw new Error(`Invalid callback: ${validation.errors.join(', ')}`);
      }

      // Log warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Callback validation warnings:', validation.warnings);
      }

      const success = params.get('success');
      const transactionId = params.get('id');
      const orderId = params.get('order');
      const amount = params.get('amount_cents');
      const pending = params.get('pending');
      const errorOccurred = params.get('error_occured');

      let paymentResult: PaymentResult;

      // Log callback data for debugging (masked)
      console.log('Processing payment callback:', maskSensitiveData({
        success,
        transactionId,
        orderId,
        amount,
        pending,
        errorOccurred
      }));

      if (success === 'true' && errorOccurred !== 'true') {
        paymentResult = {
          success: true,
          transactionId: transactionId || undefined,
          orderId: orderId || undefined,
          amount: amount ? parseInt(amount) / 100 : undefined,
          message: 'Payment completed successfully'
        };
      } else if (pending === 'true') {
        paymentResult = {
          success: false,
          transactionId: transactionId || undefined,
          orderId: orderId || undefined,
          amount: amount ? parseInt(amount) / 100 : undefined,
          message: 'Payment is pending'
        };
      } else {
        paymentResult = {
          success: false,
          transactionId: transactionId || undefined,
          orderId: orderId || undefined,
          amount: amount ? parseInt(amount) / 100 : undefined,
          message: errorOccurred === 'true' ? 'Payment error occurred' : 'Payment failed'
        };
      }

      runInAction(() => {
        this.paymentResult = paymentResult;
        this.isProcessingPayment = false;
      });

      return paymentResult;
    } catch (error) {
      console.error('Payment callback processing error:', error);

      const errorResult: PaymentResult = {
        success: false,
        message: 'Error processing payment callback'
      };

      runInAction(() => {
        this.paymentResult = errorResult;
        this.paymentError = error instanceof Error ? error.message : 'Callback processing failed';
        this.isProcessingPayment = false;
      });

      return errorResult;
    }
  };

  // Verify payment status (optional - for additional security)
  verifyPayment = async (transactionId: string): Promise<boolean> => {
    try {
      // This would typically call your backend to verify the payment
      // For now, we'll just return true if we have a transaction ID
      return !!transactionId;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  };

  // Get payment status text for UI
  getPaymentStatusText = (locale: string = 'en'): string => {
    if (this.isInitiatingPayment) {
      return locale === 'ar' ? 'جاري تحضير الدفع...' : 'Preparing payment...';
    }
    
    if (this.isProcessingPayment) {
      return locale === 'ar' ? 'جاري معالجة الدفع...' : 'Processing payment...';
    }
    
    if (this.paymentError) {
      return locale === 'ar' ? 'حدث خطأ في الدفع' : 'Payment error occurred';
    }
    
    if (this.paymentResult) {
      if (this.paymentResult.success) {
        return locale === 'ar' ? 'تم الدفع بنجاح' : 'Payment successful';
      } else {
        return locale === 'ar' ? 'فشل الدفع' : 'Payment failed';
      }
    }
    
    return locale === 'ar' ? 'جاهز للدفع' : 'Ready to pay';
  };

  // Format amount for display
  formatAmount = (amount: number, currency: string = 'EGP'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };
}

export default PaymentStore;
