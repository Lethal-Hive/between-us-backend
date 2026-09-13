import { I18nService } from 'src/common/i18n/i18n.service';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { pick } from 'accept-language-parser';
import { v4 as uuidv4 } from 'uuid';

export function randomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function uuid() {
  return uuidv4();
}

export function censor(text: string): string {
  if (text.length <= 3) {
    const stringCensor = '*'.repeat(2);
    return `${stringCensor}${text.slice(-1)}`;
  } else if (text.length <= 10) {
    const stringCensor = '*'.repeat(7);
    return `${stringCensor}${text.slice(-3)}`;
  }

  const stringCensor = '*'.repeat(10);
  return `${text.slice(0, 3)}${stringCensor}${text.slice(-4)}`;
}

export function isInt(str: string): boolean {
  return /^\d+$/.test(str);
}
export function isISODate(str: string): boolean {
  return /^(19[6-9]\d|2\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[0-1])$/.test(
    str,
  );
}
export function isNumberString(str: string): boolean {
  return /^-?\d*\.?\d*$/.test(str);
}

export function isISODateTime(str: string): boolean {
  return /^(19[6-9]\d|2\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[0-1])T(0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d).(\d\d\d)(|Z)$/.test(
    str,
  );
}

export function pickLanguage(incomingLanguage: string) {
  return (
    pick(I18nService.supportedLanguages, incomingLanguage) ||
    I18nService.defaultLanguage
  );
}

export function extractHeadersData(req: Request) {
  const localHostOrFakeIp = ['::1', '::ffff:127.0.0.1', '127.0.0.1'];
  const { ua, device, os, browser } = UAParser(req.headers['user-agent']);
  return {
    ipAddress: localHostOrFakeIp.includes(req.clientIp as string)
      ? 'INVALID_IP'
      : (req.clientIp as string),
    userAgent: {
      value: ua,
      device: {
        type: device.type || 'UNKNOWN',
        vendor: device.vendor || 'UNKNOWN',
      },
      os: {
        name: os.name || 'UNKNOWN',
        version: os.version || 'UNKNOWN',
      },
      browser: browser.name || 'UNKNOWN',
    },
  };
}

export function generateRandomHash(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

const ROOM_ADJECTIVES = [
  'Ancient',
  'Brave',
  'Calm',
  'Dazzling',
  'Electric',
  'Fluffy',
  'Golden',
  'Happy',
  'Icy',
  'Jolly',
  'Kind',
  'Lazy',
  'Mighty',
  'Noble',
  'Orange',
  'Purple',
  'Quick',
  'Rapid',
  'Silent',
  'Tiny',
  'Ultra',
  'Vivid',
  'Wild',
  'Xtra',
  'Yellow',
  'Zesty',
  'Amber',
  'Bold',
  'Cosmic',
  'Divine',
  'Epic',
  'Fancy',
  'Gentle',
  'Hyper',
  'Ideal',
  'Jazzy',
  'Keen',
  'Lively',
  'Magic',
];

const ROOM_NOUNS_1 = [
  'Dolphin',
  'Falcon',
  'Tiger',
  'Panda',
  'Koala',
  'Jaguar',
  'Otter',
  'Raven',
  'Penguin',
  'Phoenix',
  'Dragon',
  'Unicorn',
  'Eagle',
  'Wolf',
  'Fox',
  'Bear',
  'Owl',
  'Lion',
  'Shark',
  'Whale',
  'Parrot',
  'Rabbit',
  'Cobra',
  'Leopard',
];

const ROOM_NOUNS_2 = [
  'Arena',
  'Bay',
  'Chamber',
  'Den',
  'Echo',
  'Forum',
  'Grove',
  'Haven',
  'Island',
  'Junction',
  'Keep',
  'Lounge',
  'Meadow',
  'Nexus',
  'Orbit',
  'Portal',
  'Quarter',
  'Realm',
  'Station',
  'Tower',
  'Union',
  'Vault',
  'World',
  'Zone',
  'Base',
  'Bridge',
  'Circle',
  'Domain',
  'Edge',
  'Field',
];

export function generateRoomName(): string {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  return `${pick(ROOM_ADJECTIVES)}${pick(ROOM_NOUNS_1)}${pick(ROOM_NOUNS_2)}`;
}
