export const formatDate = (isoDateString: string) => {
  const date = new Date(isoDateString)
  const day = date.getUTCDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getUTCFullYear()
  return `${day}-${month}-${year}`
}
