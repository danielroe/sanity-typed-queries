export type UndefinedAsOptional<T> = Partial<
  Pick<
    T,
    {
      [K in keyof T]: Extract<T[K], undefined> extends never ? never : K
    }[keyof T]
  >
> &
  Pick<
    T,
    {
      [K in keyof T]: Extract<T[K], undefined> extends never ? K : never
    }[keyof T]
  >
