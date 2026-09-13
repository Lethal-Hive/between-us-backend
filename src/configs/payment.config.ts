import { registerAs } from '@nestjs/config';

export const paymentConfigRegistration = registerAs(
  'payment',
  (): Record<string, any> => ({
    paymob: {
      hmac: process.env.PAYMOB_HMAC,
      apiKey: process.env.PAYMOB_API_KEY,
      secretKey: process.env.PAYMOB_SECRET_KEY,
      publicKey: process.env.PAYMOB_PUBLIC_KEY,
      merchantId: process.env.PAYMOB_MERCHANT_ID,
      cardIntegration: isNaN(process.env.PAYMOB_CARD_INTEGRATION as any)
        ? process.env.PAYMOB_CARD_INTEGRATION
        : parseInt(process.env.PAYMOB_CARD_INTEGRATIO as any),
      walletIntegration: isNaN(process.env.PAYMOB_WALLET_INTEGRATION as any)
        ? process.env.PAYMOB_WALLET_INTEGRATION
        : parseInt(process.env.PAYMOB_WALLET_INTEGRATION as any),
      kioskIntegration: process.env.PAYMOB_KIOSK_INTEGRATION ?? 'kiosk',
      endpoint: process.env.PAYMOB_ENDPOINT ?? 'https://accept.paymob.com',
      redirectUrl: process.env.PAYMOB_REDIRECT_URL,
      overrideUrl: process.env.PAYMOB_OVERRIDE_URL,
      overrideProcessedUrl:
        process.env.PAYMOB_OVERRIDE_PROCESSED_URL ??
        'https://onair.lethalhive.com/v1/payment/paymob/callback',
    },
    //
  }),
);
//
