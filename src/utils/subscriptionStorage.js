const STORAGE_KEY = 'washwish_subscriptions'

export const getStoredSubscriptions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveSubscriptions = (subscriptions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions))
}

export const addSubscription = (subscription) => {
  const subscriptions = getStoredSubscriptions()
  subscriptions.push(subscription)
  saveSubscriptions(subscriptions)
  return subscriptions
}

export const updateSubscription = (id, updates) => {
  const subscriptions = getStoredSubscriptions()
  const updated = subscriptions.map(sub => 
    sub._id === id ? { ...sub, ...updates } : sub
  )
  saveSubscriptions(updated)
  return updated
}

export const removeSubscription = (id) => {
  const subscriptions = getStoredSubscriptions()
  const filtered = subscriptions.filter(sub => sub._id !== id)
  saveSubscriptions(filtered)
  return filtered
}