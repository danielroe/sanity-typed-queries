import { UnnamedField, FieldType } from '../schema/fields'
import { extraFields } from '../extractor'

type QueryReturnType<T> = [string, T]

type Translator<T extends Record<string, UnnamedField>> = {
  [P in keyof T]: FieldType<T[P]>
}

type Single<T> = T
type Multiple<T> = T[]

export class QueryBuilder<
  Schema extends Record<string, any>,
  Type = Multiple<any>,
  Project extends boolean = true,
  Exclude extends string = '',
  SchemaType extends string = string
> {
  private schema: Schema
  private type: SchemaType
  private ordering: [keyof Schema, 'asc' | 'desc'][]
  private projections: Record<string, string>
  private selector: string
  private unproject: boolean

  constructor(
    schema: Schema,
    type: SchemaType,
    ordering: [keyof Schema, 'asc' | 'desc'][] = [],
    projections: Record<string, string> = {},
    selector = '',
    unproject = false
  ) {
    this.schema = { ...schema, ...extraFields(type) }
    this.type = type
    this.projections = projections
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
      Type,
      Project,
      Exclude | 'first' | 'select',
      SchemaType
    >,
    Exclude | 'first' | 'select'
  > {
    return new QueryBuilder(
      this.schema,
      this.type,
      this.ordering,
      this.projections,
      `[${from}..${inclusive ? '.' : ''}${to}]`,
      this.unproject
    ) as Omit<
      QueryBuilder<
        Schema,
        Type,
        Project,
        Exclude | 'first' | 'select',
        SchemaType
      >,
      Exclude | 'first' | 'select'
    >
  }

  // eslint-disable-next-line no-dupe-class-members
  pick<R extends keyof Schema>(
    props: R
  ): Omit<
    QueryBuilder<Pick<Schema, R>, Type, false, Exclude | 'pick', SchemaType>,
    Exclude | 'pick'
  >

  // eslint-disable-next-line no-dupe-class-members
  pick<R extends keyof Schema>(
    props: R[]
  ): Omit<
    QueryBuilder<Pick<Schema, R>, Type, true, Exclude | 'pick', SchemaType>,
    Exclude | 'pick'
  >

  // eslint-disable-next-line no-dupe-class-members
  pick<R extends keyof Schema>(
    props: R | R[]
  ): Omit<
    QueryBuilder<Pick<Schema, R>, Type, any, Exclude | 'pick', SchemaType>,
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
        [props]: this.schema[props],
      }
      unproject = true
    }

    return new QueryBuilder(
      this.schema,
      this.type,
      this.ordering,
      projections,
      this.selector,
      unproject
    ) as Omit<
      QueryBuilder<Pick<Schema, R>, Type, any, Exclude | 'pick', SchemaType>,
      Exclude | 'pick'
    >
  }

  first(): Omit<
    QueryBuilder<
      Schema,
      Single<Schema>,
      Project,
      Exclude | 'select' | 'first',
      SchemaType
    >,
    Exclude | 'select' | 'first'
  > {
    return new QueryBuilder(
      this.schema,
      this.type,
      this.ordering,
      this.projections,
      '[0]',
      this.unproject
    ) as Omit<
      QueryBuilder<
        Schema,
        Single<Schema>,
        Project,
        Exclude | 'select' | 'first',
        SchemaType
      >,
      Exclude | 'select' | 'first'
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
    const keys = Object.keys(this.projections)

    if (this.unproject && keys.length === 1) return `.${keys[0]}`
    if (!keys.length) return ''
    return ` { ${keys.join(', ')} }`
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
        ? QueryReturnType<Array<Translator<Schema>>>
        : QueryReturnType<Array<FieldType<Schema[keyof Schema]>>>
      : Project extends true
      ? QueryReturnType<Translator<Schema>>
      : QueryReturnType<FieldType<Schema[keyof Schema]>>
  }
}
