declare module 'memoize-one' {
  export default function memoizeOne<ResultFn extends (this: any, ...newArgs: any[]) => ReturnType<ResultFn>>(resultFn: ResultFn, isEqual?: (newArgs: Parameters<ResultFn>, lastArgs: Parameters<ResultFn>) => boolean): ResultFn;
}
