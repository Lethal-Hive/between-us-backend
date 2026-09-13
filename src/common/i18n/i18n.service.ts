import * as format from 'string-format';

import { HttpStatus, Injectable } from '@nestjs/common';

import type * as Schema from '../../locales/en.json';
import * as en from '../../locales/en.json';
import * as ar from '../../locales/ar.json';
import { APP_LANGUAGE } from 'src/constants/app.constants';

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[]> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}.${Join<Extract<R, string[]>>}`
        : never
      : string;

export type I18nKey = Join<PathsToStringProps<typeof Schema>>;
@Injectable()
export class I18nService {
  constructor() {}
  public static readonly defaultLanguage = APP_LANGUAGE.EN;
  public static readonly supportedLanguages = Object.values(APP_LANGUAGE);
  public static readonly getKey = (key: I18nKey) => key;

  private readonly locales: Record<string, typeof Schema> = { en, ar };

  translate(
    language: string,
    key: I18nKey,
    ...args: Array<string | Record<string, unknown>>
  ): string {
    try {
      const locale = this.locales[language];
      const text = key.split('.').reduce((o, i) => o?.[i], locale);
      return format(text, ...args);
    } catch {
      return key;
    }
  }

  error(
    error: any,
    key: I18nKey,

    ...args: Array<string | Record<string, unknown>>
  ) {
    throw new error(
      {
        message: key,
        data: args,
      },
      new error().name === 'HttpException' && HttpStatus.NOT_ACCEPTABLE,
    );
  }
}
