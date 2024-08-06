import TextInput from '@app/components/TextInput'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

export default function AddCustomerModal({
  isOpen,
  onClose,
  fetchData,
}: {
  isOpen: boolean
  onClose: () => void
  fetchData: () => void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
  })
  const [errors, setErrors] = useState({
    errorCount: 0,
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget

    setForm((prevValue) => ({
      ...prevValue,
      [name]: value,
    }))
    handleClearErrors(name)
  }

  const handleSubmit = async () => {
    const errorCount = validateForm()

    if (errorCount > 0) {
      toast.error('Ada kesalahan isian pada form', {
        position: 'top-center',
      })
      return
    }

    const formData = {
      name: form.name,
      phone: form.phone,
    }

    try {
      let url = 'http://localhost:3000/customers/create'

      const response = await axios.post(url, formData)

      if (response.status === 201) {
        toast.success('Data berhasil ditambahkan', {
          position: 'top-center',
        })
        handleClose()
        // fetchData()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Terjadi kesalahan'

        toast.error(`Gagal menghapus data: ${errorMessage}`, {
          position: 'top-center',
        })
      } else {
        toast.error('An unexpected error occurred', {
          position: 'top-center',
        })
      }
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (form.name === '') {
      newErrors.name = 'Nama customer tidak boleh kosong'
    }

    if (form.phone === '') {
      newErrors.phone = 'Data telepon tidak boleh kosong'
    }

    const errorCount = Object.keys(newErrors).length

    // Directly update errors state
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
      errorCount,
    }))

    return errorCount
  }

  const handleClearErrors = (field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: '',
      errorCount: prev.errorCount - 1,
    }))
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
                    Customer detail
                  </DialogTitle>
                  <div className='mt-2 space-y-4'>
                    <TextInput
                      label='Nama'
                      name='name'
                      placeholder='John Doe'
                      onChange={handleChange}
                      error={errors.name}
                      className={`col-span-2 bg-white w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.name ? 'border-red-400' : 'border-slate-300 '}`}
                    />
                    <TextInput
                      label='Telepon'
                      name='phone'
                      placeholder='085123457234'
                      onChange={handleChange}
                      error={errors.phone}
                      className={`col-span-2 bg-white w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.phone ? 'border-red-400' : 'border-slate-300 '}`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
              <button
                type='button'
                onClick={handleSubmit}
                className='inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto'
              >
                Submit
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
      <ToastContainer />
    </Dialog>
  )
}
