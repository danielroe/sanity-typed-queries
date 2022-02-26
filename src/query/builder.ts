import type { Reference } from '../types'
import { inArray, createProxy } from '../utils'

type QueryReturnType<T> = [string, T]

type Single<T> = T
type Multiple<T> = T[]

type ResolveFieldType<T> = T extends Record<string, any>
  ? MapResolver<T>
  : ResolverAction<T>

interface ResolverFunction<T, Arr = false> {
  <P extends keyof T>(props: P[]): ResolverAction<Pick<T, P>>
}
interface ResolverFunction<T, Arr = false> {
  <P extends keyof T>(prop: P): Arr extends true
    ? ResolveFieldType<Array<T[P]>>
    : ResolveFieldType<T[P]>
}

type BaseResolverAction<T> = {
  use: (defaultValue?: T) => T
}

type ResolverAction<T> = BaseResolverAction<T> &
  (T extends Reference<infer A>
    ? { resolve: ResolverFunction<A> }
    : Record<string, unknown>) &
  (T extends Array<any>
    ? {
        count: () => number
      }
    : Record<string, unknown>) &
  (T extends Array<Record<string, any>>
    ? {
        pick: <K extends keyof T[0]>(
          props: K[] | K
        ) => { use: () => Pick<T[0], K> }
      }
    : Record<string, unknown>) &
  (T extends Array<Reference<infer A>>
    ? {
        resolveIn: ResolverFunction<A, true>
      }
    : Record<string, unknown>)

type MapResolver<T extends Record<string, any>> = (T extends Array<any>
  ? Record<string, unknown>
  : {
      [P in keyof T]: ResolveFieldType<T[P]>
    }) &
  ResolverAction<T>

type Combine<
  Original extends Record<string, any>,
  New extends Record<string, any>
> = Omit<Original, keyof New> & New

export class QueryBuilder<
  Schema extends Record<string, any>,
  Mappings extends Record<string, any>,
  Subqueries extends Record<string, QueryReturnType<any>>,
  Type = Multiple<any>,
  Project extends boolean = true,
  Exclude extends string = ''
> {
  private schema: Schema
  private ordering: [keyof Schema, 'asc' | 'desc'][]
  private projections: Record<string, string>
  private mappings: Record<string, string>
  private subqueries: Record<string, QueryReturnType<any>>
  private selector: string
  private project: boolean
  private restricted: boolean
  private filters: string[]

  constructor(
    schema: Schema,
    ordering: [keyof Schema, 'asc' | 'desc'][] = [],
    projections: Record<string, string> = {},
    mappings: Record<string, string> = {},
    subqueries: Record<string, QueryReturnType<any>> = {},
    selector = '',
    project = true,
    restricted = false,
    filters = [] as string[]
  ) {
    this.schema = schema
    this.projections = projections
    this.mappings = mappings
    this.subqueries = subqueries
    this.selector = selector
    this.project = project
    this.ordering = ordering
    this.restricted = restricted
    this.filters = filters
  }

  orderBy<Key extends keyof Schema>(key: Key, order: 'asc' | 'desc' = 'asc') {
    return new QueryBuilder(
      this.schema,
      [...this.ordering, [key, order]],
      this.projections,
      this.mappings,
      this.subqueries,
      this.selector,
      this.project,
      this.restricted,
      this.filters
    )
  }

  select(
    from: number,
    to: number,
    exclusive = false
  ): Omit<
    QueryBuilder<
      Schema,
      Mappings,
      Subqueries,
      Type,
      Project,
      Exclude | 'first' | 'select'
    >,
    Exclude | 'first' | 'select'
  > {
    return new QueryBuilder(
      this.schema,
      this.ordering,
      this.projections,
      this.mappings,
      this.subqueries,
      ` [${from}..${exclusive ? '.' : ''}${to}]`,
      this.project,
      this.restricted,
      this.filters
    ) as unknown as Omit<
      QueryBuilder<
        Schema,
        Mappings,
        Subqueries,
        Type,
        Project,
        Exclude | 'first' | 'select'
      >,
      Exclude | 'first' | 'select'
    >
  }

  // eslint-disable-next-line no-dupe-class-members
  pick<R extends keyof Mappings>(
    props: R[]
  ): Omit<
    QueryBuilder<
      Schema,
      Pick<Mappings, R>,
      Subqueries,
      Type,
      true,
      Exclude | 'pick'
    >,
    Exclude | 'pick'
  >

  // eslint-disable-next-line no-dupe-class-members
  pick<R extends keyof Mappings>(
    props: R
  ): Omit<
    QueryBuilder<
      Schema,
      Pick<Mappings, R>,
      Subqueries,
      Type,
      false,
      Exclude | 'pick'
    >,
    Exclude | 'pick'
  >

  // eslint-disable-next-line no-dupe-class-members
  pick(props: any) {
    const project = Array.isArray(props)
    const projections = inArray(props).reduce((obj, key) => {
      obj[key as string] = key as string
      return obj
    }, {} as Record<string, string>)

    return new QueryBuilder(
      this.schema,
      this.ordering,
      projections,
      this.mappings,
      this.subqueries,
      this.selector,
      project,
      true,
      this.filters
    ) as any
  }

  first(): Omit<
    QueryBuilder<
      Schema,
      Mappings,
      Subqueries,
      Single<Schema>,
      Project,
      Exclude | 'select' | 'first'
    >,
    Exclude | 'select' | 'first'
  > {
    return new QueryBuilder(
      this.schema,
      this.ordering,
      this.projections,
      this.mappings,
      this.subqueries,
      ' [0]',
      this.project,
      this.restricted,
      this.filters
    ) as unknown as Omit<
      QueryBuilder<
        Schema,
        Mappings,
        Subqueries,
        Single<Schema>,
        Project,
        Exclude | 'select' | 'first'
      >,
      Exclude | 'select' | 'first'
    >
  }

  map<NewMapping extends Record<string, any>>(
    map: NewMapping | ((resolver: MapResolver<Schema>) => NewMapping)
  ): Omit<
    QueryBuilder<
      Schema,
      Combine<Mappings, NewMapping>,
      Subqueries,
      Type,
      Project,
      Exclude | 'map'
    >,
    Exclude | 'map'
  > {
    let mappings: Combine<Mappings, NewMapping>

    function checkCallable(
      m: NewMapping | ((resolver: MapResolver<Schema>) => NewMapping)
    ): m is (resolver: MapResolver<Schema>) => NewMapping {
      return typeof m === 'function'
    }

    if (checkCallable(map)) {
      mappings = map(createProxy([])) as Combine<Mappings, NewMapping>
    } else {
      mappings = map as Combine<Mappings, NewMapping>
    }

    return new QueryBuilder(
      this.schema,
      this.ordering,
      this.projections,
      mappings,
      this.subqueries,
      this.selector,
      this.project,
      this.restricted,
      this.filters
    ) as unknown as Omit<
      QueryBuilder<
        Schema,
        Combine<Mappings, NewMapping>,
        Subqueries,
        Type,
        Project,
        Exclude | 'map'
      >,
      Exclude | 'map'
    >
  }

  subquery<NewMapping extends Record<string, QueryReturnType<any>>>(
    subqueries: NewMapping
  ): Omit<
    QueryBuilder<
      Schema,
      Combine<
        Mappings,
        {
          [K in keyof NewMapping]: NewMapping[K][1]
        }
      >,
      Subqueries,
      Type,
      Project,
      Exclude | 'subqueries'
    >,
    Exclude | 'subqueries'
  > {
    return (new QueryBuilder(
      this.schema,
      this.ordering,
      this.projections,
      this.mappings,
      subqueries,
      this.selector,
      this.project,
      this.restricted,
      this.filters
    ) as unknown) as Omit<
      QueryBuilder<
        Schema,
        Combine<
          Mappings,
          {
            [K in keyof NewMapping]: NewMapping[K][1]
          }
        >,
        Subqueries,
        Type,
        Project,
        Exclude | 'subqueries'
      >,
      Exclude | 'subqueries'
    >
  }

  filter(
    filter: string
  ): QueryBuilder<Schema, Mappings, Subqueries, Type, Project> {
    return new QueryBuilder(
      this.schema,
      this.ordering,
      this.projections,
      this.mappings,
      this.subqueries,
      this.selector,
      this.project,
      this.restricted,
      [...this.filters, filter]
    )
  }

  get option() {
    return [
      `_type == '${this.schema._type}'`,
      ...this.filters.map(filter =>
        filter.includes('||') ? `(${filter})` : filter
      ),
    ].join(' && ')
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
      ...Object.keys(this.subqueries).reduce<Record<string, string>>(
        (acc, key) => {
          acc[key] = this.subqueries[key][0]
          return acc
        },
        {}
      ),
    }).filter(([key]) => typeof key === 'string')

    if (!this.project && entries.length === 1) return `.${entries[0][1]}`
    if (!entries.length) return ''

    const innerProjection = [
      ...(this.restricted ? [] : ['...']),
      ...entries.map(([key, val]) => (key === val ? key : `"${key}": ${val}`)),
    ].join(', ')

    return ` { ${innerProjection} }`
  }

  get query() {
    return `*[${this.option}]${this.order}${this.selector}${this.projection}`
  }

  use() {
    return [
      this.query,
      this.selector === ' [0]' ? null : [],
    ] as Type extends Array<any>
      ? Project extends true
        ? QueryReturnType<Array<Mappings>>
        : QueryReturnType<Array<Mappings[keyof Mappings]>>
      : Project extends true
      ? QueryReturnType<Mappings>
      : QueryReturnType<Mappings[keyof Mappings]>
  }
}
