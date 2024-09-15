import * as Yup from 'yup'
import isEmailValidator from 'validator/lib/isEmail'

export const validateEmail = Yup.string()
  .label('Email')
  .required('Required')
  .test(
    'is-valid',
    (message) => `${message.path} is invalid`,
    (value) =>
      value ? isEmailValidator(value) : new Yup.ValidationError('Invalid value')
  )

export const validatePassword = Yup.string()
  .label('Password')
  .required('Required')
  .min(8, ({ min }) => `Password must be at least ${min} characters`)
  .matches(/\w*[a-z]\w*/, 'Password must have at least one lowercase letter')
  .matches(/\w*[A-Z]\w*/, 'Password must have at least one uppercase letter')
  .matches(/\d/, 'Password must have at least one number')
  .matches(
    /[!@#$%^&*()\-_"=+{}; :,<.>]/,
    'Password must have at least one special character'
  )

export const validateConfirmPassword = Yup.string()
  .label('Confirm Password')
  .required('Required')
  .oneOf([Yup.ref('password')], 'Passwords do not match')
