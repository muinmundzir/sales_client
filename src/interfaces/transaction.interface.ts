import { Customer } from "./customer.interface"
import { TransactionDetail } from "./transaction-detail.interface"

export interface Transaction {
  id: number
  code: string
  date: Date
  subtotal: number
  customerId: number
  discount: number
  shippingCost: number
  totalPayment: number
  createdAt: Date
  updatedAt: Date
  customer: Customer
  saleDetail: [TransactionDetail]
}
