import { describe, expect, it } from 'vitest';
import {
  buildSession,
  createUpiUri,
  isValidUpiId,
  parseAmountToPaise,
  splitAmount,
} from './upi';

const rupees = (value: number) => value * 100;

describe('splitAmount', () => {
  const cases: Array<[number, number[]]> = [
    [1, [1]],
    [100, [100]],
    [500, [500]],
    [1998, [1998]],
    [1999, [1999]],
    [2000, [1999, 1]],
    [2001, [1999, 2]],
    [3998, [1999, 1999]],
    [3999, [1999, 1999, 1]],
    [4000, [1999, 1999, 2]],
    [4001, [1999, 1999, 3]],
    [5000, [1999, 1999, 1002]],
    [10000, [1999, 1999, 1999, 1999, 1999, 5]],
  ];

  it.each(cases)('splits ₹%s into the minimum greedy QR set', (amount, expected) => {
    expect(splitAmount(rupees(amount))).toEqual(expected.map(rupees));
  });

  it('preserves paise precision', () => {
    expect(splitAmount(10050)).toEqual([10050]);
    expect(splitAmount(199999)).toEqual([199900, 99]);
  });
});

describe('amount and UPI validation', () => {
  it('parses up to two decimal places into paise', () => {
    expect(parseAmountToPaise('100.50')).toBe(10050);
    expect(parseAmountToPaise('1,999.99')).toBe(199999);
    expect(parseAmountToPaise('0')).toBeNull();
    expect(parseAmountToPaise('-1')).toBeNull();
    expect(parseAmountToPaise('10.123')).toBeNull();
  });

  it('performs syntax-only UPI validation', () => {
    expect(isValidUpiId('shop@upi')).toBe(true);
    expect(isValidUpiId('receiver@bank')).toBe(true);
    expect(isValidUpiId('missing-at')).toBe(false);
    expect(isValidUpiId('bad value@bank')).toBe(false);
  });

  it('URL-encodes UPI payment parameters', () => {
    const uri = createUpiUri({
      receiverUpiId: 'shop@upi',
      receiverName: 'ABC Store',
      amountPaise: 199900,
      paymentNote: 'Product purchase',
    });
    expect(uri).toContain('pa=shop%40upi');
    expect(uri).toContain('pn=ABC+Store');
    expect(uri).toContain('am=1999.00');
    expect(uri).toContain('cu=INR');
    expect(uri).toContain('tn=Product+purchase');
  });

  it('builds a persisted-ready session with one exact URI per QR', async () => {
    const session = await buildSession({
      receiverUpiId: 'shop@upi',
      receiverName: 'ABC Store',
      paymentNote: 'Product purchase',
      totalAmountPaise: 400000,
    });
    expect(session.status).toBe('QR_GENERATED');
    expect(session.qrCodes.map((qr) => qr.amountPaise)).toEqual([199900, 199900, 200]);
    expect(session.qrCodes).toHaveLength(3);
    expect(session.qrCodes.every((qr) => qr.qrDataUrl?.startsWith('data:image/png;base64,'))).toBe(true);
    expect(session.qrCodes[2]?.upiUri).toContain('am=2.00');
    expect(session.qrCodes.every((qr) => qr.status === 'PAYMENT_NOT_CONFIRMED')).toBe(true);
  });
});