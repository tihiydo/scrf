import { ZodTypeAny } from "zod";

export { }

declare global {
  type Primitive = string | number | boolean;

  // Type allows the value to be a T or any other string but saves autocomplete for T type
  type ExtendString<T extends string> = T | (string & {});


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
  type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  } : T;
  type ConditionalRequired<T, Condition extends boolean | undefined | null> = Condition extends true ? Required<T> : Partial<T>;


  type StrictOmit<
    T,
    K extends keyof T | (string & {}) | (number & {}) | (symbol | {})
  > = { [P in Exclude<keyof T, K>]: T[P] };

  type TypedOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


  interface HTMLVideoElement {
    webkitShowPlaybackTargetPicker?: () => void;
    webkitRequestFullscreen?: () => void;
    webkitCurrentPlaybackTargetIsWireless?: boolean;
    addEventListener(
      type: 'webkitplaybacktargetavailabilitychanged',
      listener: (this: HTMLVideoElement, ev: Event) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
  }

  interface Window {
    WebKitPlaybackTargetAvailabilityEvent: boolean
  }

  interface Document {
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => Promise<void>;
  }

  interface HTMLElement {
    webkitRequestFullscreen?: () => void;
  }

  interface Element {
    webkitRequestFullscreen?: () => void;
  }

  interface EventTarget {
    webkitfullscreenchange?: Event;
  }

  interface ScreenOrientation {
    lock: (orientation: string) => Promise<any>
  }
}

