import React from 'react'
import { useFormikContext } from 'formik'
import ThemedButton from './ThemedButton'

interface ThemedFormSubmitProps {
  buttonAction: string
  textColor?: string
}
const DefaultFormButton = ({
  buttonAction,
  textColor,
}: ThemedFormSubmitProps) => {
  const { handleSubmit, isValid, isSubmitting } = useFormikContext()

  return (
    <ThemedButton
      onPress={handleSubmit}
      loading={isSubmitting}
      title={buttonAction}
      disabled={!isValid || isSubmitting}
      primary={true}
      textColor={textColor}
    />
  )
}
export default DefaultFormButton
