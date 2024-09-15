import React from 'react'
import { Text, TextInput, TextInputProps, Icon } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import { useField } from 'formik'

interface ThemedFormFieldProps extends TextInputProps {
  name: string
  label: string
  placeholder?: string
  autoFocus?: boolean
}

const ThemedFormField: React.FC<ThemedFormFieldProps> = ({
  name,
  label,
  placeholder,
  autoFocus,
  ...props
}) => {
  const [field, meta, helpers] = useField({ name })

  const showError = meta.error && meta.touched

  return (
    <>
      <View style={styles.container}>
        <TextInput
          mode='flat'
          {...props}
          label={label}
          placeholder={placeholder}
          value={field.value}
          onBlur={field.onBlur(name)}
          onChangeText={field.onChange(name)}
        />
        {showError && (
          <View style={styles.errorContainer}>
            <Icon
              source={'alert-circle-outline'}
              size={24}
              color={'red'}
            />
            <Text style={styles.errorText}>{meta.error}</Text>
          </View>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    marginLeft: 8,
  },
})

export default ThemedFormField
