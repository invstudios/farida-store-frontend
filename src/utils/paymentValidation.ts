/**
 * Payment validation utilities for Paymob integration
 */

export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerPhone: string;
}

/**
 * Validate payment data before sending to Paymob
 */
export function validatePaymentData(data: PaymentData): PaymentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate amount
  if (!data.amount || data.amount <= 0) {
    errors.push("Amount must be greater than 0");
  }

  if (data.amount > 999999) {
    warnings.push("Large amount detected - please verify");
  }

  // Validate currency
  if (!data.currency) {
    errors.push("Currency is required");
  } else if (data.currency !== "EGP") {
    warnings.push("Currency is not EGP - please verify");
  }

  // Validate order ID
  if (!data.orderId || data.orderId.trim().length === 0) {
    errors.push("Order ID is required");
  }

  if (data.orderId && data.orderId.length > 50) {
    errors.push("Order ID must be less than 50 characters");
  }

  // Validate customer email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.customerEmail) {
    errors.push("Customer email is required");
  } else if (!emailRegex.test(data.customerEmail)) {
    errors.push("Invalid email format");
  }

  // Validate customer phone
  const phoneRegex = /^(\+20|0)?1[0-9]{9}$/;
  if (!data.customerPhone) {
    errors.push("Customer phone is required");
  } else if (!phoneRegex.test(data.customerPhone.replace(/\s/g, ""))) {
    warnings.push("Phone number format may be invalid for Egypt");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate Paymob callback parameters
 */
export function validatePaymobCallback(params: URLSearchParams): PaymentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required parameters
  const requiredParams = ['amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction', 'id', 'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded', 'is_standalone_payment', 'is_voided', 'order', 'owner', 'pending', 'source_data_pan', 'source_data_sub_type', 'source_data_type', 'success'];

  for (const param of requiredParams) {
    if (!params.has(param)) {
      errors.push(`Missing required parameter: ${param}`);
    }
  }

  // Validate success parameter
  const success = params.get('success');
  if (success !== 'true' && success !== 'false') {
    errors.push("Invalid success parameter");
  }

  // Validate amount
  const amountCents = params.get('amount_cents');
  if (amountCents && (isNaN(Number(amountCents)) || Number(amountCents) <= 0)) {
    errors.push("Invalid amount_cents parameter");
  }

  // Validate transaction ID
  const transactionId = params.get('id');
  if (transactionId && isNaN(Number(transactionId))) {
    errors.push("Invalid transaction ID");
  }

  // Check for error indicators
  const errorOccurred = params.get('error_occured');
  if (errorOccurred === 'true') {
    warnings.push("Error occurred during payment processing");
  }

  const pending = params.get('pending');
  if (pending === 'true') {
    warnings.push("Payment is pending");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Sanitize and format payment amount
 */
export function formatPaymentAmount(amount: number): number {
  // Round to 2 decimal places and ensure it's positive
  const formatted = Math.round(Math.abs(amount) * 100) / 100;
  
  // Ensure minimum amount (1 EGP)
  return Math.max(formatted, 1);
}

/**
 * Generate secure order ID
 */
export function generateOrderId(prefix: string = "ORDER"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Validate shipping data for payment
 */
export function validateShippingData(shippingData: any): PaymentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for both possible field names (phone_number or phone)
  const requiredFields = ['first_name', 'last_name', 'email', 'street', 'city', 'country'];

  for (const field of requiredFields) {
    if (!shippingData[field] || shippingData[field].trim().length === 0) {
      errors.push(`${field} is required`);
    }
  }

  // Check phone field (can be phone_number or phone)
  const phoneField = shippingData.phone_number || shippingData.phone;
  if (!phoneField || phoneField.trim().length === 0) {
    errors.push("phone is required");
  }

  // Validate specific fields
  if (shippingData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
    errors.push("Invalid email format in shipping data");
  }

  if (phoneField && phoneField.length < 10) {
    warnings.push("Phone number may be too short");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Check if payment method is supported
 */
export function isSupportedPaymentMethod(method: string): boolean {
  const supportedMethods = ['card', 'cod', 'wallet'];
  return supportedMethods.includes(method.toLowerCase());
}

/**
 * Calculate payment fees (if any)
 */
export function calculatePaymentFees(amount: number, method: string): number {
  switch (method.toLowerCase()) {
    case 'card':
      // Example: 2.9% + 2 EGP for card payments
      return Math.round((amount * 0.029 + 2) * 100) / 100;
    case 'cod':
      // Example: 10 EGP flat fee for COD
      return 10;
    default:
      return 0;
  }
}

/**
 * Mask sensitive payment data for logging
 */
export function maskSensitiveData(data: any): any {
  const masked = { ...data };
  
  // Mask card numbers
  if (masked.card_number) {
    masked.card_number = masked.card_number.replace(/\d(?=\d{4})/g, '*');
  }
  
  // Mask CVV
  if (masked.cvv) {
    masked.cvv = '***';
  }
  
  // Mask API keys
  if (masked.api_key) {
    masked.api_key = masked.api_key.substring(0, 8) + '***';
  }
  
  return masked;
}

/**
 * Validate environment configuration
 */
export function validatePaymentConfig(): PaymentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  if (!process.env.NEXT_PUBLIC_PAYMOB_API_TOKEN) {
    errors.push("NEXT_PUBLIC_PAYMOB_API_TOKEN is not configured");
  }

  if (!process.env.NEXT_PUBLIC_PAYMOB_INTEGRATION_ID) {
    errors.push("NEXT_PUBLIC_PAYMOB_INTEGRATION_ID is not configured");
  }

  if (!process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID) {
    errors.push("NEXT_PUBLIC_PAYMOB_IFRAME_ID is not configured");
  }

  // Check if running in development
  if (process.env.NODE_ENV === 'development') {
    warnings.push("Running in development mode - use test credentials only");
  }

  // Check API token format (basic validation)
  const apiToken = process.env.NEXT_PUBLIC_PAYMOB_API_TOKEN;
  if (apiToken && apiToken.length < 20) {
    warnings.push("API token seems too short - please verify");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
