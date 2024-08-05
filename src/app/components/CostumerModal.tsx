import TextInput from '@app/components/TextInput'
import useDebounce from '@app/hooks/useDebounce'
import { ICustomer } from '@app/interfaces/customer.interface'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { useCallback, useEffect, useState } from 'react'

export interface CustomerForm {
  code: number | null
  name: string
  phone: string
}

export default function CustomerModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: CustomerForm) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [form, setForm] = useState<CustomerForm>({
    code: null,
    name: '',
    phone: '',
  })

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const debounce = useDebounce(query, 500)

  const fetchConsumer = useCallback(() => {
    let url = 'http://localhost:3000/customers'

    if (debounce !== undefined) url = url + `?query=${debounce}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data)
      })
  }, [debounce])

  useEffect(() => {
    if (debounce) {
      fetchConsumer()
    }
  }, [fetchConsumer, debounce])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget

    if (value != '') {
      setQuery(value)
      return
    }
    clearSearch()
  }

  const onSelect = (customer: ICustomer) => {
    setForm({
      code: customer.id,
      name: customer.name,
      phone: customer.phone,
    })

    clearSearch()
  }

  const clearSearch = () => {
    setQuery('')
    setCustomers([])
  }

  return (
    <Dialog open={open} onClose={handleClose} className='relative z-10'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
      />
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
          >
            <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full'>
                  <DialogTitle
                    as='h3'
                    className='mb-5 text-base font-semibold leading-6 text-gray-900'
                  >
                    Pilih Customer
                  </DialogTitle>
                  <div className='relative mt-2 space-y-4 border-b pb-4'>
                    <TextInput
                      label='Cari'
                      name='search'
                      placeholder='John Doe'
                      onChange={(e) => handleSearch(e)}
                    />
                    {customers.length > 0 && (
                      <div className='absolute z-10 top-14 left-0 right-0 bg-white border rounded-md sm:text-sm max-h-20 overflow-scroll'>
                        {customers.map((customer) => {
                          return (
                            <p
                              key={customer.id}
                              className='py-2 px-2 hover:bg-blue-400'
                              onClick={() => onSelect(customer)}
                            >
                              {customer.name}
                            </p>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className='mt-2 space-y-4'>
                    <TextInput
                      label='Code'
                      name='code'
                      defaultValue={form.code}
                      attributes={{ readOnly: true, disabled: true }}
                      className={`bg-gray-300/45 cursor-not-allowed text-sm w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 cursor-not-allowed' }`}
                    />
                    <TextInput
                      label='Nama'
                      name='name'
                      defaultValue={form.name}
                      attributes={{ readOnly: true, disabled: true }}
                      className={`bg-gray-300/45 cursor-not-allowed text-sm w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 cursor-not-allowed' }`}
                    />
                    <TextInput
                      label='Telp'
                      name='phone'
                      defaultValue={form.phone}
                      attributes={{ readOnly: true, disabled: true }}
                      className={`bg-gray-300/45 cursor-not-allowed text-sm w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 cursor-not-allowed' }`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
              <button
                type='button'
                className='inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto'
                onClick={() => onAdd(form)}
              >
                Tambah
              </button>
              <button
                type='button'
                data-autofocus
                onClick={handleClose}
                className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
