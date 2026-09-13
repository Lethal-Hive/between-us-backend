import { createHash, randomBytes } from 'crypto';
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function toBase62(buf: Buffer, length: number): string {
  let num = BigInt('0x' + buf.toString('hex'));
  let result = '';
  const base = BigInt(62);

  while (result.length < length) {
    result = BASE62[Number(num % base)] + result;
    num /= base;
  }

  return result.slice(-length);
}

function buildEntropyBuffer(): Buffer {
  const random = randomBytes(32);

  const hrtime = process.hrtime.bigint(); // nanoseconds since process start
  const hrtimeBuf = Buffer.alloc(8);
  hrtimeBuf.writeBigUInt64BE(hrtime);

  const pidBuf = Buffer.alloc(4);
  pidBuf.writeUInt32BE(process.pid % 0xffffffff);

  return Buffer.concat([random, hrtimeBuf, pidBuf]);
}

export type ApiKeyFormat = 'prefixed' | 'hex' | 'base62';

export interface GenerateApiKeyOptions {
  prefix?: string;

  format?: ApiKeyFormat;
}

export function generateApiKey(options: GenerateApiKeyOptions = {}): string {
  const { prefix = 'lt', format = 'prefixed' } = options;

  const entropy = buildEntropyBuffer();

  // SHA-256 digest ensures fixed length and no structural information leakage
  const digest = createHash('sha256').update(entropy).digest();

  if (format === 'hex') {
    return digest.toString('hex'); // 64 hex chars
  }

  if (format === 'base62') {
    return toBase62(digest, 43); // 43 base-62 chars ≈ 256 bits
  }
  const tsHash = createHash('sha256')
    .update(Buffer.from(process.hrtime.bigint().toString()))
    .update(randomBytes(4))
    .digest();

  const tsSegment = toBase62(tsHash, 8); // 8 chars — ~48 bits
  const randSegment = toBase62(digest, 32); // 32 chars — ~190 bits

  return `${prefix}_${tsSegment}_${randSegment}`;
}

export function generateSecretKey(): string {
  return generateApiKey({ format: 'hex' });
}

export function generateBatchApiKeys(
  count: number,
  options: GenerateApiKeyOptions = {},
): string[] {
  return Array.from({ length: count }, () => generateApiKey(options));
}
