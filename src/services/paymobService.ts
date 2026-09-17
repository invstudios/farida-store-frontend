/**
 * Client-side Paymob helper.
 *
 * All Paymob API calls (auth token, order registration, payment key) now
 * happen on the backend via POST /order-details/checkout (paymentMethod:
 * "card") and POST /order-details/initiate-payment. Secrets such as the
 * Paymob API token and integration id must never be shipped to the browser
 * (#179, #180); this module only renders the hosted iframe using the payment
 * key the server returned.
 */

interface IframeUrlInput {
  paymentKey: string;
}

class PaymobService {
  private iframeId: number;

  constructor() {
    this.iframeId = parseInt(process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID || "0");
  }

  getIframeUrl({ paymentKey }: IframeUrlInput): string {
    if (!paymentKey) {
      throw new Error("Missing payment key");
    }
    return `https://accept.paymob.com/api/acceptance/iframes/${this.iframeId}?payment_token=${encodeURIComponent(paymentKey)}`;
  }
}

export default PaymobService;