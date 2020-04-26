interface RegexpRuleOptions {
  /**
   * Providing a name will make the message more understandable to the user ("Does not match the <name>-pattern").
   */
  name?: string
  /**
   * Set invert to true in order to allow any value that does NOT match the pattern.
   */
  invert?: true
}

export interface BaseRule {
  /**
   * Creates a custom validation rule.
   */
  custom: <T = any>(value: T) => true | string
  /**
   * Ensures that this field exists.
   */
  required: () => this & RuleForRequired
  /**
   * Allows you to reference the value of a sibling field.
   */
  valueOfField: (field: string) => any
}

export interface ArrayRule extends BaseRule {
  /**
   * Exact number of array elements to allow.
   */
  length: (exactLength: number) => this
  /**
   * Maximum number of elements in array.
   */
  max: (maxLength: number) => this
  /**
   * Minimum number of elements in array.
   */
  min: (minLength: number) => this
  /**
   * Requires all values within the array to be unique. Does a deep comparison, only excluding the _key property when comparing objects.
   */
  unique: () => this
}

export interface DatetimeRule extends BaseRule {
  /**
   * Maximum date (inclusive). maxDate should be in ISO 8601 format.
   */
  max: (maxDate: string) => this
  /**
   * Minimum date (inclusive). minDate should be in ISO 8601 format.
   */
  min: (minDate: string) => this
}

export interface NumberRule extends BaseRule {
  /**
   * Value must be greater than the given limit.
   */
  greaterThan: (limit: number) => this
  /**
   * Value must be an integer (no decimals).
   */
  integer: () => this
  /**
   * Value must be less than the given limit.
   */
  lessThan: (limit: number) => this
  /**
   * Maximum value (inclusive).
   */
  max: (maxNumber: number) => this
  /**
   * Minimum value (inclusive).
   */
  min: (minNumber: number) => this
  /**
   * Requires the number to be negative (< 0).
   */
  negative: () => this
  /**
   * Specifies the maximum number of decimal places allowed.
   */
  precision: (limit: number) => this
  /**
   * Requires the number to be positive (>= 0).
   */
  positive: () => this
}

export interface StringRule extends BaseRule {
  /**
   * Exact length of string.
   */
  length: (exactLength: number) => this
  /**
   * All characters must be lowercase.
   */
  lowercase: () => this
  /**
   * Maximum length of string.
   */
  max: (maxLength: number) => this
  /**
   * Minimum length of string.
   */
  min: (minLength: number) => this
  /**
   * String must match the given pattern.
   */
  regex: (pattern: RegExp, options?: RegexpRuleOptions) => this
  /**
   * All characters must be uppercase.
   */
  uppercase: () => this
}

export interface URLRule extends BaseRule {
  uri: (options: {
    /**
     * String, RegExp or Array of schemes to allow (default: ['http', 'https']).
     */
    scheme?: string | RegExp | Array<string | RegExp>
    /**
     * Whether or not to allow relative URLs (default: false).
     */
    allowRelative?: boolean
    /**
     * Whether to only allow relative URLs (default: false).
     */
    relativeOnly?: boolean
  }) => this
}

// eslint-disable-next-line
const required = Symbol('designates a required field')

export type RuleForRequired = {
  /**
   * This property does not exist and is only used for typing.
   */
  [required]: undefined
}

export type Validator<T = BaseRule> = (rule: T) => T
