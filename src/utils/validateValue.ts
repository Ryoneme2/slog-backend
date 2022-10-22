import { z } from 'zod'

const validateType = (type: 'string' | 'boolean' | 'number', input: any, label: string) => {
  return z[type]({
    required_error: label + " is required",
    invalid_type_error: label + " must be a string",
  }).parse(input)
}
const validateEmail = (input: any, label: string) => {
  return z.string({
    required_error: label + " is required",
    invalid_type_error: label + " must be a string",
  }).email({ message: "Invalid email address" }).parse(input)
}


export const simpleValidate = {
  string: (input: any, label: string) => validateType('string', input, label),
  bool: (input: any, label: string) => validateType('boolean', input, label),
  number: (input: any, label: string) => validateType('number', input, label),
  mail: (input: any, label: string) => validateEmail(input, label)
}