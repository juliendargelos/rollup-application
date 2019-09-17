declare module 'tiny-emitter' {
  type Arguments<T> = [T] extends [(...args: infer U) => any]
    ? U
    : [T] extends [void] ? [] : [T]

  export interface Events {
    [event: string]: (...args: any[]) => void
  }

  export default class Emitter<T extends Events = Events> {
    on<E extends (keyof T & string)>(event: E, callback: T[E], context?: object): this
    once<E extends (keyof T & string)>(event: E, callback: T[E], context?: object): this
    off<E extends (keyof T & string)>(event: E, callback: T[E]): this
    emit<E extends (keyof T & string)>(event: E, ...args: Arguments<T[E]>): this
  }
}
