import TextInput from '@app/components/TextInput'
import { formatCurrencyIDR } from '@app/helpers/format-currency'
import useDebounce from '@app/hooks/useDebounce'
import { IItem } from '@app/interfaces/item.interface'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

export interface IItemForm {
  itemId: number
  code: string
  name: string
  price: number
  discountPercentage: number
  quantity: number
  discountAmount: number
  discountPrice: number
  totalAmount: number
}

const ItemModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: IItemForm) => void
}) => {
  const [open, setOpen] = useState(isOpen)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<IItem[]>([])
  const [form, setForm] = useState<IItemForm>({
    itemId: -1,
    code: '',
    name: '',
    price: 0,
    discountPercentage: 0,
    quantity: 0,
    discountAmount: 0,
    discountPrice: 0,
    totalAmount: 0,
  })

  const discountAmount = (Number(form.price) * form.discountPercentage) / 100
  const discountPrice = Number(form.price) - discountAmount
  const totalAmount = form.quantity * discountPrice

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (query) {
      fetchItems()
    }
  }, [query])

  const debounce = useDebounce(query, 500)

  const fetchItems = useCallback(async () => {
    const url = debounce
      ? `http://localhost:3000/items?query=${debounce}`
      : 'http://localhost:3000/items'

    const response = await axios.get(url)

    if (response.status === 200) {
      setItems(response.data)
    }
  }, [debounce])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value || '')
  }

  const handleSelectItem = (item: IItem) => {
    setForm({
      itemId: item.id,
      code: item.code,
      name: item.name,
      price: item.price,
      discountPercentage: 0,
      quantity: 1,
      discountAmount: 0,
      discountPrice: item.price,
      totalAmount: item.price,
    })
    setQuery('')
    setItems([])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      discountAmount:
        (Number(form.price) * Number(form.discountPercentage)) / 100,
      discountPrice:
        Number(form.price) -
        (Number(form.price) * Number(form.discountPercentage)) / 100,
      totalAmount:
        Number(form.quantity) *
        (Number(form.price) -
          (Number(form.price) * Number(form.discountPercentage)) / 100),
    }))
  }

  const handleAdd = () => {
    onAdd({
      ...form,
      discountAmount,
      discountPrice,
      totalAmount,
    })
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} className='relative z-10'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
      />
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'
          >
            <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full'>
                  <DialogTitle
                    as='h3'
                    className='mb-5 text-base font-semibold leading-6 text-gray-900'
                  >
                    Pilih Item
                  </DialogTitle>
                  <SearchSection
                    query={query}
                    onSearch={handleSearch}
                    items={items}
                    onSelectItem={handleSelectItem}
                  />
                  {form.itemId !== -1 && (
                    <FormSection
                      form={form}
                      onChange={handleChange}
                      discountAmount={discountAmount}
                      discountPrice={discountPrice}
                      totalAmount={totalAmount}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
              <button
                type='button'
                className='inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto'
                onClick={handleAdd}
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

const SearchSection = ({
  query,
  onSearch,
  items,
  onSelectItem,
}: {
  query: string
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  items: IItem[]
  onSelectItem: (item: IItem) => void
}) => (
  <div className='relative mt-2 space-y-4 border-b pb-4'>
    <TextInput
      label='Cari'
      name='search'
      placeholder='Sapu Elektrik'
      onChange={onSearch}
      value={query}
    />
    {items.length > 0 && (
      <div className='absolute z-10 top-14 left-0 right-0 bg-white border rounded-md sm:text-sm max-h-20 overflow-scroll'>
        {items.map((item) => (
          <p
            key={item.id}
            className='py-2 px-2 hover:bg-blue-400 cursor-pointer'
            onClick={() => onSelectItem(item)}
          >
            {item.name}
          </p>
        ))}
      </div>
    )}
  </div>
)

const FormSection = ({
  form,
  onChange,
  discountAmount,
  discountPrice,
  totalAmount,
}: {
  form: IItemForm
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  discountAmount: number
  discountPrice: number
  totalAmount: number
}) => (
  <div className='mt-2 space-y-4'>
    <TextInput label='Code' name='code' defaultValue={form.code} />
    <TextInput label='Nama Barang' name='name' defaultValue={form.name} />
    <TextInput
      label='Harga Barang'
      name='price'
      defaultValue={formatCurrencyIDR(form.price)}
    />
    <TextInput
      label='Banyak Barang'
      name='quantity'
      onChange={onChange}
      value={form.quantity}
    />
    <TextInput
      label='Diskon (%)'
      name='discountPercentage'
      onChange={onChange}
      value={form.discountPercentage}
    />
    <TextInput
      label='Jumlah Diskon'
      name='discountAmount'
      value={formatCurrencyIDR(discountAmount)}
      attributes={{ readOnly: true }}
    />
    <TextInput
      label='Harga Diskon'
      name='discountPrice'
      value={formatCurrencyIDR(discountPrice)}
      attributes={{ readOnly: true }}
    />
    <TextInput
      label='Total'
      name='totalAmount'
      value={formatCurrencyIDR(totalAmount)}
      attributes={{ readOnly: true }}
    />
  </div>
)

export default ItemModal
