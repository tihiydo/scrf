export {};

declare global {
  type TODO = any;
  type Maybe<T> = T | null | undefined;
  type OptionalPromise<T> = T | Promise<T>;
  type ObjectValues<T extends Record<string, any>> = T[keyof T];
  type Prettify<T> = { [K in keyof T]: T[K] };
  type OptionalKeys<T extends object, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;
  type ReplaceKeys<
    T,
    K extends keyof T,
    R extends Partial<Record<K, any>>,
  > = Omit<T, K> & R;
}
