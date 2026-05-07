import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormInput from './FormInput'
import FormButton from './FormButton'

interface ModalWithInputsProps {
  title: string
  inputs: Array<{ label: string; name: string; type?: string; required?: boolean }>
  onSubmit: (formData: Record<string, string>) => void
  onClose: () => void
  submitButtonText: string
  cancelButtonText: string
}

function ModalWithInputs({ title, inputs, onSubmit, onClose, submitButtonText, cancelButtonText }: ModalWithInputsProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    inputs.forEach((input) => {
      if (input.required && !formData[input.name]?.trim()) {
        newErrors[input.name] = t('errors.fieldRequired', { field: input.label })
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div className="bg-surface dark:bg-surface-dark w-full max-w-sm rounded-lg p-5 shadow-lg md:max-w-lg">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="mt-6 flex w-full flex-col gap-4">
          {inputs.map((input) => (
            <FormInput
              key={input.name}
              label={input.label}
              name={input.name}
              type={input.type || 'text'}
              value={formData[input.name] || ''}
              onChange={handleChange}
              error={errors[input.name]}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <FormButton className="bg-gray-500" onClick={onClose}>
            {cancelButtonText}
          </FormButton>
          <FormButton className="bg-accent" onClick={handleSubmit}>
            {submitButtonText}
          </FormButton>
        </div>
      </div>
    </div>
  )
}

export default ModalWithInputs
