import type { Block, File, Geopoint, Image, Reference, Slug } from '../types'

import type {
  ArrayRule,
  Validator,
  DatetimeRule,
  NumberRule,
  StringRule,
  URLRule,
} from './validation'

type Component = () => any

interface Fieldset {
  name: string
  title?: string
  options?: {
    /**
     * If set to true, the object will make the fieldsets collapsible. By default, objects will be collapsible when reaching a depth/nesting level of 3. This can be overridden by setting collapsible: false
     */
    collapsible?: boolean
    /**
     * Set to true to display fieldsets as collapsed initially. This requires the collapsible option to be set to true and determines whether the fieldsets should be collapsed to begin with.
     */
    collapsed?: boolean
  }
}

export interface BaseField {
  /**
   * Required. The field name. This will be the key in the data record.
   */
  name: string
  /**
   * Human readable label for the field.
   */
  title?: string
  /**
   * If set to true, this field will be hidden in the studio.
   */
  hidden?: boolean
  /**
   * If set to true, this field will not be editable in the content studio.
   */
  readOnly?: boolean
  /**
   * Short description to editors how the field is to be used.
   */
  description?: string
  // Studio options
  icon?: Component
  inputComponent?: Component
  options?: {
    [key: string]: any
  }
}

export interface ArrayField<
  CustomObjectName extends string = never,
  CustomDocuments extends { type: string } = never
> extends BaseField {
  type: 'array'
  /**
   * Defines which types are allowed as members of the array.
   */
  of: Array<
    | Omit<ReferenceField<CustomDocuments>, 'name'>
    | (PureType<CustomObjectName> & Partial<BaseField>)
    | (Pick<Field, 'type'> & Partial<Field>)
  >
  options?: {
    /**
     * Controls whether the user is allowed to reorder the items in the array. Defaults to true.
     */
    sortable?: boolean
    /**
     * If set to tags, renders the array as a single, tokenized input field. This option only works if the array contains strings.

      If set to grid it will display in a grid
     */
    layout?: 'grid' | 'tags'
    /**
     * [ {value: <value>, title: <title>}, { … } ] renders check boxes for titles and populates a string array with selected values
     */
    list?: Array<{ value: string; title: string }>
    /**
     * Controls how the modal (for array content editing) is rendered. You can choose between dialog, fullscreen or popover. Default is dialog.
     */
    editModal?: 'dialog' | 'fullscreen' | 'popover'
  }
  validation?: Validator<ArrayRule>
}

interface BlockEditor {
  icon?: Component
  render?: Component
}

interface BlockStyle {
  title: string
  value: string
  blockEditor?: BlockEditor
}

interface Marks {
  annotations?: Array<Field & { blockEditor?: BlockEditor }>
  decorators?: BlockStyle[]
}

export interface BlockField extends BaseField {
  type: 'block'
  /**
   * This defines which styles that applies to blocks. A style is an object with a title (will be displayed in the style dropdown) and a value, e.g.: styles: [{title: 'Quote', value: 'blockquote'}]. If no styles are given, the default styles are H1 up to H6 and blockquote. A style named normal is reserved, always included and represents "unstyled" text. If you don't want any styles, set this to an empty array e.g.: styles: [].
   */
  styles?: Array<BlockStyle>
  /**
   * What list types that can be applied to blocks. Like styles above, this also is an array of "name", "title" pairs, e.g.: {title: 'Bullet', value: 'bullet'}. Default list types are bullet and number.
   */
  lists?: Array<BlockStyle>
  /**
   * An object defining which .decorators (array) and .annotations (array) are allowed.
   */
  marks?: Marks
  /**
   * An array of inline content types that you can place in running text from the Insert menu.
   */
  of?: Array<{ type: Field['type'] } & Partial<Field>>
  /**
   * To return icon showed in menus and toolbar
   */
  icon?: Component
  validation?: Validator
}

interface BooleanField extends BaseField {
  type: 'boolean'
  options?: {
    /**
     * Either switch (default) or checkbox

      This lets you control the visual appearance of the input. By default the input for boolean fields will display as a switch, but you can also make it appear as a checkbox
     */
    layout: 'switch' | 'checkbox'
  }
  validation?: Validator
}

interface DateField extends BaseField {
  type: 'date'
  options?: {
    /**
     * Controls how the date input field formats the displayed date. Use any valid Moment format option. Default is YYYY-MM-DD.
     */
    dateFormat?: string
    /**
     * Label for the "jump to today" button on the date input widget. Default is Today.
     */
    calendarTodayLabel?: string
  }
  validation?: Validator
}

interface DatetimeField extends BaseField {
  type: 'datetime'
  options?: {
    /**
     * Controls how the date input field formats the displayed date. Use any valid Moment format option. Default is YYYY-MM-DD.
     */
    dateFormat?: string
    /**
     * Controls how the time input field formats the displayed date. Use any valid Moment format option. Default is HH:mm.
     */
    timeFormat?: string
    /**
     * Number of minutes between each entry in the time input. Default is 15 which lets the user choose between 09:00, 09:15, 09:30 and so on.
     */
    timeStep?: number
    /**
     * Label for the "jump to today" button on the date input widget. Default is today.
     */
    calendarTodayLabel?: string
  }
  validation?: Validator<DatetimeRule>
}

export interface DocumentField<T extends Record<string, any>>
  extends BaseField {
  type: 'document'
  initialValue?: Record<string, any> | (() => Record<string, any>)
  /**
   * A declaration of possible ways to order documents of this type.
   */
  orderings?: any[]
  /**
   * The fields of this object. At least one field is required.
   */
  fields: DefinedFields<T> | Field[]
  /**
   * A list of fieldsets that fields may belong to.
   */
  fieldsets?: Fieldset[]
  /**
   * Use this to implement an override for the default preview for this type.
   */
  preview?: any
}

interface FileField<T extends Record<string, any>> extends BaseField {
  type: 'file'
  /**
   * An array of optional fields to add to the file field. The fields added here follow the same pattern as fields defined on objects. This is useful for allowing users to add custom metadata related to the usage of this file (see example below).
   */
  fields?: DefinedFields<T> | Field[]
  options?: {
    /**
     * This will store the original filename in the asset document. Please be aware that the name of uploaded files could reveal potentially sensitive information (e.g. top_secret_planned_featureX.pdf). Default is true.
     */
    storeOriginalFilename?: boolean
    /**
     * This specifies which mime types the file input can accept. Just like the accept attribute on native DOM file inputs and you can specify any valid file type specifier: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
     */
    accept?: string
  }
  validation?: Validator
}

interface GeopointField extends BaseField {
  type: 'geopoint'
  validation?: Validator
}

interface ImageField<T extends Record<string, any>> extends BaseField {
  type: 'image'
  /**
   * An array of optional fields to add to the image record. The fields added here follow the same pattern as fields defined on objects. This is useful for adding custom properties like caption, attribution, etc. to the image record itself (see example below). In addition to the common field attributes, each field may also have an isHighlighted option which dictates whether it should be prominent in the edit UI or hidden in a dialog modal behind an edit button (see example below).
   */
  fields?: DefinedFields<T> | Field[]
  // TODO:
  // ObjectField<any>['fields'][0] & { options?: { isHighlighted?: boolean } }
  options?: {
    /**
     * This option defines what metadata the server attempts to extract from the image. The extracted data is writtten into the image asset. This field must be an array of strings where accepted values are exif, location, lqip and palette.
     */
    metadata?: Array<'exif' | 'location' | 'lqip' | 'palette'>
    /**
     * Enables the user interface for selecting what areas of an image should always be cropped, what areas should never be cropped and the center of the area to crop around when resizing. The hotspot data is stored in the image field itself, not in the image asset, so images can have different crop and center for each place they are used.

     Hotspot makes it possible to responsively adapt the images to different aspect ratios at display time. The default is value for hotspot is false.
     */
    hotspot?: boolean
    /**
     * This will store the original filename in the asset document. Please be aware that the name of uploaded files could reveal potentially sensitive information (e.g. top_secret_planned_featureX.pdf). Default is true.
     */
    storeOriginalFilename?: boolean
    /**
     * This specifies which mime types the image input can accept. Just like the accept attribute on native DOM file inputs and you can specify any valid file type specifier: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
     */
    accept?: string
    /**
     * Lock the asset sources available to this type to a spesific subset. Import the plugins by their part name, and use the import variable name as array entries. The built in default asset source has the part name part:@sanity/form-builder/input/image/asset-source-default
     */
    sources?: any[]
  }
  validation?: Validator
}

interface NumberField extends BaseField {
  type: 'number'
  validation?: Validator<NumberRule>
}

interface ObjectField<T extends Record<string, any>> extends BaseField {
  type: 'object'
  /**
   * The fields of this object. At least one field is required.
   */
  fields: DefinedFields<T> | Field[]
  /**
   * A list of fieldsets that fields may belong to.
   */
  fieldsets?: Fieldset[]
  /**
   * Use this to implement an override for the default preview for this type.
   */
  preview?: any
  options?: {
    /**
     * If set to true, the object will make the fields collapsible. By default, objects will be collapsible when reaching a depth/nesting level of 3. This can be overridden by setting collapsible: false
     */
    collapsible?: boolean
    /**
     * Set to true to display fields as collapsed initially. This requires the collapsible option to be set to true and determines whether the fields should be collapsed to begin with.
     */
    collapsed?: boolean
  }
  validation?: Validator
}

interface ReferenceField<CustomType extends { type: string } = never>
  extends BaseField {
  type: 'reference'
  /**
   * Required. Must contain an array naming all the types which may be referenced e.g. [{type: 'person'}]. See more examples below.
   */
  to: Array<PureType<CustomType['type']>>
  /**
   * Default false. If set to true the reference will be made weak. This means you can discard the object being referred to without first deleting the reference, thereby leaving a dangling pointer.
   */
  weak?: boolean
  options?: {
    /**
     * Additional GROQ-filter to use when searching for target documents. The filter will be added to the already existing type name clause.

      If a function is provided, it is called with an object containing document, parent and parentPath properties, and should return an object containing filter and params.

      Note: The filter only constrains the list of documents returned at the time you search. It does not guarantee that the referenced document will always match the filter provided.
     */
    filter?:
      | string
      | ((context: {
          document: DocumentField<Record<string, unknown>>
          parent: Field
          parentPath: string
        }) => { filter: string; params: Record<string, any> })
    /**
     * Object of parameters for the GROQ-filter specified in filter.
     */
    filterParams?: Record<string, any>
  }
  validation?: Validator
}

interface SlugField extends BaseField {
  type: 'slug'
  options?: {
    /**
     * The name of the field which the slug value is derived from. You can supply a function, instead of a string. If so, the source function is called with two parameters: doc (object - the current document) and options (object - with parent and parentPath keys for easy access to sibling fields).
     */
    source?:
      | string
      | ((
          doc: DocumentField<Record<string, unknown>>,
          options: { parent: Field; parentPath: string }
        ) => string)
    /**
     * Maximum number of characters the slug may contain. Defaults to 200.
     */
    maxLength?: number
    /**
     * Supply a custom override function which handles string normalization. slugify is called with two parameters: input (string) and type (object - schema type). If slugify is set, the maxLength option is ignored.
     */
    slugify?: (input: string, type: Field) => string
    /**
     * Supply a custom function which checks whether or not the slug is unique. Receives the proposed slug as the first argument and an options object.
     */
    isUnique?: (slug: string, options: SlugField['options']) => boolean
  }
  validation?: Validator
}

interface SpanField extends BaseField {
  type: 'span'
  validation?: Validator
}

interface StringField extends BaseField {
  type: 'string'
  options?: {
    /**
     * A list of predefined values that the user can choose from. The array can either include string values ['sci-fi', 'western'] or objects [{title: 'Sci-Fi', value: 'sci-fi'}, ...]
     */
    list?: Array<string | { title: string; value: string }>
    /**
     * Controls how the items defined in the list option are presented. If set to 'radio' the list will render radio buttons. If set to 'dropdown' you'll get a dropdown menu instead. Default is dropdown.
     */
    layout?: 'radio' | 'dropdown'
    /**
     * Controls how radio buttons are lined up. Use direction: 'horizontal|vertical' to render radio buttons in a row or a column. Default is vertical. Will only take effect if the layout option is set to radio.
     */
    direction?: 'horizontal' | 'vertical'
  }
  validation?: Validator<StringRule>
}

interface TextField extends BaseField {
  type: 'text'
  rows?: number
  validation?: Validator<StringRule>
}

export interface URLField extends BaseField {
  type: 'url'
  validation?: Validator<URLRule>
}

export interface CustomField<A extends string> extends BaseField {
  type: A
  validation?: Validator
}

export type Nameless<T> = Omit<T, 'name'>

export type UnnamedField<
  CustomObjects extends { type: string } = { type: never },
  CustomDocuments extends { type: string } = { type: never }
> =
  | Nameless<ArrayField<CustomObjects['type'], CustomDocuments>>
  | Nameless<BlockField>
  | Nameless<BooleanField>
  | Nameless<DateField>
  | Nameless<DatetimeField>
  // | Nameless<DocumentField>
  | Nameless<FileField<any>>
  | Nameless<GeopointField>
  | Nameless<ImageField<any>>
  | Nameless<NumberField>
  | Nameless<ObjectField<any>>
  | Nameless<ReferenceField<CustomDocuments>>
  | Nameless<SlugField>
  | Nameless<SpanField>
  | Nameless<StringField>
  | Nameless<TextField>
  | Nameless<URLField>
  | CustomObjects

type PureType<T extends string> = { type: T }

export const type = Symbol('the type of the property')

export type Field = UnnamedField & { name: string }

export type DefinedFields<T> = Array<Field & { [type]: T }>

type CustomTypeName<T extends { _type: string }> = { type: T['_type'] }

export type FieldType<
  T extends UnnamedField<any>,
  CustomObjects extends { _type: string }
> =
  //
  T extends PureType<'array'> & { of: Array<infer B> }
    ? Array<FieldType<B, CustomObjects>>
    : T extends PureType<'block'>
    ? Block
    : T extends PureType<'boolean'>
    ? boolean
    : T extends
        | PureType<'date'>
        | PureType<'datetime'>
        | PureType<'string'>
        | PureType<'text'>
        | PureType<'url'>
    ? string
    : T extends PureType<'file'>
    ? File
    : T extends PureType<'geopoint'>
    ? Geopoint
    : T extends Nameless<ImageField<infer A>>
    ? Image & A
    : T extends PureType<'image'>
    ? Image
    : T extends PureType<'number'>
    ? number
    : T extends Nameless<ObjectField<infer A>>
    ? A
    : T extends PureType<'reference'> & { to: Array<infer B> }
    ? Reference<FieldType<B, CustomObjects>>
    : T extends PureType<'slug'>
    ? Slug
    : T extends { [type]: infer B }
    ? B
    : T extends CustomTypeName<CustomObjects>
    ? Extract<CustomObjects, { _type: T['type'] }>
    : Record<string, any>
