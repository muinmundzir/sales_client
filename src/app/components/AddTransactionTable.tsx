import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import ItemModal, { IItemForm } from './ItemModal'
import CustomerModal, { CustomerForm } from './CostumerModal'
import NumberInput from '@app/components/NumberInput'
import { formatCurrencyIDR } from '@app/helpers/format-currency'
import { toast, ToastContainer } from 'react-toastify'

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
  const [customer, setCustomer] = useState({ code: null, name: '', phone: '' })
  const [items, setItems] = useState<IItemForm[]>([])
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
      toast.error('Failed to fetch transaction code', error)
    }
  }, [])

  useEffect(() => {
    fetchTransactionCode()
  }, [fetchTransactionCode])

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setTransaction((prev) => ({ ...prev, date: value }))
    handleClearErrors('date')
  }

  const handleClearErrors = (field: string) => {
    console.log(field, 'test')
    setErrors((prev) => ({
      ...prev,
      [field]: '',
      errorCount: prev.errorCount - 1,
    }))
  }

  const handleCostOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setCostOptions((prev) => ({ ...prev, [name]: Number(value) }))
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
        'http://localhost:3000/sales/create',
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
        const errorStatus = error.response?.status

        toast.error(`Gagal menyimpane data: ${errorMessage}`)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
    }
  }

  const handleCloseModals = () => {
    setIsOpenItemModal(false)
    setIsOpenCustomerTableModal(false)
  }

  const handleAddCustomer = (data: CustomerForm) => {
    setCustomer(data)
    handleCloseModals()
  }

  const handleAddItem = (data: IItemForm) => {
    setItems((prev) => [...prev, data])
    handleClearErrors('details')
    handleCloseModals()
  }

  return (
    <Fragment>
      {isOpenItemModal && (
        <ItemModal
          isOpen={isOpenItemModal}
          onClose={handleCloseModals}
          onAdd={handleAddItem}
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
            value={customer.code || ''}
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
      />
      <div className='flex justify-center items-center gap-5 border-t-2 pt-5'>
        <button
          type='button'
          onClick={handleSubmit}
          className='inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2  font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto'
        >
          Simpan
        </button>
        <button
          type='button'
          onClick={onCancelAdd}
          className='mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2  font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-500 sm:mt-0 sm:w-auto'
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
  error?: string
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  setIsOpenItemModal,
  error,
}) => (
  <table
    className={`shadow-lg bg-white rounded-lg table-auto border border-collapse border-slate-100 overflow-hidden ${error ? 'border-red-400 border-1' : ''}`}
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
            <td className='py-3 px-1'></td>
            <td className='py-3 px-1'></td>
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
}: {
  discount: number
  shippingCost: number
  sumSubtotal: number
  sumCostTotal: number
  isDisabled: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
      />
      <CostOptionRow
        label='Ongkir'
        inputName='shippingCost'
        value={shippingCost}
        onChange={onChange}
        isDisabled={isDisabled}
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
}: {
  label: string
  value: number | string
  inputName?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDisabled?: boolean
}) => (
  <Fragment>
    <div className='grid grid-cols-2 items-center gap-3 relative rounded-md'>
      <p className='col-end-2'>{label}</p>
      {inputName ? (
        <NumberInput
          defaultValue={value}
          name={inputName}
          className={`bg-white text-right w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 ${isDisabled ? 'cursor-not-allowed bg-gray-300/45' : ''}`}
          onChange={onChange}
          disabled={isDisabled}
        />
      ) : (
        <span className='text-right px-3'>{value}</span>
      )}
    </div>
    <ToastContainer />
  </Fragment>
)
