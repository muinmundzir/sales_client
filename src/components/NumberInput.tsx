import { ChangeEvent } from 'react'

export default function NumberInput({
  label,
  name,
  placeholder,
  onChange,
  className,
  value,
  defaultValue,
  disabled,
}: {
  label?: string
  name: string
  placeholder?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  value?: any
  defaultValue?: any
  disabled?: boolean
}) {
  const baseClassName =
    'block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
  return (
    <div>
      <label
        htmlFor={`${name}`}
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        {label}
      </label>
      <div className='relative mt-2 rounded-md shadow-sm'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <span className='text-gray-500 sm:text-sm'>Rp.</span>
        </div>
        <input
          id={`${name}`}
          name={`${name}`}
          type='text'
          placeholder={`${placeholder}`}
          className={className ? className : baseClassName}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
