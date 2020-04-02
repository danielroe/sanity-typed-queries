import { DocumentField, UnnamedField, FieldType } from './schema/fields'

import { splitStringByCase } from './utils'
import { RuleForRequired } from './schema/validation'
import { QueryBuilder } from './query/builder'

interface SanityDocumentCreator<T = never> {
  [key: string]: UnnamedField<T>
}

type RequiredField<T> = T
type OptionalField<T> = T | undefined

export type SanityDocumentObject<T extends SanityDocumentCreator<any>> = {
  [P in keyof T]: 'validation' extends keyof T[P]
    ? ReturnType<NonNullable<T[P]['validation']>> extends RuleForRequired
      ? RequiredField<FieldType<T[P]>>
      : OptionalField<FieldType<T[P]>>
    : OptionalField<FieldType<T[P]>>
}

// eslint-disable-next-line
export function extractType<T extends SanityDocumentCreator>(_schema: T) {
  return {} as SanityDocumentObject<T>
}

export function createSanityDocument<T extends SanityDocumentCreator>(
  documentTitle: string,
  schema: T
): DocumentField {
  return {
    name: documentTitle,
    title: splitStringByCase(documentTitle),
    type: 'document' as const,
    fields: Object.entries(schema).map(([key, value]) => ({
      // eslint-disable-next-line
      // @ts-ignore
      title: splitStringByCase(key),
      ...value,
      name: key,
    })),
  }
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
    type: '_type'
    name: T
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

export function createSchema<
  Schema extends SanityDocumentCreator,
  SchemaName extends string
>(documentTitle: SchemaName, schema: Schema) {
  return {
    schema,
    builder: new QueryBuilder(
      schema as Schema & ExtraFields<SchemaName>,
      documentTitle
    ),
    type: extractType(schema as Schema & ExtraFields<SchemaName>),
    document: createSanityDocument(documentTitle, schema),
  }
}
