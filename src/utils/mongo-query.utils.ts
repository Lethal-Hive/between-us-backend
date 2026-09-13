import { isNumberString } from 'class-validator';
import { isISODate, isISODateTime } from './helpers.utils';
import { Types } from 'mongoose';

export interface MongoQueryOptions {
  search?: { key: string; paths: string[] };
  forbidden?: {
    select: string[];
    filter: string[];
  };
}

export class QueryObjectModel {
  [key: string]: string | number | Date | any;
}

export class MongoQueryModel {
  sort!: QueryObjectModel;
  select!: QueryObjectModel;
  filter!: QueryObjectModel;

  addSort(sort: QueryObjectModel): void {
    this.sort = { ...this.sort, ...sort };
  }

  addSelect(select: QueryObjectModel): void {
    this.select = { ...this.select, ...select };
  }

  addFilter(filter: QueryObjectModel): void {
    this.filter = { ...this.filter, ...filter };
  }

  removeFilter(key: string): void {
    delete this.filter[key];
  }
}
function getSearch(
  query: any,
  data: { key: string; paths: string[] },
  forbidden?: string[],
): QueryObjectModel {
  const key = data.key;
  const paths = data.paths;
  if (query[key]) {
    const search = query[key];
    const filter = paths.map((path) => ({
      [path]: { $regex: search, $options: 'i' },
    }));
    return { $or: filter };
  } else {
    return getFilter(query, {}, forbidden);
  }
}

export function parseMongoQuery(
  query: any,
  opts?: MongoQueryOptions,
): MongoQueryModel {
  const result: MongoQueryModel = new MongoQueryModel();
  const forbidden = opts?.forbidden ?? {
    select: ['deletedAt', 'password'],
    filter: ['deletedAt', 'password'],
  };

  const deSelect: any = {};
  forbidden.select.forEach((item) => {
    deSelect[item] = 0;
  });
  result.select = {
    ...getSelect(query, {}, forbidden.select),
    ...deSelect,
  };

  result.sort = getSort(query, {});
  result.filter = opts?.search
    ? getSearch(query, opts.search, forbidden.filter)
    : getFilter(query, {}, forbidden.filter);

  return result;
}
function splitString(param: string, sep: string): string[] {
  return param.split(sep).filter((param: string) => !!param);
}
function getSelect(
  query: any,
  def: QueryObjectModel,
  forbidden?: string[],
): QueryObjectModel {
  if (!query.select) return def;
  return splitString(query.select as string, ',').reduce(
    (obj: { [x: string]: number }, key: string) => {
      const cleanKey: string = key.replace(/[^A-z0-9_.]/g, '');
      if (!forbidden?.includes(cleanKey))
        obj[cleanKey] = key.startsWith('-') ? 0 : 1;

      return obj;
    },
    {},
  );
}

function getSort(query: any, def: QueryObjectModel): QueryObjectModel {
  if (!query.sort) return def;

  return splitString(query.sort as any, ',').reduce(
    (obj: { [x: string]: number }, key: string) => {
      const cleanKey: string = key.replace(/[^A-z0-9_.]/g, '');
      obj[cleanKey] = key.startsWith('-') ? -1 : 1;
      return obj;
    },
    {},
  );
}

export function checkDotPath(key: string) {
  return key.includes('.');
}

export function insertIntoObj(obj: any, path: string, value: any) {
  const keys = path.split('.').map((x) => (x.length > 0 ? x : '_id'));
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i] === '' ? '_id' : keys[i];
    if (!current[key]) {
      current[key] = {}; // Create new object if key doesn't exist
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

function getSimpleFilterValue(
  filter: string,
): string | number | boolean | Date | object | null {
  if (!filter) return null;

  if (isComparisonFilter(filter)) {
    const first_dot_index: number = filter.indexOf(':');
    const operator: string = filter.substring(0, first_dot_index);
    const value: string = filter.substring(first_dot_index + 1);
    if (!value) {
      return null;
    }
    return { [`$${operator}`]: getSimpleFilterValue(value) };
  }

  if (isElementFilter(filter)) {
    const first_dot_index: number = filter.indexOf(':');
    const operator: string = filter.substring(0, first_dot_index);
    const value: string = filter.substring(first_dot_index + 1);
    if (!value) {
      return null;
    }

    if (operator === 'exists') {
      return getElementExists(value);
    }

    return getElementType(value);
  }

  if (isISODate(filter) || isISODateTime(filter)) {
    return new Date(filter);
  }

  if (isNumberString(filter)) {
    return +filter;
  }

  if (filter === 'true' || filter === 'false') {
    return filter === 'true';
  }

  const value = filter.replace(/[^\w\s@.-:\u0600-\u06FF]/g, '');

  let $regex = value;

  if (filter.indexOf('*') === -1) {
    return filter;
  }

  if (filter.startsWith('*')) {
    $regex = `^${value}`;
    if (filter.endsWith('*')) {
      $regex = $regex.substring(1);
    }
  } else if (filter.endsWith('*')) {
    $regex = `${value}$`;
  }
  return {
    $regex,
    $options: 'i',
  };
}

function isComparisonFilter(filter: string): boolean {
  return (
    filter.startsWith('eq:') ||
    filter.startsWith('gt:') ||
    filter.startsWith('gte:') ||
    filter.startsWith('in:') ||
    filter.startsWith('lt:') ||
    filter.startsWith('lte:') ||
    filter.startsWith('ne:') ||
    filter.startsWith('nin:')
  );
}
function isElementFilter(filter: string): boolean {
  return filter.startsWith('exists:') || filter.startsWith('type:');
}

// function isSimpleFilter(value: string): boolean {
//   return /^([\w\s@.\-:]{1,}[\w@.\-:])$/.test(value);
// }

function isORFilter(filter: string): boolean {
  if (filter.indexOf(',') === -1) return false;
  return /^(([\w\s@.-:],?){1,}[\w@.-:])$/.test(filter);
}

function getElementExists(value: string) {
  if (['true', 'false'].indexOf(value) === -1) {
    return null;
  }
  return { $exists: value === 'true' };
}

function getElementType(value: string) {
  const validTypes: string[] = [
    'double',
    'string',
    'object',
    'array',
    'binData',
    'objectId',
    'bool',
    'date',
    'null',
    'regex',
    'javascript',
    'int',
    'timestamp',
    'long',
    'decimal',
    'minKey',
    'maxKey',
  ];

  if (validTypes.indexOf(value) === -1) {
    return null;
  }
  return { $type: value };
}

function getArrayValue(key: string, filter: string[]): object[] {
  if (!filter || !filter.length) return [];
  const cleanKey: string = key.replace(/[^A-z0-9_.]/g, '');
  return filter.map((item) => ({ [cleanKey]: getSimpleFilterValue(item) }));
}
function getFilter(
  query: any,
  def: QueryObjectModel,
  forbidden?: string[],
): QueryObjectModel {
  if (!query) return def;
  return Object.keys(query)
    .filter(
      (key: string) =>
        !['limit', 'skip', 'page', 'select', 'sort', 'populate'].includes(key),
    )
    .reduce((obj: any, key: string) => {
      if (forbidden?.includes(key)) return obj;
      if (key.includes('_id')) {
        key.length === 3
          ? (obj[key] = new Types.ObjectId(query[key]))
          : (obj[key.split('_id').join('')] = new Types.ObjectId(query[key]));
        return obj;
      }

      const queryValue = query[key];
      if (queryValue instanceof Array) {
        const allSimpleFilters: string[] = queryValue.filter((item: string) =>
          /^([\w\s@.\-:]{1,}[\w@.\-:])$/.test(item),
        );

        const filterSimpleValues = getArrayValue(key, allSimpleFilters);
        if (filterSimpleValues.length) {
          obj.$and = [...(obj.$and || []), ...filterSimpleValues];
        }

        const allORFilters: string[] = queryValue
          .filter((item: string) => isORFilter(item))
          .map((item) => item.split(','))
          .reduce((arr, item) => {
            arr = [...arr, ...item];
            return arr;
          }, []);

        const filterORValues = getArrayValue(key, [...allORFilters]);

        if (filterORValues.length) {
          obj.$or = [...(obj.$or || []), ...filterORValues];
        }
        return obj;
      } else if (isORFilter(queryValue)) {
        const value = getArrayValue(key, queryValue.split(','));
        if (value.length) {
          obj.$or = [...(obj.$or || []), ...value];
        }
        return obj;
      }

      const value = getSimpleFilterValue(queryValue);
      if (value !== null) {
        const cleanKey: string = key.replace(/[^A-z0-9_.]/g, '');

        obj[cleanKey] = value;
      }
      return obj;
    }, {});
}
