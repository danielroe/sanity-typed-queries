import { UnnamedField, FieldType } from '../schema/fields'
import { extraFields } from '../extractor'

export const type = Symbol('Return type of a query')

type QueryReturnType<T> = [() => string, T extends Array<any> ? T : T | null]

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
  private projections: Record<string, string> = {}
  private selector = ''
  private schema: Schema
  private unproject = false
  private ordering: [keyof Schema, 'asc' | 'desc'][] = []
  private type: SchemaType

  constructor(schema: Schema, type: SchemaType) {
    this.schema = { ...schema, ...extraFields(type) }
    this.type = type
  }

  orderBy<Key extends keyof Schema>(key: Key, order: 'asc' | 'desc' = 'asc') {
    this.ordering.push([key, order])
    return this
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
    this.selector = `[${from}..${inclusive ? '.' : ''}${to}]`
    return this as Omit<
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
    if (Array.isArray(props)) {
      this.projections = Object.entries(this.schema).reduce((obj, [key]) => {
        if (props.includes(key as R)) obj[key] = key
        return obj
      }, {} as Record<string, string>)
    } else {
      this.projections = {
        [props]: this.schema[props],
      }
      this.unproject = true
    }

    return this as Omit<
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
    this.selector = '[0]'
    return this as Omit<
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
      () => this.query,
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
