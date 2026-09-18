import type { PaymentSession, QRCode } from '@/lib/models';
import QRCodeGenerator from 'qrcode';

export const MAX_QR_AMOUNT_PAISE = 199900;

export function parseAmountToPaise(value: string): number | null {
  const cleaned = value.trim().replace(/,/g, '');
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const [rupees, fraction = ''] = cleaned.split('.');
  const paise = Number(rupees) * 100 + Number(fraction.padEnd(2, '0') || 0);
  return Number.isSafeInteger(paise) && paise > 0 ? paise : null;
}

export function isValidUpiId(value: string): boolean {
  return /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/.test(value.trim());
}

export function formatINR(paise: number, withDecimals = true): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

export function splitAmount(totalPaise: number): number[] {
  if (!Number.isSafeInteger(totalPaise) || totalPaise <= 0) return [];
  const amounts: number[] = [];
  let remaining = totalPaise;
  while (remaining > 0) {
    const qrAmount = Math.min(remaining, MAX_QR_AMOUNT_PAISE);
    amounts.push(qrAmount);
    remaining -= qrAmount;
  }
  return amounts;
}

export function createUpiUri(input: {
  receiverUpiId: string; receiverName?: string; amountPaise: number; paymentNote?: string;
}): string {
  const params = new URLSearchParams();
  params.set('pa', input.receiverUpiId.trim());
  if (input.receiverName?.trim()) params.set('pn', input.receiverName.trim());
  params.set('am', (input.amountPaise / 100).toFixed(2));
  params.set('cu', 'INR');
  if (input.paymentNote?.trim()) params.set('tn', input.paymentNote.trim());
  return `upi://pay?${params.toString()}`;
}

export async function createQrDataUrl(uri: string, size = 360): Promise<string> {
  return QRCodeGenerator.toDataURL(uri, {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#173f3b', light: '#fbfaf4' },
  });
}

function createSecureId(prefix: string): string {
  const browserCrypto = globalThis.crypto;
  if (browserCrypto?.randomUUID) {
    return `${prefix}-${browserCrypto.randomUUID()}`;
  }
  if (browserCrypto?.getRandomValues) {
    const values = browserCrypto.getRandomValues(new Uint32Array(4));
    return `${prefix}-${Array.from(values, (value: number) => value.toString(16).padStart(8, '0')).join('')}`;
  }
  throw new Error('Secure randomness is unavailable in this browser.');
}

export async function buildSession(input: {
  receiverUpiId: string; receiverName?: string; paymentNote?: string; totalAmountPaise: number;
}): Promise<PaymentSession> {
  const transactionId = createSecureId('upi');
  const amounts = splitAmount(input.totalAmountPaise);
  const qrCodes: QRCode[] = await Promise.all(amounts.map(async (amountPaise, index) => {
    const upiUri = createUpiUri({ ...input, amountPaise });
    return { qrId: createSecureId(`${transactionId}-${index + 1}`), sequence: index + 1, totalQr: amounts.length, amountPaise, status: 'PAYMENT_NOT_CONFIRMED', upiUri, qrDataUrl: await createQrDataUrl(upiUri) };
  }));
  return {
    transactionId, receiverUpiId: input.receiverUpiId.trim(), receiverName: input.receiverName?.trim() || undefined,
    paymentNote: input.paymentNote?.trim() || undefined, totalAmountPaise: input.totalAmountPaise,
    currency: 'INR', createdAt: new Date().toISOString(), status: 'QR_GENERATED', qrCodes,
  };
}