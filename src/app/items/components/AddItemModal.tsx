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
import { toast, ToastContainer } from 'react-toastify'

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
  }

  const handleSubmit = async () => {
    try {
      const formData = {
        name: form.name,
        code: form.code,
        price: form.price,
      }

      let url = 'http://localhost:3000/items/create'

      const response = await axios.post(url, formData)

      if (response.status === 201) {
        toast.success('Data berhasil ditambahkan')
        fetchData()
        handleClose()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {

        const errorMessage =
          error.response?.data?.message || 'An error occurred'
        const errorStatus = error.response?.status

        toast.error(`Gagal menghapus data: ${errorMessage}`)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
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
                    />
                    <TextInput
                      label='Nama'
                      name='name'
                      placeholder='RTX 4060 Ti'
                      onChange={(e) => handleChange(e)}
                    />
                    <NumberInput
                      label='Price'
                      name='price'
                      placeholder='6000000'
                      onChange={(e) => handleChange(e)}
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
