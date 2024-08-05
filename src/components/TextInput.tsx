import { ChangeEvent } from 'react'

export default function TextInput({
  label,
  name,
  type = 'text',
  placeholder = '',
  onChange,
  value,
  defaultValue,
  className,
  attributes,
  error,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  value?: any
  defaultValue?: any
  className?: string
  attributes?: React.InputHTMLAttributes<HTMLInputElement>
  error?: string
}) {
  const baseClassName =
    'block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
  return (
    <div>
      <label
        htmlFor={`${name}`}
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        {label}
      </label>
      <div className='relative mt-2 rounded-md shadow-sm'>
        <input
          id={`${name}`}
          name={`${name}`}
          type={`${type}`}
          placeholder={`${placeholder}`}
          className={className ? className : baseClassName}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          {...attributes}
        />
        <span className='col-start-2 col-span-2 text-xs text-red-400'>
          {error}
        </span>
      </div>
    </div>
  )
}
