import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import ItemModal, { IItemForm } from './ItemModal'
import CustomerModal, { CustomerForm } from './CostumerModal'
import NumberInput from '@app/components/NumberInput'
import { formatCurrencyIDR } from '@app/helpers/format-currency'
import { toast } from 'react-toastify'

export const AddTransactionTable = ({
  onCancelAdd,
}: {
  onCancelAdd: () => void
}) => {
  const [transaction, setTransaction] = useState({ code: '', date: '' })
  const [costOptions, setCostOptions] = useState({
    discount: 0,
    shippingCost: 0,
  })
  const [isOpenItemModal, setIsOpenItemModal] = useState(false)
  const [isOpenCustomerTableModal, setIsOpenCustomerTableModal] =
    useState(false)
  const [customer, setCustomer] = useState({ code: -1, name: '', phone: '' })
  const [items, setItems] = useState<IItemForm[]>([])
  const [selectedItem, setSelectedItem] = useState<IItemForm>({
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
  const [errors, setErrors] = useState({
    errorCount: 0,
    date: '',
    customerId: '',
    subtotal: '',
    discount: '',
    shippingCost: '',
    totalPayment: '',
    details: '',
    name: '',
    phone: '',
  })

  const sumSubtotal = items.reduce((total, item) => total + item.totalAmount, 0)
  const sumCostTotal =
    sumSubtotal - costOptions.discount + costOptions.shippingCost
  const isDisabled = sumSubtotal === 0

  const fetchTransactionCode = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/sales/code')
      if (response.status === 200) {
        setTransaction((prev) => ({ ...prev, code: response.data }))
      }
    } catch (error) {
      toast.error('Failed to fetch transaction code')
    }
  }, [])

  const validateNumber = (input: any) => {
    return /^\d*\.?\d*$/.test(input)
  }

  useEffect(() => {
    fetchTransactionCode()
  }, [fetchTransactionCode])

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setTransaction((prev) => ({ ...prev, date: value }))
    handleClearErrors('date')
  }

  const handleClearErrors = (field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: '',
      errorCount: prev.errorCount - 1,
    }))
  }

  const handleCostOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget

    const isValidNumber = validateNumber(value)

    if (isValidNumber) {
      setCostOptions((prev) => ({ ...prev, [name]: Number(value) }))
      handleClearErrors(name)
    } else {
      const newErrors: { [key: string]: string } = {}
      newErrors[name] = 'Input harus berupa angka'

      const errorCount = Object.keys(newErrors).length

      setErrors((prev) => ({
        ...prev,
        ...newErrors,
        errorCount,
      }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (transaction.date === '') {
      newErrors.date = 'Tanggal transaksi tidak boleh kosong'
    }

    if (!customer.code) {
      newErrors.customerId = 'Code customer tidak boleh kosong'
    }

    if (customer.name === '') {
      newErrors.name = 'Nama customer tidak boleh kosong'
    }

    if (customer.phone === '') {
      newErrors.phone = 'Data telepon tidak boleh kosong'
    }

    if (!items.length) {
      newErrors.details = 'Data item tidak boleh kosong'
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

  const handleSubmit = async () => {
    const errorCount = validateForm()

    if (errorCount > 0) {
      toast.error('Ada kesalahan isian pada form')
      return
    }

    const data = {
      date: transaction.date,
      customerId: customer.code,
      subtotal: sumSubtotal,
      discount: costOptions.discount,
      shippingCost: costOptions.shippingCost,
      totalPayment: sumCostTotal,
      details: items,
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/sales/create`,
        data,
      )

      if (response.status === 201) {
        toast.success('Data berhasil disimpan')
        handleCloseModals()
        onCancelAdd()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Terjadi kesalahan'

        toast.error(`Gagal menyimpane data: ${errorMessage}`)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const handleCloseModals = () => {
    setIsOpenItemModal(false)
    setIsOpenCustomerTableModal(false)
  }

  const handleAddCustomer = (data: CustomerForm) => {
    const costumerData = {
      code: data.code,
      name: data.name,
      phone: data.phone,
    }

    setCustomer(costumerData)

    handleCloseModals()
  }

  const handleAddItem = (data: IItemForm) => {
    const existingItem = items.find((item) => item.itemId === data.itemId)

    if (existingItem) {
      const newItems = items.filter((item) => item.itemId !== data.itemId)

      setItems([...newItems, data])
    } else {
      setItems((prev) => [...prev, data])
    }

    handleClearErrors('details')
    handleCloseModals()
  }

  const handleRemoveItem = (itemId: number) => {
    const newItems = items.filter((item) => item.itemId === itemId)

    setItems(newItems)
  }

  const handleEditItem = (itemId: number) => {
    const selectedItem = items.find((item) => item.itemId === itemId)

    const item: IItemForm = {
      itemId: selectedItem?.itemId!,
      name: selectedItem?.name!,
      code: selectedItem?.code!,
      price: selectedItem?.price!,
      discountPercentage: selectedItem?.discountPercentage!,
      quantity: selectedItem?.quantity!,
      discountAmount: selectedItem?.discountAmount!,
      discountPrice: selectedItem?.discountPrice!,
      totalAmount: selectedItem?.totalAmount!,
    }

    setSelectedItem(item)
    setIsOpenItemModal(true)
  }

  return (
    <Fragment>
      {isOpenItemModal && (
        <ItemModal
          isOpen={isOpenItemModal}
          onClose={handleCloseModals}
          onAdd={handleAddItem}
          selectedItem={selectedItem}
        />
      )}
      {isOpenCustomerTableModal && (
        <CustomerModal
          isOpen={isOpenCustomerTableModal}
          onClose={() => setIsOpenCustomerTableModal(false)}
          onAdd={handleAddCustomer}
        />
      )}
      <section className='w-1/3 mb-4'>
        <div className='space-y-3 mb-8'>
          <p className='text-xl font-bold border-b border-1 pb-1'>Transaksi</p>
          <InputRow
            attributes={{ readOnly: true }}
            label='No'
            value={transaction.code}
            disabled
          />
          <InputRow
            label='Tanggal'
            type='date'
            value={transaction.date}
            onChange={handleChangeDate}
            error={errors.date}
          />
        </div>
        <div className='space-y-3'>
          <p className='text-xl font-bold border-b border-1 pb-1'>Customer</p>
          <InputRow
            label='Kode'
            value={customer.code === -1 ? '' : customer.code.toString()}
            onClick={() => setIsOpenCustomerTableModal(true)}
            attributes={{ readOnly: true }}
            error={errors.customerId}
          />
          <InputRow
            label='Nama'
            value={customer.name}
            attributes={{ readOnly: true }}
            error={errors.name}
          />
          <InputRow
            label='Telp'
            value={customer.phone}
            attributes={{ readOnly: true }}
            error={errors.phone}
          />
        </div>
      </section>
      <ItemTable
        onRemoveItem={handleRemoveItem}
        onEditItem={handleEditItem}
        items={items}
        setIsOpenItemModal={setIsOpenItemModal}
        error={errors.details}
      />
      {errors.details && (
        <span className='text-xs text-red-400 text-center'>
          {errors.details}
        </span>
      )}
      <CostOptions
        discount={costOptions.discount}
        shippingCost={costOptions.shippingCost}
        sumSubtotal={sumSubtotal}
        sumCostTotal={sumCostTotal}
        isDisabled={isDisabled}
        onChange={handleCostOptionsChange}
        errors={errors}
      />
      <div className='flex justify-center items-center gap-5 border-t-2 pt-5'>
        <button
          disabled={errors.errorCount > 0}
          type='button'
          onClick={handleSubmit}
          className='flex items-center space-x-4 py-2 px-4 border border-green-500 rounded-lg text-white bg-green-500 shadow-md hover:bg-green-400 hover:border-green-400 text-sm font-bold'
        >
          Simpan
        </button>
        <button
          type='button'
          onClick={onCancelAdd}
          className='flex items-center space-x-4 py-2 px-4 border border-red-500 rounded-lg text-white bg-red-500 shadow-md hover:bg-red-400 hover:border-red-400 text-sm font-bold'
        >
          Batal
        </button>
      </div>
    </Fragment>
  )
}

const InputRow = ({
  label,
  value,
  type = 'text',
  onChange,
  onClick,
  disabled = false,
  attributes,
  error,
}: {
  label: string
  value: string
  type?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
  disabled?: boolean
  attributes?: React.InputHTMLAttributes<HTMLInputElement>
  error?: string
}) => (
  <div className='grid grid-cols-3 items-center gap-3 relative mt-2 rounded-md'>
    <label className='col-end-2'>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onClick={onClick}
      disabled={disabled}
      className={`col-span-2 bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm ${disabled ? 'cursor-not-allowed bg-gray-300/45' : ''} ${error ? 'border-red-400' : ''}`}
      {...attributes}
    />
    <span className='col-start-2 col-span-2 text-xs text-red-400'>{error}</span>
  </div>
)

interface ItemTableProps {
  items: IItemForm[]
  setIsOpenItemModal: (status: boolean) => void
  onRemoveItem: (itemId: number) => void
  onEditItem: (itemId: number) => void
  error?: string
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  setIsOpenItemModal,
  onRemoveItem,
  onEditItem,
  error,
}) => (
  <table
    className={`shadow-lg bg-white rounded-lg table-auto border border-collapse  overflow-hidden ${error ? 'border-red-400 border-1' : 'border-slate-100'}`}
  >
    <thead>
      <tr className='mx-10 text-center bg-gray-300/80'>
        <th
          rowSpan={2}
          colSpan={2}
          className='py-2 px-1 bg-blue-500 text-white cursor-pointer hover:bg-blue-400'
          onClick={() => setIsOpenItemModal(true)}
        >
          Tambah
        </th>
        <th rowSpan={2} className='py-2 px-1'>
          No
        </th>
        <th rowSpan={2} className='py-2 px-1'>
          Kode Barang
        </th>
        <th rowSpan={2} className='py-2 px-1'>
          Nama Barang
        </th>
        <th rowSpan={2} className='py-2 px-1 text-red-500'>
          Qty
        </th>
        <th rowSpan={2} className='py-2 px-1'>
          Harga Bandrol
        </th>
        <th colSpan={2} className='py-2 px-1'>
          Diskon
        </th>
        <th rowSpan={2} className='py-2 px-1'>
          Harga Diskon
        </th>
        <th rowSpan={2} className='py-2 px-1'>
          Total
        </th>
      </tr>
      <tr className='mx-10 text-center bg-gray-300/80'>
        <th className='py-2 text-red-500'>(%)</th>
        <th className='py-2'>(Rp)</th>
      </tr>
    </thead>
    <tbody>
      {items.length ? (
        items.map((item, index) => (
          <tr key={item.itemId} className='text-center'>
            <td
              className='py-3 px-1 hover:bg-blue-300 hover:text-white cursor-pointer'
              onClick={() => onEditItem(item.itemId)}
            >
              Ubah
            </td>
            <td
              className='py-3 px-1 hover:bg-red-300 hover:text-white cursor-pointer'
              onClick={() => onRemoveItem(item.itemId)}
            >
              Hapus
            </td>
            <td className='py-3 px-1'>{index + 1}</td>
            <td className='py-3 px-1'>{item.code}</td>
            <td className='py-3 px-1'>{item.name}</td>
            <td className='py-3 px-1'>{item.quantity}</td>
            <td className='py-3 px-1'>{formatCurrencyIDR(item.price)}</td>
            <td className='py-3 px-1'>{item.discountPercentage}</td>
            <td className='py-3 px-1'>
              {formatCurrencyIDR(item.discountAmount)}
            </td>
            <td className='py-3 px-1'>
              {formatCurrencyIDR(item.discountPrice)}
            </td>
            <td className='py-3 px-1'>{formatCurrencyIDR(item.totalAmount)}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={10} className='py-3 px-1 text-center'>
            -- Data kosong --
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

const CostOptions = ({
  discount,
  shippingCost,
  sumSubtotal,
  sumCostTotal,
  isDisabled,
  onChange,
  errors,
}: {
  discount: number
  shippingCost: number
  sumSubtotal: number
  sumCostTotal: number
  isDisabled: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors?: any
}) => (
  <section className='w-full mb-4 flex justify-end'>
    <div className='space-y-3 text-right'>
      <CostOptionRow label='Sub Total' value={formatCurrencyIDR(sumSubtotal)} />
      <CostOptionRow
        label='Diskon'
        inputName='discount'
        value={discount}
        onChange={onChange}
        isDisabled={isDisabled}
        error={errors.discount}
      />
      <CostOptionRow
        label='Ongkir'
        inputName='shippingCost'
        value={shippingCost}
        onChange={onChange}
        isDisabled={isDisabled}
        error={errors.shippingCost}
      />
      <CostOptionRow
        label='Total Bayar'
        value={formatCurrencyIDR(sumCostTotal)}
      />
    </div>
  </section>
)

const CostOptionRow = ({
  label,
  value,
  inputName,
  onChange,
  isDisabled,
  error,
}: {
  label: string
  value: number | string
  inputName?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDisabled?: boolean
  error?: string
}) => (
  <Fragment>
    <div className='grid grid-cols-2 items-center gap-3 rounded-md'>
      <p>{label}</p>
      {inputName ? (
        <NumberInput
          defaultValue={value}
          name={inputName}
          className={`bg-white text-right w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 ${isDisabled ? 'cursor-not-allowed bg-gray-300/45' : ''} ${error ? 'border-red-400 focus:border-none focus:ring-none' : 'border-slate-300 '}`}
          onChange={onChange}
          disabled={isDisabled}
          error={error}
        />
      ) : (
        <span className='text-right px-3'>{value}</span>
      )}
    </div>
  </Fragment>
)
