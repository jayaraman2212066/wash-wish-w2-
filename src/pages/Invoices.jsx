import { useState, useEffect } from 'react'
import { FileText, Download, Eye, Calendar } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../utils/api'
import * as XLSX from 'xlsx'

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    filterInvoices()
  }, [invoices, dateFilter])

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices/my')
      setInvoices(response.data.data.invoices)
    } catch (error) {
      // Mock data for demo
      const mockInvoices = [
        {
          _id: '1',
          invoiceNumber: 'INV-2024-001',
          orderNumber: 'WW001',
          amount: 750,
          gst: 135,
          totalAmount: 885,
          status: 'paid',
          createdAt: new Date().toISOString(),
          items: [
            { name: 'Shirt', quantity: 3, price: 100 },
            { name: 'Pants', quantity: 2, price: 120 }
          ]
        },
        {
          _id: '2',
          invoiceNumber: 'INV-2024-002',
          orderNumber: 'WW002',
          amount: 500,
          gst: 90,
          totalAmount: 590,
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          items: [
            { name: 'Saree', quantity: 1, price: 200 },
            { name: 'Bedsheet', quantity: 2, price: 150 }
          ]
        }
      ]
      setInvoices(mockInvoices)
    } finally {
      setLoading(false)
    }
  }

  const filterInvoices = () => {
    let filtered = [...invoices]
    
    if (dateFilter.from) {
      filtered = filtered.filter(invoice => 
        new Date(invoice.createdAt) >= new Date(dateFilter.from)
      )
    }
    
    if (dateFilter.to) {
      filtered = filtered.filter(invoice => 
        new Date(invoice.createdAt) <= new Date(dateFilter.to)
      )
    }
    
    setFilteredInvoices(filtered)
  }

  const downloadPDFInvoice = async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/pdf`, {
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoiceId}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      
      toast.success('Invoice downloaded successfully!')
    } catch (error) {
      // Simulate PDF download
      const invoice = invoices.find(inv => inv._id === invoiceId)
      if (invoice) {
        generateMockPDF(invoice)
        toast.success('Invoice downloaded successfully!')
      }
    }
  }

  const generateMockPDF = (invoice) => {
    const pdfContent = `
      WashWish - Professional Laundry Service
      
      Invoice: ${invoice.invoiceNumber}
      Order: ${invoice.orderNumber}
      Date: ${new Date(invoice.createdAt).toLocaleDateString()}
      
      Items:
      ${invoice.items.map(item => `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n')}
      
      Subtotal: ₹${invoice.amount}
      GST (18%): ₹${invoice.gst}
      Total: ₹${invoice.totalAmount}
      
      Status: ${invoice.status.toUpperCase()}
    `
    
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${invoice.invoiceNumber}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportToExcel = () => {
    const excelData = filteredInvoices.map(invoice => ({
      'Invoice Number': invoice.invoiceNumber,
      'Order Number': invoice.orderNumber,
      'Date': new Date(invoice.createdAt).toLocaleDateString(),
      'Amount': invoice.amount,
      'GST': invoice.gst,
      'Total Amount': invoice.totalAmount,
      'Status': invoice.status,
      'Items': invoice.items.map(item => `${item.name} x${item.quantity}`).join(', ')
    }))

    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices')
    
    const fileName = `invoices-${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    toast.success('Excel report exported successfully!')
  }

  const calculateMonthlyTotal = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return filteredInvoices
      .filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt)
        return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear
      })
      .reduce((total, invoice) => total + invoice.totalAmount, 0)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredInvoices.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{calculateMonthlyTotal().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Download className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredInvoices.filter(inv => inv.status === 'paid').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices & Reports</h1>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={dateFilter.from}
                onChange={(e) => setDateFilter({...dateFilter, from: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={dateFilter.to}
                onChange={(e) => setDateFilter({...dateFilter, to: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {invoice.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₹{invoice.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => downloadPDFInvoice(invoice._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your invoices will appear here after completing orders.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Invoices