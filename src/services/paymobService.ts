interface PaymobAuthResponse {
  token: string;
}

interface PaymobOrderResponse {
  id: number;
  created_at: string;
  delivery_needed: boolean;
  merchant: {
    id: number;
    created_at: string;
    phones: string[];
    company_emails: string[];
    company_name: string;
    state: string;
    country: string;
    city: string;
    postal_code: string;
    street: string;
  };
  collector: any;
  amount_cents: number;
  shipping_data: {
    id: number;
    first_name: string;
    last_name: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    city: string;
    state: string;
    country: string;
    email: string;
    phone_number: string;
    postal_code: string;
    extra_description: string;
  };
  currency: string;
  is_payment_locked: boolean;
  is_return: boolean;
  is_cancel: boolean;
  is_returned: boolean;
  is_canceled: boolean;
  merchant_order_id: string;
  wallet_notification: any;
  paid_amount_cents: number;
  notify_user_with_email: boolean;
  items: Array<{
    name: string;
    description: string;
    amount_cents: number;
    quantity: number;
  }>;
  order_url: string;
  commission_fees: number;
  delivery_fees_cents: number;
  delivery_vat_cents: number;
  payment_method: string;
  merchant_staff_tag: any;
  api_source: string;
  data: any;
}

interface PaymobPaymentKeyResponse {
  token: string;
}

interface PaymobOrderData {
  auth_token: string;
  delivery_needed: boolean;
  amount_cents: number;
  currency: string;
  merchant_order_id: string;
  items: Array<{
    name: string;
    description: string;
    amount_cents: number;
    quantity: number;
  }>;
  shipping_data: {
    apartment: string;
    email: string;
    floor: string;
    first_name: string;
    street: string;
    building: string;
    phone_number: string;
    postal_code: string;
    extra_description: string;
    city: string;
    country: string;
    last_name: string;
    state: string;
  };
}

interface PaymentKeyData {
  auth_token: string;
  amount_cents: number;
  expiration: number;
  order_id: number;
  billing_data: {
    apartment: string;
    email: string;
    floor: string;
    first_name: string;
    street: string;
    building: string;
    phone_number: string;
    shipping_method: string;
    postal_code: string;
    city: string;
    country: string;
    last_name: string;
    state: string;
  };
  currency: string;
  integration_id: number;
}

class PaymobService {
  private apiKey: string;
  private integrationId: number;
  private iframeId: number;
  private baseUrl: string = 'https://accept.paymob.com/api';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_PAYMOB_API_TOKEN || '';
    this.integrationId = parseInt(process.env.NEXT_PUBLIC_PAYMOB_INTEGRATION_ID || '0');
    this.iframeId = parseInt(process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID || '0');
  }

  // Step 1: Authentication Request
  async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data: PaymobAuthResponse = await response.json();
      return data.token;
    } catch (error) {
      console.error('Paymob authentication error:', error);
      throw error;
    }
  }

  // Step 2: Order Registration API
  async createOrder(orderData: PaymobOrderData): Promise<PaymobOrderResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ecommerce/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.statusText}`);
      }

      const data: PaymobOrderResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Paymob order creation error:', error);
      throw error;
    }
  }

  // Step 3: Payment Key Request
  async getPaymentKey(paymentData: PaymentKeyData): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });


      if (!response.ok) {
        throw new Error(`Payment key generation failed: ${response.ok}`);
      }

      const data: PaymobPaymentKeyResponse = await response.json();
      return data.token;
    } catch (error) {
      console.error('Paymob payment key error:', error);
      throw error;
    }
  }

  // Complete payment process
  async initiatePayment(orderDetails: {
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
  }): Promise<string> {
    try {
      // Step 1: Get auth token
      const authToken = await this.authenticate();

      // Step 2: Create order
      const orderData: PaymobOrderData = {
        auth_token: authToken,
        delivery_needed: true,
        amount_cents: orderDetails.amount * 100, // Convert to cents
        currency: 'EGP',
        merchant_order_id: orderDetails.orderId,
        items: orderDetails.items,
        shipping_data: {
          apartment: orderDetails.customerData.apartment,
          email: orderDetails.customerData.email,
          floor: orderDetails.customerData.floor,
          first_name: orderDetails.customerData.first_name,
          street: orderDetails.customerData.street,
          building: orderDetails.customerData.building,
          phone_number: orderDetails.customerData.phone,
          postal_code: orderDetails.customerData.postal_code,
          extra_description: '',
          city: orderDetails.customerData.city,
          country: orderDetails.customerData.country,
          last_name: orderDetails.customerData.last_name,
          state: orderDetails.customerData.state,
        },
      };

      const order = await this.createOrder(orderData);

      // Step 3: Get payment key
      const paymentKeyData: PaymentKeyData = {
        auth_token: authToken,
        amount_cents: orderDetails.amount * 100,
        expiration: 3600, // 1 hour
        order_id: order.id,
        billing_data: {
          apartment: orderDetails.customerData.apartment || "NA",
          email: orderDetails.customerData.email || "NA",
          floor: orderDetails.customerData.floor || "NA",
          first_name: orderDetails.customerData.first_name || "NA",
          street: orderDetails.customerData.street || "NA",
          building: orderDetails.customerData.building || "NA",
          phone_number: orderDetails.customerData.phone || "NA",
          shipping_method: 'PKG',
          postal_code: orderDetails.customerData.postal_code || "NA",
          city: orderDetails.customerData.city || "NA",
          country: orderDetails.customerData.country || "NA",
          last_name: orderDetails.customerData.last_name || "NA",
          state: orderDetails.customerData.state || "NA",
        },
        currency: 'EGP',
        integration_id: this.integrationId,
      };

      const paymentKey = await this.getPaymentKey(paymentKeyData);
      return paymentKey;
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
    }
  }

  // Generate iframe URL
  getIframeUrl(paymentKey: string): string {
    return `https://accept.paymob.com/api/acceptance/iframes/${this.iframeId}?payment_token=${paymentKey}`;
  }
}

export default PaymobService;
