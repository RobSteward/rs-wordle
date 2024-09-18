import * as React from 'react'
import { Formik, FormikProps, FormikValues, FormikHelpers } from 'formik'

interface ThemedFormProps {
  initialValues: FormikValues
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ) => void | Promise<any>
  validationSchema: any
  children: (props: FormikProps<FormikValues>) => React.ReactNode
}

const ThemedForm: React.FC<ThemedFormProps> = ({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<FormikValues>) => children(formikProps)}
    </Formik>
  )
}

export default ThemedForm
