export type SessionStatus = 'QR_GENERATED';
export type QRStatus = 'PAYMENT_NOT_CONFIRMED';

export interface QRCode {
  qrId: string;
  sequence: number;
  totalQr: number;
  amountPaise: number;
  status: QRStatus;
  upiUri: string;
  qrDataUrl?: string;
}

export interface PaymentSession {
  transactionId: string;
  receiverUpiId: string;
  receiverName?: string;
  paymentNote?: string;
  totalAmountPaise: number;
  currency: 'INR';
  createdAt: string;
  status: SessionStatus;
  qrCodes: QRCode[];
}