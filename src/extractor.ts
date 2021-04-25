import { QueryBuilder } from './query/builder'
import type {
  UnnamedField,
  FieldType,
  DefinedFields,
  Nameless,
  CustomField,
  DocumentField,
} from './schema/fields'
import type { RuleForRequired } from './schema/validation'
import { splitStringByCase } from './utils'

type CustomType<A extends string> = {
  _type: A
}

type DocumentTypes<T extends { _type: string }> = Extract<T, { _rev: string }>
type ObjectTypes<T extends { _type: string }> = Exclude<T, { _rev: string }>

interface SchemaCreator<
  O extends { type: string } = { type: never },
  D extends { type: string } = { type: never }
> {
  [key: string]: UnnamedField<O, D>
}

type RequiredField<T> = T
type OptionalField<T> = T | undefined

type SchemaTyper<
  T extends Record<string, any>,
  CustomTypes extends CustomType<string>
> = {
  [P in keyof T]: 'validation' extends keyof T[P]
    ? ReturnType<NonNullable<T[P]['validation']>> extends RuleForRequired
      ? RequiredField<FieldType<T[P], CustomTypes>>
      : OptionalField<FieldType<T[P], CustomTypes>>
    : OptionalField<FieldType<T[P], CustomTypes>>
}

/**
 * This transforms an object into a typed array that can be consumed for type inference.
 */
export function defineFields<
  Schema extends SchemaCreator<
    Nameless<CustomField<ObjectTypes<CustomTypes>['_type']>>,
    Nameless<CustomField<DocumentTypes<CustomTypes>['_type']>>
  >,
  CustomTypes extends CustomType<string>
>(fields: Schema) {
  return Object.entries(fields).map(([key, value]) => ({
    title: splitStringByCase(key),
    ...(value as UnnamedField & { title?: string }),
    name: key,
  })) as DefinedFields<SchemaTyper<Schema, CustomTypes>>
}

type ExtractDocumentType<
  Schema extends SchemaCreator<
    Nameless<CustomField<ObjectTypes<CustomTypes>['_type']>>,
    Nameless<CustomField<DocumentTypes<CustomTypes>['_type']>>
  >,
  SchemaName extends string,
  CustomTypes extends CustomType<string>
> = {
  [P in keyof Schema]?: FieldType<Schema[P], CustomTypes>
} & {
  _createdAt: string
  _updatedAt: string
  _id: string
  _rev: string
  _type: SchemaName
}

type DocumentDefinition<
  Schema extends SchemaCreator<
    Nameless<CustomField<ObjectTypes<CustomTypes>['_type']>>,
    Nameless<CustomField<DocumentTypes<CustomTypes>['_type']>>
  >,
  SchemaName extends string,
  CustomTypes extends CustomType<string>
> = {
  [P in SchemaName]?: ExtractDocumentType<Schema, SchemaName, CustomTypes>
} & {
  schema: Schema
  builder: QueryBuilder<
    ExtractDocumentType<Schema, SchemaName, CustomTypes>,
    ExtractDocumentType<Schema, SchemaName, CustomTypes>,
    Record<string, [string, any]>,
    Array<any>,
    true,
    ''
  >
  document: {
    name: SchemaName
    fields: DefinedFields<SchemaTyper<Schema, CustomTypes>>
    title: string
    type: 'document'
  } & DocumentField<DefinedFields<SchemaTyper<Schema, CustomTypes>>>
}

export function defineDocument<
  Schema extends SchemaCreator<
    Nameless<CustomField<ObjectTypes<CustomTypes>['_type']>>,
    Nameless<CustomField<DocumentTypes<CustomTypes>['_type']>>
  >,
  SchemaName extends string,
  CustomTypes extends CustomType<string> = { _type: never }
>(
  documentTitle: SchemaName,
  schema: Schema,
  types?: CustomTypes[]
): DocumentDefinition<Schema, SchemaName, CustomTypes>

export function defineDocument<
  Schema extends SchemaCreator<never>,
  SchemaName extends string,
  CustomTypes extends CustomType<string>
  // eslint-disable-next-line no-unused-vars
>(documentTitle: SchemaName, schema: Schema, _types?: CustomTypes[]) {
  return {
    /**
     * What is passed in, in case you need access to the underlying (typed) object.
     */
    schema,
    /**
     * Typed query builder for the document created
     */
    builder: new QueryBuilder({
      _type: documentTitle,
    }) as any,
    /**
     * Type for use with query builder
     */
    [documentTitle]: {
      _type: documentTitle,
    },
    /**
     * Defined document that you can export as the schema type to be consumed by the Sanity CMS
     */
    document: {
      name: documentTitle,
      fields: defineFields(schema as any),
      title: splitStringByCase(documentTitle),
      type: 'document' as const,
    },
  }
}

type ObjectDefinition<
  Schema extends SchemaCreator<
    Nameless<CustomField<ObjectTypes<CustomTypes>['_type']>>,
    Nameless<CustomField<DocumentTypes<CustomTypes>['_type']>>
  >,
  SchemaName extends string,
  CustomTypes extends CustomType<string>
> = {
  [P in SchemaName]?: ExtractObjectType<Schema, SchemaName, CustomTypes>
} & {
  schema: Schema
  object: {
    name: SchemaName
    fields: DefinedFields<SchemaTyper<Schema, CustomTypes>>
    title: string
    type: 'object'
  }
}

type ExtractObjectType<
  Schema extends SchemaCreator<
    Nameless<CustomField<ObjectTypes<CustomTypes>['_type']>>,
    Nameless<CustomField<DocumentTypes<CustomTypes>['_type']>>
  >,
  SchemaName extends string,
  CustomTypes extends CustomType<string>
> = {
  [P in keyof Schema]?: FieldType<Schema[P], CustomTypes>
} & { _type: SchemaName }

export function defineObject<
  Schema extends SchemaCreator<
    Nameless<CustomField<ObjectTypes<CustomTypes>['_type']>>,
    Nameless<CustomField<DocumentTypes<CustomTypes>['_type']>>
  >,
  SchemaName extends string,
  CustomTypes extends CustomType<string> = { _type: never }
>(
  documentTitle: SchemaName,
  schema: Schema,
  types?: CustomTypes[]
): ObjectDefinition<Schema, SchemaName, CustomTypes>

export function defineObject<
  Schema extends SchemaCreator<
    Nameless<CustomField<ObjectTypes<CustomTypes>['_type']>>,
    Nameless<CustomField<DocumentTypes<CustomTypes>['_type']>>
  >,
  SchemaName extends string,
  CustomTypes extends CustomType<string> = { _type: never }
>(
  objectTitle: SchemaName,
  schema: Schema,
  // eslint-disable-next-line no-unused-vars
  _types?: CustomTypes[]
): ObjectDefinition<Schema, SchemaName, CustomTypes> {
  return {
    /**
     * What is passed in, in case you need access to the underlying (typed) object.
     */
    schema,
    /**
     * Type for use with query builder
     */
    [objectTitle]: {
      _type: objectTitle,
    } as ExtractObjectType<Schema, SchemaName, CustomTypes>,
    /**
     * Defined object that you can export as the schema type to be consumed by the Sanity CMS
     */
    object: {
      name: objectTitle,
      fields: defineFields(schema),
      title: splitStringByCase(objectTitle),
      type: 'object' as const,
    },
  } as ObjectDefinition<Schema, SchemaName, CustomTypes>
}
