// Database service using IndexedDB for local storage or Firebase for cloud
const DB_NAME = 'WashWishDB'
const DB_VERSION = 1
const USERS_STORE = 'users'
const PENDING_USERS_STORE = 'pendingUsers'

class DatabaseService {
  constructor() {
    this.db = null
    this.initDB()
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // Create users store
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const usersStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' })
          usersStore.createIndex('email', 'email', { unique: true })
        }
        
        // Create pending users store
        if (!db.objectStoreNames.contains(PENDING_USERS_STORE)) {
          const pendingStore = db.createObjectStore(PENDING_USERS_STORE, { keyPath: 'id' })
          pendingStore.createIndex('email', 'email', { unique: true })
          pendingStore.createIndex('token', 'verificationToken', { unique: true })
        }
      }
    })
  }

  async addPendingUser(userData) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([PENDING_USERS_STORE], 'readwrite')
      const store = transaction.objectStore(PENDING_USERS_STORE)
      
      const pendingUser = {
        id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        verificationToken: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
      
      const request = store.add(pendingUser)
      request.onsuccess = () => resolve(pendingUser)
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingUser(token, email) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([PENDING_USERS_STORE], 'readonly')
      const store = transaction.objectStore(PENDING_USERS_STORE)
      const index = store.index('token')
      
      const request = index.get(token)
      request.onsuccess = () => {
        const user = request.result
        if (user && user.email === email && new Date(user.expiresAt) > new Date()) {
          resolve(user)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async activateUser(pendingUser) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE, PENDING_USERS_STORE], 'readwrite')
      
      // Add to verified users
      const usersStore = transaction.objectStore(USERS_STORE)
      const verifiedUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: pendingUser.name,
        email: pendingUser.email,
        phone: pendingUser.phone,
        address: pendingUser.address,
        role: pendingUser.role,
        password: pendingUser.password, // In real app, this should be hashed
        isVerified: true,
        createdAt: new Date().toISOString()
      }
      
      const addRequest = usersStore.add(verifiedUser)
      
      // Remove from pending users
      const pendingStore = transaction.objectStore(PENDING_USERS_STORE)
      const deleteRequest = pendingStore.delete(pendingUser.id)
      
      transaction.oncomplete = () => resolve(verifiedUser)
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async getVerifiedUser(email, password) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readonly')
      const store = transaction.objectStore(USERS_STORE)
      const index = store.index('email')
      
      const request = index.get(email)
      request.onsuccess = () => {
        const user = request.result
        if (user && user.password === password) {
          resolve(user)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async addVerifiedUser(userData) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readwrite')
      const store = transaction.objectStore(USERS_STORE)
      
      const request = store.add(userData)
      request.onsuccess = () => resolve(userData)
      request.onerror = () => reject(request.error)
    })
  }

  async checkEmailExists(email) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readonly')
      
      // Check verified users only (no more pending users)
      const usersStore = transaction.objectStore(USERS_STORE)
      const usersIndex = usersStore.index('email')
      const usersRequest = usersIndex.get(email)
      
      usersRequest.onsuccess = () => {
        if (usersRequest.result) {
          resolve({ exists: true, verified: true })
        } else {
          resolve({ exists: false, verified: false })
        }
      }
      usersRequest.onerror = () => reject(usersRequest.error)
    })
  }
}

export const dbService = new DatabaseService()