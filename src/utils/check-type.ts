const toString = (v: unknown) => Object.prototype.toString.call(v);

export const isObject = (v: unknown): v is Record<string, unknown> =>
  toString(v) === '[object Object]';

export const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

export const isString = (v: unknown): v is string =>
  toString(v) === '[object String]';
