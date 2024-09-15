import React from 'react'
import { useFormikContext } from 'formik'
import ThemedButton from './ThemedButton'

interface ThemedFormSubmitProps {
  buttonAction: string
}
const DefaultFormButton = ({ buttonAction }: ThemedFormSubmitProps) => {
  const { handleSubmit, isValid, isSubmitting } = useFormikContext()

  return (
    <ThemedButton
      onPress={handleSubmit}
      loading={isSubmitting}
      title={buttonAction}
      disabled={!isValid || isSubmitting}
      primary={true}
    />
  )
}
export default DefaultFormButton
