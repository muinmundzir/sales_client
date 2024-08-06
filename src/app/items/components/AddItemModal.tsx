import NumberInput from '@app/components/NumberInput'
import TextInput from '@app/components/TextInput'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddItemModal({
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
    code: '',
    name: '',
    price: '',
  })
  const [errors, setErrors] = useState({
    errorCount: 0,
    code: '',
    name: '',
    price: '',
  })

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()

    Object.keys(errors).forEach((key) => {
      const value = key
      if (value) {
        handleClearErrors(value)
      }
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget

    setForm((prevValue) => ({
      ...prevValue,
      [name]: value,
    }))
    handleClearErrors(name)
  }

  const handleClearErrors = (field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: '',
      errorCount: prev.errorCount - 1,
    }))
  }

  const handleSubmit = async () => {
    const errorCount = validateForm()

    if (errorCount > 0) {
      toast.error('Ada kesalahan isian pada form')
      return
    }

    const formData = {
      name: form.name,
      code: form.code,
      price: form.price,
    }

    try {
      let url = 'http://localhost:3000/items/create'

      const response = await axios.post(url, formData)

      if (response.status === 201) {
        toast.success('Data berhasil disimpan')
        fetchData()
        setOpen(false)
        onClose()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Terjadi kesalahan'

        toast.error(`Gagal menginput data: ${errorMessage}`)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (form.name === '') {
      newErrors.name = 'Nama barang tidak boleh kosong'
    }

    if (form.code === '') {
      newErrors.code = 'Kode barang tidak boleh kosong'
    }

    if (form.price === '') {
      newErrors.price = 'Harga tidak boleh kosong'
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
                    Item detail
                  </DialogTitle>
                  <div className='mt-2 space-y-4'>
                    <TextInput
                      label='Code'
                      name='code'
                      placeholder='XXX-000'
                      onChange={(e) => handleChange(e)}
                      error={errors.code}
                      className={`col-span-2 bg-white w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.code ? 'border-red-400' : 'border-slate-300 '}`}
                    />
                    <TextInput
                      label='Nama'
                      name='name'
                      placeholder='RTX 4060 Ti'
                      onChange={(e) => handleChange(e)}
                      error={errors.name}
                      className={`col-span-2 bg-white w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.name ? 'border-red-400' : 'border-slate-300 '}`}
                    />
                    <NumberInput
                      label='Price'
                      name='price'
                      placeholder='6000000'
                      onChange={(e) => handleChange(e)}
                      error={errors.price}
                      className={`col-span-2 bg-white w-full border rounded-md py-2 pl-10 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${errors.price ? 'border-red-400' : 'border-slate-300 '}`}
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
    </Dialog>
  )
}
