import { z } from 'zod'

const validateType = (type: 'string' | 'boolean' | 'number', input: any, label: string) => {
  const v = z[type]({
    required_error: label + " is required",
    invalid_type_error: label + " must be a string",
  })

  return v.parse(input)
}


export const simpleValidate = {
  string: (input: any, label: string) => validateType('string', input, label),
  bool: (input: any, label: string) => validateType('boolean', input, label),
  number: (input: any, label: string) => validateType('number', input, label)
}