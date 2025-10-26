const WALLET_KEY = 'washwish_wallet'

export const getWalletData = () => {
  try {
    const stored = localStorage.getItem(WALLET_KEY)
    return stored ? JSON.parse(stored) : {
      balance: 1250,
      transactions: [
        { _id: '1', type: 'credit', amount: 2000, description: 'Initial Wallet Credit', createdAt: new Date().toISOString() },
        { _id: '2', type: 'debit', amount: 750, description: 'Order Payment - WW001', createdAt: new Date(Date.now() - 86400000).toISOString() }
      ]
    }
  } catch {
    return { balance: 1250, transactions: [] }
  }
}

export const saveWalletData = (walletData) => {
  localStorage.setItem(WALLET_KEY, JSON.stringify(walletData))
}

export const addTransaction = (amount, type, description) => {
  const walletData = getWalletData()
  const newTransaction = {
    _id: `txn_${Date.now()}`,
    type,
    amount,
    description,
    createdAt: new Date().toISOString()
  }
  
  walletData.transactions.unshift(newTransaction)
  walletData.balance = type === 'credit' 
    ? walletData.balance + amount 
    : walletData.balance - amount
    
  saveWalletData(walletData)
  return walletData
}