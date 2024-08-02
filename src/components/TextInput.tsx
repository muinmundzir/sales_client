import { ChangeEvent } from "react"

export default function TextInput({
  label,
  name,
  placeholder,
  onChange
}: {
  label: string
  name: string
  placeholder: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
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
          type='text'
          placeholder={`${placeholder}`}
          className='block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          onChange={onChange}
        />
      </div>
    </div>
  )
}
