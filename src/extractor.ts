import { UnnamedField, FieldType, DefinedFields, type } from './schema/fields'

import { splitStringByCase } from './utils'
import { RuleForRequired } from './schema/validation'
import { QueryBuilder } from './query/builder'

interface SchemaCreator<T = never> {
  [key: string]: UnnamedField<T>
}

type RequiredField<T> = T
type OptionalField<T> = T | undefined

export type SchemaTyper<T extends SchemaCreator<any>> = {
  [P in keyof T]: 'validation' extends keyof T[P]
    ? ReturnType<NonNullable<T[P]['validation']>> extends RuleForRequired
      ? RequiredField<FieldType<T[P]>>
      : OptionalField<FieldType<T[P]>>
    : OptionalField<FieldType<T[P]>>
}

interface ExtraFields<T extends string = string> {
  _createdAt: {
    type: 'string'
  }
  _updatedAt: {
    type: 'string'
  }
  _id: {
    type: 'string'
  }
  _rev: {
    type: 'string'
  }
  _type: {
    [type]: T
  }
}

export function extraFields<T extends string>(name: T) {
  return {
    _createdAt: {
      type: 'string',
    },
    _updatedAt: {
      type: 'string',
    },
    _id: {
      type: 'string',
    },
    _rev: {
      type: 'string',
    },
    _type: {
      type: '_type',
      name,
    },
  }
}

/**
 * This transforms an object into a typed array that can be consumed for type inference.
 */
export function defineFields<Schema extends SchemaCreator>(fields: Schema) {
  return Object.entries(fields).map(([key, value]) => ({
    title: splitStringByCase(key),
    ...value,
    name: key,
  })) as DefinedFields<SchemaTyper<Schema>>
}

export function defineDocument<
  Schema extends SchemaCreator,
  SchemaName extends string
>(documentTitle: SchemaName, schema: Schema) {
  return {
    /**
     * What is passed in, in case you need access to the underlying (typed) object.
     */
    schema,
    /**
     * Typed query builder for the document created
     */
    builder: new QueryBuilder(
      ({ ...schema, ...extraFields(documentTitle) } as unknown) as Schema &
        ExtraFields<SchemaName>,
      documentTitle
    ),
    /**
     * Defined document that you can export as the schema type to be consumed by the Sanity CMS
     */
    document: {
      name: documentTitle,
      fields: defineFields(schema),
      title: splitStringByCase(documentTitle),
      type: 'document' as const,
    },
  }
}
