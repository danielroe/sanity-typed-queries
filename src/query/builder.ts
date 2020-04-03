import { UnnamedField, FieldType, type } from '../schema/fields'

type QueryReturnType<T> = [string, T]

type Translator<T extends Record<string, UnnamedField>> = {
  [P in keyof T]: FieldType<T[P]>
}

type Single<T> = T
type Multiple<T> = T[]

type MapResolver<T extends Record<string, any>> = {
  [P in keyof T]: T[P] extends Record<string, any>
    ? MapResolver<T[P]>
    : { use: () => T[P] }
} & { use: () => T }

type ConvertToMapping<T extends Record<string, any>> = {
  [P in keyof T]: { [type]: T[P] }
}

export class QueryBuilder<
  Schema extends Record<string, any>,
  Mappings extends Record<string, any> = {},
  SchemaType extends string = string,
  Type = Multiple<any>,
  Project extends boolean = true,
  Exclude extends string = ''
> {
  private schema: Schema
  private type: SchemaType
  private ordering: [keyof Schema, 'asc' | 'desc'][]
  private projections: Record<string, string>
  private mappings: Record<string, string>
  private selector: string
  private unproject: boolean

  constructor(
    schema: Schema,
    type: SchemaType,
    ordering: [keyof Schema, 'asc' | 'desc'][] = [],
    projections: Record<string, string> = {},
    mappings: Record<string, string> = {},
    selector = '',
    unproject = false
  ) {
    this.schema = schema
    this.type = type
    this.projections = projections
    this.mappings = mappings
    this.selector = selector
    this.unproject = unproject
    this.ordering = ordering
  }

  orderBy<Key extends keyof Schema>(key: Key, order: 'asc' | 'desc' = 'asc') {
    return new QueryBuilder(
      this.schema,
      this.type,
      [...this.ordering, [key, order]],
      this.projections,
      this.mappings,
      this.selector,
      this.unproject
    )
  }

  select(
    from: number,
    to: number,
    inclusive = false
  ): Omit<
    QueryBuilder<
      Schema,
      Mappings,
      SchemaType,
      Type,
      Project,
      Exclude | 'first' | 'select'
    >,
    Exclude | 'first' | 'select'
  > {
    return new QueryBuilder(
      this.schema,
      this.type,
      this.ordering,
      this.projections,
      this.mappings,
      `[${from}..${inclusive ? '.' : ''}${to}]`,
      this.unproject
    ) as Omit<
      QueryBuilder<
        Schema,
        Mappings,
        SchemaType,
        Type,
        Project,
        Exclude | 'first' | 'select'
      >,
      Exclude | 'first' | 'select'
    >
  }

  // eslint-disable-next-line no-dupe-class-members
  pick<R extends keyof Schema | keyof Mappings>(
    props: R
  ): Omit<
    QueryBuilder<
      Pick<Schema, R & keyof Schema>,
      Pick<Mappings, R & keyof Mappings>,
      SchemaType,
      Type,
      false,
      Exclude | 'pick'
    >,
    Exclude | 'pick'
  >

  // eslint-disable-next-line no-dupe-class-members
  pick<R extends keyof Schema | keyof Mappings>(
    props: R[]
  ): Omit<
    QueryBuilder<
      Pick<Schema, R & keyof Schema>,
      Pick<Mappings, R & keyof Mappings>,
      SchemaType,
      Type,
      true,
      Exclude | 'pick'
    >,
    Exclude | 'pick'
  >

  // eslint-disable-next-line no-dupe-class-members
  pick<R extends keyof Schema | keyof Mappings>(
    props: R | R[]
  ): Omit<
    QueryBuilder<
      Pick<Schema, R & keyof Schema>,
      Pick<Mappings, R & keyof Mappings>,
      SchemaType,
      Type,
      any,
      Exclude | 'pick'
    >,
    Exclude | 'pick'
  > {
    let projections = {}
    let unproject = this.unproject

    if (Array.isArray(props)) {
      projections = Object.entries(this.schema).reduce((obj, [key]) => {
        if (props.includes(key as R)) obj[key] = key
        return obj
      }, {} as Record<string, string>)
    } else {
      projections = {
        [props]: props,
      }
      unproject = true
    }

    return new QueryBuilder(
      this.schema,
      this.type,
      this.ordering,
      projections,
      this.mappings,
      this.selector,
      unproject
    ) as Omit<
      QueryBuilder<
        Pick<Schema, R & keyof Schema>,
        Pick<Mappings, R & keyof Mappings>,
        SchemaType,
        Type,
        any,
        Exclude | 'pick'
      >,
      Exclude | 'pick'
    >
  }

  first(): Omit<
    QueryBuilder<
      Schema,
      Mappings,
      SchemaType,
      Single<Schema>,
      Project,
      Exclude | 'select' | 'first'
    >,
    Exclude | 'select' | 'first'
  > {
    return new QueryBuilder(
      this.schema,
      this.type,
      this.ordering,
      this.projections,
      this.mappings,
      '[0]',
      this.unproject
    ) as Omit<
      QueryBuilder<
        Schema,
        Mappings,
        SchemaType,
        Single<Schema>,
        Project,
        Exclude | 'select' | 'first'
      >,
      Exclude | 'select' | 'first'
    >
  }

  map<Mapping extends Record<string, any>>(
    map: Mapping | ((resolver: MapResolver<Translator<Schema>>) => Mapping)
  ): Omit<
    QueryBuilder<
      Omit<Schema, keyof Mapping>,
      ConvertToMapping<Mapping>,
      SchemaType,
      Type,
      any,
      Exclude | 'map'
    >,
    Exclude | 'map'
  > {
    let mappings = { ...this.mappings }

    function checkCallable(
      m: Mapping | ((resolver: MapResolver<Translator<Schema>>) => Mapping)
    ): m is (resolver: MapResolver<Translator<Schema>>) => Mapping {
      return typeof m === 'function'
    }

    if (checkCallable(map)) {
      const createProxy: (path: string[]) => any = (path: string[]) =>
        new Proxy(path, {
          get(target, prop) {
            if (prop !== 'use' && typeof prop === 'string') {
              target.push(prop)
              return createProxy(target)
            }
            return () => target.join('.')
          },
        })

      mappings = map(createProxy([]))
    } else {
      mappings = map
    }

    return new QueryBuilder(
      this.schema,
      this.type,
      this.ordering,
      this.projections,
      mappings,
      this.selector,
      this.unproject
    ) as Omit<
      QueryBuilder<
        Omit<Schema, keyof Mapping>,
        ConvertToMapping<Mapping>,
        SchemaType,
        Type,
        any,
        Exclude | 'map'
      >,
      Exclude | 'map'
    >
  }

  get option() {
    return [`_type == '${this.type}'`].join(' && ')
  }

  get order() {
    if (!this.ordering.length) return ''

    return ` | order(${this.ordering
      .map(([key, order]) => `${key} ${order}`)
      .join(', ')})`
  }

  get projection() {
    const entries = Object.entries({
      ...this.projections,
      ...this.mappings,
    }).filter(([key]) => typeof key === 'string')

    if (this.unproject && entries.length === 1) return `.${entries[0][1]}`
    if (!entries.length) return ''

    const innerProjection = entries
      .map(([key, val]) => (key === val ? key : `"${key}": ${val}`))
      .join(', ')

    return ` { ${innerProjection} }`
  }

  get query() {
    return `*[${this.option}]${this.selector}${this.projection}${this.order}`
  }

  use() {
    return [
      this.query,
      this.selector === '[0]' ? null : [],
    ] as Type extends Array<any>
      ? Project extends true
        ? QueryReturnType<Array<Translator<Schema & Mappings>>>
        : QueryReturnType<
            Array<
              | FieldType<Schema[keyof Schema]>
              | FieldType<Mappings[keyof Mappings]>
            >
          >
      : Project extends true
      ? QueryReturnType<Translator<Schema & Mappings>>
      : QueryReturnType<
          FieldType<Schema[keyof Schema]> | FieldType<Mappings[keyof Mappings]>
        >
  }
}
