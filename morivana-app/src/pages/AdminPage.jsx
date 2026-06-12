import { useState, useEffect, useRef } from 'react'
import { useAuth, useUser } from '@clerk/react'
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useApi } from '../utils/api'

import {
  IconLayoutDashboard,
  IconDatabase,
  IconCirclePlus,
  IconSearch,
  IconCopy,
  IconCheck,
  IconSun,
  IconMoon,
  IconDots,
  IconCurrencyRupee,
  IconCreditCard,
  IconTruck,
  IconPlus,
  IconLoader2,
  IconMenu2,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconExternalLink,
  IconDownload,
  IconReceipt,
  IconArrowBackUp,
  IconChartLine,
  IconUsers,
  IconSettings
} from '@tabler/icons-react'

// Dynamic Google Fonts Injection
const injectGlobalFonts = () => {
  if (typeof window === 'undefined') return
  const linkId = 'google-fonts-admin'
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link')
    link.id = linkId
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
}



// Stock Stepper Component for Inventory
function StockStepper({ product, onSave }) {
  const [val, setVal] = useState(product.stock)
  const timerRef = useRef(null)

  useEffect(() => {
    setVal(product.stock)
  }, [product.stock])

  const triggerSave = (nextVal) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      await onSave(product._id, nextVal)
    }, 600)
  }

  const handleIncrement = () => {
    const next = val + 1
    setVal(next)
    triggerSave(next)
  }

  const handleDecrement = () => {
    if (val <= 0) return
    const next = val - 1
    setVal(next)
    triggerSave(next)
  }

  const handleChange = (e) => {
    const next = Number(e.target.value)
    if (isNaN(next) || next < 0) return
    setVal(next)
    triggerSave(next)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrement}
        className="w-[28px] h-[28px] shrink-0 border border-[var(--border)] bg-[var(--bg-input)] rounded-lg text-[var(--text-2)] hover:bg-[var(--bg-hover)] text-lg font-mono flex items-center justify-center transition-colors duration-100 cursor-pointer"
      >
        -
      </button>

      <input
        type="text"
        value={val}
        onChange={handleChange}
        className="w-[56px] h-9 text-center font-mono font-medium text-sm text-[var(--text-1)] bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
      />

      <button
        onClick={handleIncrement}
        className="w-[28px] h-[28px] shrink-0 border border-[var(--border)] bg-[var(--bg-input)] rounded-lg text-[var(--text-2)] hover:bg-[var(--bg-hover)] text-lg font-mono flex items-center justify-center transition-colors duration-100 cursor-pointer"
      >
        +
      </button>
    </div>
  )
}

// Copy Button Component for Directory
function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-150 cursor-pointer p-1"
      title="Copy Email"
    >
      {copied ? (
        <IconCheck size={14} className="text-[var(--accent)]" />
      ) : (
        <IconCopy size={14} />
      )}
    </button>
  )
}

export default function AdminPage() {
  const { isLoaded, isSignedIn, signOut } = useAuth()
  const { user } = useUser()
  const api = useApi()
  const navigate = useNavigate()
  const location = useLocation()

  // Google fonts dynamic load
  useEffect(() => {
    injectGlobalFonts()
  }, [])

  // Theme State: 'dark' (Night Mode) | 'light' (Day Mode)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_theme') || 'dark'
    }
    return 'dark'
  })

  // Theme Toggler effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      if (theme === 'light') {
        root.classList.add('light')
      } else {
        root.classList.remove('light')
      }
    }
  }, [theme])

  // Search & Filter State for Live Waitlist Directory
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Data states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [inventory, setInventory] = useState([])
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminProfile, setAdminProfile] = useState(null)

  // Cell flash tracking
  const [flashingIds, setFlashingIds] = useState({})

  // Product edit modal details
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', price: 0, priceUSD: '', stock: 0 })

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: '',
    priceUSD: '',
    stock: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('admin_theme', next)
      return next
    })
  }

  // Verify Admin authorization on mount
  useEffect(() => {
    const hasBypassToken = typeof window !== 'undefined' && !!localStorage.getItem('admin_bypass_token')
    
    // If not utilizing the bypass token, we must wait for Clerk auth to resolve.
    // If we do have the bypass token, we proceed immediately without waiting.
    if (!hasBypassToken) {
      if (!isLoaded) return
      if (!isSignedIn) return
    }

    if (isAuthorized) return

    async function checkAuth() {
      try {
        setLoading(true)
        const res = await api.get('/api/admin/auth-check')
        if (res.ok) {
          setIsAuthorized(true)
          setAdminProfile(res.user)
          await Promise.all([fetchStats(), fetchInventory()])
        } else {
          setIsAuthorized(false)
        }
      } catch (err) {
        console.error('Admin verification failed:', err)
        setIsAuthorized(false)
        setError(err.message || 'Access Denied. You are not authorized.')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [isLoaded, isSignedIn, isAuthorized])

  async function handleSignOut() {
    localStorage.removeItem('admin_bypass_token')
    if (isSignedIn) {
      try {
        await signOut()
      } catch (err) {
        console.error('Clerk sign out failed:', err)
      }
    }
    navigate('/')
  }

  async function fetchStats() {
    try {
      const data = await api.get('/api/admin/stats')
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      setError('Failed to fetch dashboard metrics.')
    }
  }

  async function fetchInventory() {
    try {
      const data = await api.get('/api/admin/inventory')
      setInventory(data)
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
      setError('Failed to fetch inventory data.')
    }
  }

  async function handleQuickStockUpdate(id, newStock) {
    if (newStock < 0) return
    try {
      const updatedProduct = await api.put(`/api/admin/inventory/${id}`, { stock: newStock })
      if (updatedProduct.ok) {
        setInventory(prev => prev.map(p => p._id === id ? { ...p, stock: newStock, status: newStock > 0 ? 'In Stock' : 'Out of Stock' } : p))

        // Trigger save cell background flash
        setFlashingIds(prev => ({ ...prev, [id]: true }))
        setTimeout(() => {
          setFlashingIds(prev => ({ ...prev, [id]: false }))
        }, 200)

        fetchStats()
      }
    } catch (err) {
      alert(err.message || 'Failed to update stock')
    }
  }

  function startEditing(product) {
    setEditingId(product._id)
    setEditForm({
      name: product.name,
      price: product.price,
      priceUSD: product.priceUSD || '',
      stock: product.stock
    })
  }

  function cancelEditing() {
    setEditingId(null)
  }

  async function saveProductDetails(id) {
    try {
      const body = {
        name: editForm.name,
        price: Number(editForm.price),
        stock: Number(editForm.stock)
      }
      if (editForm.priceUSD !== '') {
        body.priceUSD = Number(editForm.priceUSD)
      } else {
        body.priceUSD = null
      }
      const res = await api.put(`/api/admin/inventory/${id}`, body)
      if (res.ok) {
        setEditingId(null)
        await Promise.all([fetchStats(), fetchInventory()])
      }
    } catch (err) {
      alert(err.message || 'Failed to update product details')
    }
  }

  async function handleDeleteProduct(id, sku) {
    if (!window.confirm(`Are you sure you want to delete the product variation: ${sku}?`)) return
    try {
      const res = await api.delete(`/api/admin/inventory/${id}`)
      if (res.ok) {
        await Promise.all([fetchStats(), fetchInventory()])
      }
    } catch (err) {
      alert(err.message || 'Failed to delete product')
    }
  }

  async function handleCreateProduct(e) {
    e.preventDefault()
    setFormSubmitting(true)
    setFormSuccess(false)
    setFormError('')

    try {
      const body = {
        name: newProduct.name.trim(),
        sku: newProduct.sku.toUpperCase().trim(),
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        currency: 'INR'
      }
      if (newProduct.priceUSD) {
        body.priceUSD = Number(newProduct.priceUSD)
      }

      const res = await api.post('/api/admin/inventory', body)
      if (res.ok) {
        setFormSuccess(true)
        setNewProduct({
          name: '',
          sku: '',
          price: '',
          priceUSD: '',
          stock: ''
        })
        await Promise.all([fetchStats(), fetchInventory()])
        setTimeout(() => {
          setFormSuccess(false)
        }, 2000)
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create product.')
    } finally {
      setFormSubmitting(false)
    }
  }

  // Filtered signups helper
  const getFilteredSignups = () => {
    if (!stats?.recentSignups) return []
    return stats.recentSignups.filter(sub => {
      const query = searchTerm.toLowerCase()
      const nameMatch = (sub.name || '').toLowerCase().includes(query)
      const emailMatch = sub.email.toLowerCase().includes(query)
      const regionMatch = filterRegion === 'all' || (sub.region || 'global').toLowerCase() === filterRegion.toLowerCase()
      return (nameMatch || emailMatch) && regionMatch
    })
  }

  // Avatar styles mapping
  const getAvatarStyles = (sub) => {
    const name = (sub.name || '').trim().toLowerCase()
    if (name.includes('nia')) {
      return { initials: 'NI', bg: 'bg-[rgba(59,130,246,0.15)]', text: 'text-[#3B82F6]' }
    } else if (name.includes('junaid')) {
      return { initials: 'JJ', bg: 'bg-[rgba(168,85,247,0.15)]', text: 'text-[#A855F7]' }
    } else if (name.includes('ameera')) {
      return { initials: 'AJ', bg: 'bg-[rgba(234,179,8,0.15)]', text: 'text-[#EAB308]' }
    } else {
      let initials = 'SU'
      if (sub.name) {
        const parts = sub.name.trim().split(/\s+/)
        if (parts.length > 1) {
          initials = (parts[0][0] + parts[1][0]).toUpperCase()
        } else if (parts.length > 0) {
          initials = parts[0].substring(0, 2).toUpperCase()
        }
      } else if (sub.email) {
        const username = sub.email.split('@')[0]
        initials = username.substring(0, 2).toUpperCase()
      }
      return { initials, bg: 'bg-[rgba(255,255,255,0.06)]', text: 'text-[var(--text-3)]' }
    }
  }

  const getLocaleBadgeStyles = (region) => {
    const r = (region || 'GLOBAL').toUpperCase()
    if (r === 'INDIA') return 'bg-[rgba(249,115,22,0.12)] text-[#F97316]'
    if (r === 'CANADA') return 'bg-[rgba(168,85,247,0.12)] text-[#A855F7]'
    return 'bg-[rgba(59,130,246,0.12)] text-[#3B82F6]'
  }

  // Dynamic header page titles
  const getPageTitle = () => {
    if (location.pathname === '/admin/inventory') return 'Inventory Control'
    if (location.pathname === '/admin/list-product') return 'List New Variant'
    if (location.pathname === '/admin/deliveries') return 'Deliveries'
    if (location.pathname === '/admin/payments') return 'Payments'
    if (location.pathname === '/admin/returns') return 'Returns'
    if (location.pathname === '/admin/analytics') return 'Analytics'
    if (location.pathname === '/admin/customers') return 'Customers'
    if (location.pathname === '/admin/settings') return 'Settings'
    return 'Overview'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-page)] text-[var(--text-1)] font-sans">
        <IconLoader2 className="animate-spin w-6 h-6 mb-4 text-[var(--accent)]" />
        <span className="text-[11px] uppercase tracking-widest font-mono font-medium text-[var(--text-2)]">
          Authenticating...
        </span>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center bg-[var(--bg-page)] text-[var(--text-1)] font-sans">
        <div className="max-w-md w-full border border-[var(--border)] rounded-[24px] p-8 bg-[var(--bg-card)] shadow-xl">
          <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center mx-auto mb-6 text-[var(--text-1)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-[16px] font-semibold mb-2">Access Restricted</h1>
          <p className="text-[13px] mb-6 leading-relaxed text-[var(--text-2)]">
            This admin panel is restricted to the storefront owner. Your profile (<span className="font-mono text-[11px] text-[var(--text-1)]">{user?.emailAddresses[0]?.emailAddress || 'anonymous'}</span>) does not possess administrator credentials.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full font-semibold py-3 px-6 rounded-xl transition duration-150 text-[11px] uppercase tracking-wider bg-[var(--text-1)] text-[var(--bg-page)] cursor-pointer"
            >
              Return to Storefront
            </button>

            <button
              onClick={() => navigate('/admin-portal')}
              className="w-full font-semibold py-3 px-6 rounded-xl border border-[var(--border)] transition duration-150 text-[11px] uppercase tracking-wider text-[var(--text-1)] hover:bg-[var(--bg-hover)] cursor-pointer"
            >
              Unlock via Owner Passcode
            </button>

            <div className="text-[11px] text-[var(--text-2)]">
              Logged in as <span className="font-semibold text-[var(--text-1)]">{adminProfile?.fullName || user?.fullName || 'Bypass User'}</span>?
              <button onClick={handleSignOut} className="underline hover:opacity-85 transition cursor-pointer ml-1">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback / real Waitlist growth calculation
  const growthData = (stats?.charts?.growth || []).map(g => ({
    date: g.date,
    v: g.count
  }))
  const defaultGrowthData = [
    { date: 'Jun 2', v: 0 },
    { date: 'Jun 3', v: 0 },
    { date: 'Jun 4', v: 0 },
    { date: 'Jun 5', v: 0 },
    { date: 'Jun 6', v: 0 },
    { date: 'Jun 7', v: 0 },
    { date: 'Jun 8', v: 1 },
    { date: 'Jun 9', v: 3 },
    { date: 'Jun 10', v: 5 },
    { date: 'Jun 11', v: 7 }
  ]
  const finalGrowthData = growthData.length > 0 ? growthData : defaultGrowthData

  // Stock values from DB if matching MD-50G / MD-100G
  const getSKUStock = (sku, fallback) => {
    const item = inventory.find(i => i.sku === sku)
    return item ? item.stock : fallback
  }
  const stock50 = getSKUStock('MD-50G', 50)
  const stock100 = getSKUStock('MD-100G', 120)

  const getStockLabel = (stock) => {
    if (stock <= 0) return 'Out of Stock'
    if (stock < 60) return 'Low'
    if (stock < 120) return 'In Stock'
    return 'Full'
  }

  const exportWaitlistToCSV = () => {
    if (!stats?.recentSignups) return
    const headers = ['Name', 'Email', 'Region', 'Date']
    const rows = stats.recentSignups.map(sub => [
      sub.name || '',
      sub.email,
      sub.region || 'GLOBAL',
      sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : ''
    ])
    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `waitlist_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // KPIs Metrics Setup
  const kpis = [
    {
      label: 'Waitlist subscribers',
      value: stats?.metrics?.waitlistCount !== undefined ? stats.metrics.waitlistCount : 0,
      delta: { isPositive: true, amount: stats?.metrics?.deltaWaitlist || '+0', text: 'this week' }
    },
    {
      label: 'Active SKUs',
      value: stats?.metrics?.activeProductsCount !== undefined ? stats.metrics.activeProductsCount : 0,
      delta: { isNeutral: true, amount: '', text: 'no change' }
    },
    {
      label: 'Total stock units',
      value: stats?.metrics?.totalStock !== undefined ? stats.metrics.totalStock : 0,
      delta: { isNegative: true, amount: '−10', text: 'from last week' }
    },
    {
      label: 'Interest regions',
      value: stats?.metrics?.uniqueRegionsCount !== undefined ? stats.metrics.uniqueRegionsCount : 0,
      delta: { isNeutral: true, amount: '', text: 'no change' }
    },
    {
      label: 'Total earnings',
      value: stats?.metrics?.totalEarnings || '₹0',
      delta: { isPositive: true, amount: stats?.metrics?.deltaEarnings || '+₹0', text: 'this week' }
    },
    {
      label: 'Payments received',
      value: stats?.metrics?.paymentsReceived || '₹0',
      delta: { isPositive: true, amount: stats?.metrics?.deltaPayments || '+₹0', text: 'this week' }
    }
  ]

  const finalFilteredSignups = getFilteredSignups()

  return (
    <div className="admin-portal-wrapper grid grid-cols-1 lg:grid-cols-[220px_1fr] h-screen w-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-1)] font-sans antialiased">

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Redesigned Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[220px] bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col justify-between select-none transition-transform duration-200 lg:translate-x-0 lg:static lg:h-full lg:shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="w-full">
          {/* Logo Section */}
          <div className="px-5 py-4 border-b border-[var(--border-sub)]">
            <span className="text-[15px] font-semibold tracking-wider uppercase text-[var(--text-1)]">MORIVANÁ</span>
            <span className="text-[11px] text-[var(--text-3)] block mt-0.5 font-mono uppercase tracking-widest">
              Seller Portal
            </span>
          </div>

          {/* Navigation Section */}
          <div className="py-2">
            {/* MAIN section */}
            <div className="px-4 py-2 text-[10px] font-semibold text-[var(--text-3)] tracking-wider uppercase">Main</div>
            <nav className="space-y-0.5">
              <Link
                to="/admin"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  (location.pathname === '/admin' || location.pathname === '/admin/')
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconLayoutDashboard size={17} className={`shrink-0 ${(location.pathname === '/admin' || location.pathname === '/admin/') ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>Overview</span>
              </Link>

              <Link
                to="/admin/inventory"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  location.pathname === '/admin/inventory'
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconDatabase size={17} className={`shrink-0 ${location.pathname === '/admin/inventory' ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>Inventory</span>
              </Link>

              <Link
                to="/admin/list-product"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  location.pathname === '/admin/list-product'
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconCirclePlus size={17} className={`shrink-0 ${location.pathname === '/admin/list-product' ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>List Product</span>
              </Link>
            </nav>

            {/* ORDERS section */}
            <div className="px-4 py-2 mt-3 text-[10px] font-semibold text-[var(--text-3)] tracking-wider uppercase">Orders</div>
            <nav className="space-y-0.5">
              <Link
                to="/admin/deliveries"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  location.pathname === '/admin/deliveries'
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconTruck size={17} className={`shrink-0 ${location.pathname === '/admin/deliveries' ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>Deliveries</span>
                <span className="ml-auto bg-[rgba(34,197,94,0.15)] text-[var(--accent)] text-[10px] font-semibold px-2 py-0.5 rounded-full">3</span>
              </Link>

              <Link
                to="/admin/payments"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  location.pathname === '/admin/payments'
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconReceipt size={17} className={`shrink-0 ${location.pathname === '/admin/payments' ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>Payments</span>
              </Link>

              <Link
                to="/admin/returns"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  location.pathname === '/admin/returns'
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconArrowBackUp size={17} className={`shrink-0 ${location.pathname === '/admin/returns' ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>Returns</span>
              </Link>
            </nav>

            {/* INSIGHTS section */}
            <div className="px-4 py-2 mt-3 text-[10px] font-semibold text-[var(--text-3)] tracking-wider uppercase">Insights</div>
            <nav className="space-y-0.5">
              <Link
                to="/admin/analytics"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  location.pathname === '/admin/analytics'
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconChartLine size={17} className={`shrink-0 ${location.pathname === '/admin/analytics' ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>Analytics</span>
              </Link>

              <Link
                to="/admin/customers"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  location.pathname === '/admin/customers'
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconUsers size={17} className={`shrink-0 ${location.pathname === '/admin/customers' ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>Customers</span>
              </Link>

              <Link
                to="/admin/settings"
                className={`flex items-center gap-2.5 h-9 px-4 mx-2 rounded-lg text-[13.5px] transition-all duration-150 ${
                  location.pathname === '/admin/settings'
                    ? 'bg-[var(--bg-hover)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]'
                }`}
              >
                <IconSettings size={17} className={`shrink-0 ${location.pathname === '/admin/settings' ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'}`} />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* User Card bottom Section */}
        <div className="w-full mt-auto p-4 border-t border-[var(--border-sub)]">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--bg-hover)]">
            <div className="w-8 h-8 rounded-full bg-[rgba(34,197,94,0.15)] text-[var(--accent)] font-mono text-[12px] font-medium flex items-center justify-center shrink-0">
              {adminProfile?.fullName ? adminProfile.fullName.substring(0, 2).toUpperCase() : 'BY'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-medium text-[var(--text-1)] truncate">
                {adminProfile?.fullName || 'Bypass Admin'}
              </span>
              <span className="text-[11px] text-[var(--text-3)] font-mono truncate max-w-[110px]">
                {adminProfile?.email || 'admin@morivanadaily.com'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <button
              onClick={handleSignOut}
              className="text-[11.5px] text-[var(--danger)] hover:underline cursor-pointer min-h-0 min-w-0 p-0"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main shell contents */}
      <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-page)] min-w-0">

        {/* TOPBAR — 56px height */}
        <header className="h-14 shrink-0 bg-[var(--bg-sidebar)] border-b border-[var(--border)] flex items-center justify-between px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 border border-[var(--border)] rounded-md flex items-center justify-center hover:bg-[var(--bg-hover)] text-[var(--text-1)] shrink-0 cursor-pointer"
              title="Open Menu"
            >
              <IconMenu2 size={16} />
            </button>

            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-2)]">
              <span className="text-[var(--text-3)]">Portal</span>
              <span className="text-[var(--text-3)]">/</span>
              <span className="font-semibold text-[var(--text-1)]">
                {getPageTitle()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Live real-time indicator */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] pulse-green-dot" />
            </div>

            {/* View Site Button */}
            <button
              onClick={() => navigate('/')}
              className="h-8 px-3 border border-[var(--border)] bg-transparent rounded-md text-[12.5px] font-medium text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors duration-150 flex items-center gap-1 cursor-pointer min-h-0 min-w-0"
            >
              <IconExternalLink size={13} />
              <span className="hidden sm:inline">View site</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 border border-[var(--border)] rounded-md flex items-center justify-center transition-colors duration-100 cursor-pointer hover:bg-[var(--bg-hover)] text-[var(--text-1)] min-h-0 min-w-0"
            >
              {theme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
            </button>

          </div>

        </header>

        <main className="flex-1 overflow-y-auto pt-5 px-0 pb-0 bg-[var(--bg-page)]">
          <Routes>
            {/* PAGE 1: OVERVIEW */}
            <Route path="/" element={
              stats ? (
                <div>
                  <div className="admin-page-title">Overview</div>
                  <div className="admin-page-sub">Last updated at 17:09:52 · Jun 12, 2026</div>

                  {/* Stat grid */}
                  <div className="stat-grid">
                    {kpis.map((kpi, idx) => (
                      <div key={idx} className="stat-card">
                        <div className="stat-label">
                          <span>{kpi.label}</span>
                          <button className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors duration-100 cursor-pointer min-h-0 min-w-0 p-0 border-0 bg-transparent">
                            <IconDots size={15} />
                          </button>
                        </div>

                        <div className="stat-value">
                          {kpi.value}
                        </div>

                        {kpi.delta && (
                          <div className="stat-change">
                            {kpi.delta.isNeutral ? (
                              <span className="change-neutral">
                                <IconMinus size={13} />
                              </span>
                            ) : kpi.delta.isPositive ? (
                              <span className="change-pos">
                                <IconTrendingUp size={13} /> {kpi.delta.amount}
                              </span>
                            ) : (
                              <span className="change-neg">
                                <IconTrendingDown size={13} /> {kpi.delta.amount}
                              </span>
                            )}
                            {kpi.delta.text && (
                              <span className="change-label">
                                {kpi.delta.text}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom row */}
                  <div className="bottom-row">
                    {/* Left Col: Chart + Stock */}
                    <div className="flex flex-col gap-4">
                      
                      {/* Chart Card */}
                      <div className="chart-card">
                        <div className="chart-header">
                          <span className="chart-title">Waitlist growth</span>
                          <span className="chart-meta">Jun 4 – Jun 12</span>
                        </div>

                        <div className="chart-area">
                          {(() => {
                            // Calculate SVG chart coordinates dynamically
                            const growthData = (stats?.charts?.growth || []).map(g => ({
                              date: g.date,
                              v: g.count
                            }))
                            const defaultGrowthData = [
                              { date: 'Jun 4', v: 0 },
                              { date: 'Jun 5', v: 0 },
                              { date: 'Jun 6', v: 0 },
                              { date: 'Jun 7', v: 0 },
                              { date: 'Jun 8', v: 1 },
                              { date: 'Jun 9', v: 3 },
                              { date: 'Jun 10', v: 5 },
                              { date: 'Jun 11', v: 7 },
                              { date: 'Jun 12', v: 7 }
                            ]
                            const finalGrowthData = growthData.length > 0 ? growthData : defaultGrowthData
                            const maxVal = Math.max(...finalGrowthData.map(d => d.v), 1)
                            const N = finalGrowthData.length
                            
                            const points = finalGrowthData.map((d, i) => {
                              const x = (i * 380) / (N - 1)
                              const y = 120 - ((d.v / maxVal) * 90)
                              return { x, y, date: d.date, val: d.v }
                            })
                            
                            const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
                            const fillPath = `${linePath} L380,120 L0,120Z`
                            
                            const maxPoint = points.reduce((prev, curr) => curr.val > prev.val ? curr : prev, points[0])
                            const tooltipX = Math.max(38, Math.min(342, maxPoint.x))
                            const tooltipRectX = tooltipX - 38

                            // Keep grid lines at y=30, y=75, y=120
                            return (
                              <svg className="w-full h-full" viewBox="0 0 380 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="0" y1="30" x2="380" y2="30" stroke="var(--color-border-tertiary)" strokeWidth="0.5"/>
                                <line x1="0" y1="75" x2="380" y2="75" stroke="var(--color-border-tertiary)" strokeWidth="0.5"/>
                                <line x1="0" y1="120" x2="380" y2="120" stroke="var(--color-border-tertiary)" strokeWidth="0.5"/>
                                
                                <path d={fillPath} fill="#16a34a" fillOpacity="0.1"/>
                                <path d={linePath} fill="none" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
                                
                                <circle cx={maxPoint.x.toFixed(1)} cy={maxPoint.y.toFixed(1)} r="4" fill="#16a34a"/>
                                
                                <rect x={tooltipRectX.toFixed(1)} y={(maxPoint.y - 21).toFixed(1)} width="76" height="20" rx="5" fill="#16a34a"/>
                                <text x={tooltipX.toFixed(1)} y={(maxPoint.y - 8).toFixed(1)} textAnchor="middle" fontSize="10" fill="white" fontFamily="sans-serif">
                                  {maxPoint.date} · {maxPoint.val} subs
                                </text>
                                
                                {(() => {
                                  // Selected label points
                                  const labelIndices = [
                                    0,
                                    Math.min(points.length - 1, Math.floor((points.length - 1) * 0.25)),
                                    Math.min(points.length - 1, Math.floor((points.length - 1) * 0.5)),
                                    Math.min(points.length - 1, Math.floor((points.length - 1) * 0.75)),
                                    points.length - 1
                                  ]
                                  return labelIndices.map((idx, i) => {
                                    const pt = points[idx]
                                    if (!pt) return null
                                    return (
                                      <text key={i} x={pt.x.toFixed(1)} y="148" fontSize="9" fill="var(--color-text-tertiary)" fontFamily="sans-serif" textAnchor="middle">
                                        {pt.date}
                                      </text>
                                    )
                                  })
                                })()}
                              </svg>
                            )
                          })()}
                        </div>
                      </div>

                      {/* Stock by SKU Card */}
                      <div className="stock-card">
                        <div className="stock-header">
                          <span className="stock-title">Stock by SKU</span>
                          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>2 active SKUs</span>
                        </div>

                        {/* MD-50G */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                            <span className="stock-sku">MD-50G</span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{stock50} / 120</span>
                          </div>
                          <div className="stock-bar-bg">
                            <div className="stock-bar-fill" style={{ width: `${Math.min(100, (stock50 / 120) * 100)}%` }}></div>
                          </div>
                          <div className="stock-nums">
                            <span>{getStockLabel(stock50)}</span>
                            <span>120 total</span>
                          </div>
                        </div>

                        {/* MD-100G */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                            <span className="stock-sku">MD-100G</span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{stock100} / 120</span>
                          </div>
                          <div className="stock-bar-bg">
                            <div className="stock-bar-fill" style={{ width: `${Math.min(100, (stock100 / 120) * 100)}%` }}></div>
                          </div>
                          <div className="stock-nums">
                            <span>{getStockLabel(stock100)}</span>
                            <span>120 total</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Col: Waitlist Directory */}
                    <div className="waitlist-card">
                      <div className="wl-header">
                        <span>Waitlist</span>
                        <button
                          onClick={exportWaitlistToCSV}
                          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer p-0.5 border-0 bg-transparent"
                          title="Export waitlist CSV"
                        >
                          <IconDownload size={15} />
                        </button>
                      </div>

                      <div className="wl-search">
                        <input
                          type="text"
                          placeholder="Search name or email…"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="wl-filter">
                        <select
                          value={filterRegion}
                          onChange={e => setFilterRegion(e.target.value)}
                        >
                          <option value="all">All locales</option>
                          <option value="global">Global</option>
                          <option value="india">India</option>
                          <option value="canada">Canada</option>
                        </select>
                      </div>

                      <div className="wl-list">
                        {finalFilteredSignups.length > 0 ? (
                          finalFilteredSignups.map((sub, idx) => {
                            const avatar = getAvatarStyles(sub)
                            const regionUpper = (sub.region || 'GLOBAL').toUpperCase()
                            const badgeClass = regionUpper === 'CANADA'
                              ? 'badge-canada'
                              : regionUpper === 'INDIA'
                                ? 'badge-india'
                                : 'badge-global'

                            return (
                              <div
                                key={sub._id || idx}
                                className="wl-item"
                              >
                                <div className="wl-avatar" style={avatar.style}>
                                  {avatar.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="wl-name truncate">
                                    {sub.name || sub.email.split('@')[0] || 'Subscriber'}
                                  </div>
                                  <div className="wl-email truncate">
                                    {sub.email}
                                  </div>
                                </div>
                                <span className={`locale-badge ${badgeClass}`}>
                                  {regionUpper}
                                </span>
                              </div>
                            )
                          })
                        ) : (
                          <div className="py-8 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                            No entries found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center text-sm text-[var(--color-text-secondary)] font-mono">
                  No statistics loaded.
                </div>
              )
            } />

            {/* PAGE 2: INVENTORY CONTROL */}
            <Route path="/inventory" element={
              <div>
                <div className="admin-page-title">Inventory Control</div>
                <div className="admin-page-sub">Manage product packaging variants and stock levels.</div>

                {/* Table card wrapper */}
                <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] overflow-hidden">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]" style={{ tableLayout: 'fixed' }}>
                      <thead>
                        <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border-tertiary)] h-11">
                          <th style={{ width: '40%' }} className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] text-left">PRODUCT / SKU</th>
                          <th style={{ width: '15%' }} className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] text-left">BASE PRICE</th>
                          <th style={{ width: '20%' }} className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] text-left">STOCK LEVEL</th>
                          <th style={{ width: '12%' }} className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] text-left">STATUS</th>
                          <th style={{ width: '13%' }} className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] text-left">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.length > 0 ? (
                          inventory.map((product) => {
                            const isEditing = editingId === product._id
                            return (
                              <tr
                                key={product._id}
                                className="h-14 border-b border-[var(--color-border-tertiary)] hover:bg-[var(--color-background-secondary)] transition-colors duration-100 last:border-b-0"
                              >

                                {/* Product Cell */}
                                <td className="px-5">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editForm.name}
                                      onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                      className="w-full h-8 bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-md px-2 text-xs text-[var(--color-text-primary)] focus:outline-none"
                                    />
                                  ) : (
                                    <div className="text-[14px] font-medium text-[var(--color-text-primary)] truncate">
                                      {product.name}
                                    </div>
                                  )}
                                  <div className="text-[11px] font-mono text-[var(--color-text-tertiary)] mt-0.5">
                                    {product.sku}
                                  </div>
                                </td>

                                {/* Price Cell */}
                                <td className="px-5">
                                  {isEditing ? (
                                    <div className="flex flex-col gap-1">
                                      <input
                                        type="number"
                                        value={editForm.price}
                                        onChange={e => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                        className="w-full h-7 bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-md px-2 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none"
                                        placeholder="INR"
                                      />
                                      <input
                                        type="number"
                                        value={editForm.priceUSD}
                                        onChange={e => setEditForm(prev => ({ ...prev, priceUSD: e.target.value }))}
                                        className="w-full h-7 bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-md px-2 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none"
                                        placeholder="USD"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex flex-col">
                                      <span className="text-[14px] font-mono font-medium text-[var(--color-text-primary)]">
                                        ₹{product.price}
                                      </span>
                                      {product.priceUSD && (
                                        <span className="text-[11px] font-mono text-[var(--color-text-tertiary)] mt-0.5">
                                          ${product.priceUSD} USD
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>

                                {/* Stock Level Stepper */}
                                <td className={`px-5 ${flashingIds[product._id] ? 'flash-green' : ''}`}>
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={editForm.stock}
                                      onChange={e => setEditForm(prev => ({ ...prev, stock: e.target.value }))}
                                      className="w-20 h-8 bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-md px-2 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none"
                                    />
                                  ) : (
                                    <StockStepper product={product} onSave={handleQuickStockUpdate} />
                                  )}
                                </td>

                                {/* Status Badge */}
                                <td className="px-5">
                                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${product.stock > 0
                                    ? 'bg-[var(--accent-dim)] text-[var(--color-text-success)]'
                                    : 'bg-[var(--danger-dim)] text-[var(--color-text-danger)]'
                                    }`}>
                                    {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                                  </span>
                                </td>

                                {/* Action Items */}
                                <td className="px-5">
                                  {isEditing ? (
                                    <div className="flex gap-2.5 items-center">
                                      <button
                                        onClick={() => saveProductDetails(product._id)}
                                        className="text-xs font-semibold text-[var(--color-text-primary)] hover:underline cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={cancelEditing}
                                        className="text-xs text-[var(--color-text-tertiary)] hover:underline cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex gap-4">
                                      <button
                                        onClick={() => startEditing(product)}
                                        className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProduct(product._id, product.sku)}
                                        className="text-[13px] text-[var(--color-text-danger)] hover:underline cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </td>

                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                              No products configured in database.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Ghost Add Row */}
                  <div
                    onClick={() => navigate('/admin/list-product')}
                    className="h-12 border-t border-dashed border-[var(--color-border-tertiary)] flex items-center gap-2 px-5 text-[13px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] transition-colors duration-100 cursor-pointer"
                  >
                    <IconPlus size={14} />
                    <span>Add new SKU</span>
                  </div>

                </div>

              </div>
            } />

            {/* PAGE 3: LIST NEW VARIANT */}
            <Route path="/list-product" element={
              <div>
                <div className="admin-page-title">List New Variant</div>
                <div className="admin-page-sub">Add a new packaging size variant to the storefront catalog.</div>

                <div className="w-full max-w-[520px] mx-auto">
                  <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] p-8">

                    <div className="border-b border-[var(--color-border-tertiary)] pb-6 mb-6">
                      <h3 className="text-[16px] font-medium text-[var(--color-text-primary)]">
                        Publish New Packaging SKU
                      </h3>
                      <p className="text-[13px] text-[var(--color-text-tertiary)] mt-1">
                        Add a new size variant and configure its initial stock.
                      </p>
                    </div>

                    {formError && (
                      <div className="mb-5 p-3 rounded-lg border border-[rgba(239,68,68,0.2)] bg-[var(--danger-dim)] text-[var(--color-text-danger)] text-xs font-semibold">
                        ✕ {formError}
                      </div>
                    )}

                    <form onSubmit={handleCreateProduct} className="flex flex-col gap-5">

                      {/* SKU Code */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[var(--color-text-secondary)]">SKU Code</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. MD-200G"
                          value={newProduct.sku}
                          onChange={e => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
                          className="h-10 bg-[var(--color-background-secondary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[7px] px-3.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] font-mono focus:border-[var(--color-text-success)] focus:ring-3 focus:ring-[var(--color-background-info)] focus:outline-none transition-all duration-150"
                        />
                      </div>

                      {/* Product Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[var(--color-text-secondary)]">Product Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Morivaná Daily Super Greens (200g Eco Refill)"
                          value={newProduct.name}
                          onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          className="h-10 bg-[var(--color-background-secondary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[7px] px-3.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-text-success)] focus:ring-3 focus:ring-[var(--color-background-info)] focus:outline-none transition-all duration-150"
                        />
                      </div>

                      {/* Price dual-grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-medium text-[var(--color-text-secondary)]">INR Price (₹)</label>
                          <input
                            type="number"
                            required
                            placeholder="799"
                            value={newProduct.price}
                            onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                            className="h-10 bg-[var(--color-background-secondary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[7px] px-3.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] font-mono focus:border-[var(--color-text-success)] focus:ring-3 focus:ring-[var(--color-background-info)] focus:outline-none transition-all duration-150"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[12px] font-medium text-[var(--color-text-secondary)]">USD Price ($)</label>
                            <span className="text-[11px] text-[var(--color-text-tertiary)]">(optional)</span>
                          </div>
                          <input
                            type="number"
                            placeholder="39"
                            value={newProduct.priceUSD}
                            onChange={e => setNewProduct(prev => ({ ...prev, priceUSD: e.target.value }))}
                            className="h-10 bg-[var(--color-background-secondary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[7px] px-3.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] font-mono focus:border-[var(--color-text-success)] focus:ring-3 focus:ring-[var(--color-background-info)] focus:outline-none transition-all duration-150"
                          />
                        </div>
                      </div>

                      {/* Initial Stock */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[var(--color-text-secondary)]">Initial Stock Level</label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="100"
                          value={newProduct.stock}
                          onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                          className="h-10 bg-[var(--color-background-secondary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[7px] px-3.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] font-mono focus:border-[var(--color-text-success)] focus:ring-3 focus:ring-[var(--color-background-info)] focus:outline-none transition-all duration-150"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={formSubmitting || formSuccess}
                        className={`w-full mt-6 h-11 rounded-[7px] text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors duration-100 hover:brightness-90 ${formSuccess
                          ? 'bg-[var(--color-text-success)] text-[var(--color-background-primary)]'
                          : 'bg-[var(--color-text-primary)] text-[var(--color-background-primary)] disabled:opacity-60'
                          }`}
                      >
                        {formSuccess ? (
                          <span>Variant Listed  ✓</span>
                        ) : formSubmitting ? (
                          <>
                            <IconLoader2 className="animate-spin w-4 h-4 shrink-0" />
                            <span>Listing…</span>
                          </>
                        ) : (
                          <span>List Product Variant</span>
                        )}
                      </button>

                    </form>

                  </div>
                </div>

              </div>
            } />

            {/* PAGE 4: DELIVERIES */}
            <Route path="/deliveries" element={<DeliveriesPage />} />

            {/* PAGE 5: PAYMENTS */}
            <Route path="/payments" element={<PaymentsPage />} />

            {/* PAGE 6: RETURNS */}
            <Route path="/returns" element={<ReturnsPage />} />

            {/* PAGE 7: ANALYTICS */}
            <Route path="/analytics" element={<AnalyticsPage stats={stats} />} />

            {/* PAGE 8: CUSTOMERS */}
            <Route path="/customers" element={<CustomersPage />} />

            {/* PAGE 9: SETTINGS */}
            <Route path="/settings" element={<SettingsPage />} />

          </Routes>

        </main>

      </div>

    </div>
  )
}

// DELIVERIES SUBPAGE
function DeliveriesPage() {
  const api = useApi()
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await api.get('/api/admin/deliveries')
        setDeliveries(data)
      } catch (err) {
        console.error('Failed to load deliveries:', err)
        setError(err.message || 'Failed to load deliveries')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div>
      <div className="admin-page-title">Deliveries</div>
      <div className="admin-page-sub">Manage and track live outgoing shipments.</div>

      <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border-tertiary)] h-11 text-left">
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Order ID</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Customer</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Carrier</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Tracking</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Destination</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                    <IconLoader2 className="animate-spin w-4 h-4 inline-block mr-2 text-[var(--accent)]" /> Loading shipments…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="h-20 text-center text-xs text-[var(--color-text-danger)] font-mono">
                    ✕ {error}
                  </td>
                </tr>
              ) : deliveries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                    No shipments found.
                  </td>
                </tr>
              ) : (
                deliveries.map((d, idx) => (
                  <tr key={d._id || idx} className="h-14 border-b border-[var(--color-border-tertiary)] hover:bg-[var(--color-background-secondary)] transition-colors duration-100 last:border-b-0">
                    <td className="px-5 text-xs font-mono font-medium text-[var(--color-text-primary)]">{d.id}</td>
                    <td className="px-5 text-[13px] text-[var(--color-text-primary)]">{d.customer}</td>
                    <td className="px-5 text-xs text-[var(--color-text-secondary)]">{d.carrier}</td>
                    <td className="px-5 text-xs font-mono text-[var(--color-text-secondary)]">{d.tracking}</td>
                    <td className="px-5 text-[13px] text-[var(--color-text-secondary)]">{d.dest}</td>
                    <td className="px-5">
                      <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md ${
                        d.status === 'Delivered'
                          ? 'bg-[var(--color-background-info)] text-[var(--color-text-info)]'
                          : d.status === 'Shipped'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        {d.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// PAYMENTS SUBPAGE
function PaymentsPage() {
  const api = useApi()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await api.get('/api/admin/payments')
        setTransactions(data)
      } catch (err) {
        console.error('Failed to load payments:', err)
        setError(err.message || 'Failed to load payments')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div>
      <div className="admin-page-title">Payments</div>
      <div className="admin-page-sub">Recent payment settlements and processing states.</div>

      <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border-tertiary)] h-11 text-left">
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Gateway</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Order Ref</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Amount</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">USD Equivalent</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Method</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Status</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Settlement Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                    <IconLoader2 className="animate-spin w-4 h-4 inline-block mr-2 text-[var(--accent)]" /> Loading transactions…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="h-20 text-center text-xs text-[var(--color-text-danger)] font-mono">
                    ✕ {error}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t, idx) => (
                  <tr key={t._id || idx} className="h-14 border-b border-[var(--color-border-tertiary)] hover:bg-[var(--color-background-secondary)] transition-colors duration-100 last:border-b-0">
                    <td className="px-5 text-[13px] font-medium text-[var(--color-text-primary)]">{t.gateway}</td>
                    <td className="px-5 text-xs font-mono text-[var(--color-text-secondary)]">{t.order}</td>
                    <td className="px-5 text-xs font-mono font-semibold text-[var(--color-text-primary)]">{t.amount}</td>
                    <td className="px-5 text-xs font-mono text-[var(--color-text-secondary)]">{t.usd}</td>
                    <td className="px-5 text-xs text-[var(--color-text-secondary)]">{t.method}</td>
                    <td className="px-5">
                      <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md ${
                        t.status === 'Settled'
                          ? 'bg-[#f0fdf4] text-[#166534]'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 text-xs text-[var(--color-text-secondary)]">{t.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// RETURNS SUBPAGE
function ReturnsPage() {
  const api = useApi()
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await api.get('/api/admin/returns')
        setReturns(data)
      } catch (err) {
        console.error('Failed to load returns:', err)
        setError(err.message || 'Failed to load returns')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div>
      <div className="admin-page-title">Returns</div>
      <div className="admin-page-sub">Manage consumer refund and packaging returns.</div>

      <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border-tertiary)] h-11 text-left">
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Return ID</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Order Ref</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Customer</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Item</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Reason</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Status</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Date Requested</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                    <IconLoader2 className="animate-spin w-4 h-4 inline-block mr-2 text-[var(--accent)]" /> Loading returns…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="h-20 text-center text-xs text-[var(--color-text-danger)] font-mono">
                    ✕ {error}
                  </td>
                </tr>
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                    No returns found.
                  </td>
                </tr>
              ) : (
                returns.map((r, idx) => (
                  <tr key={r._id || idx} className="h-14 border-b border-[var(--color-border-tertiary)] hover:bg-[var(--color-background-secondary)] transition-colors duration-100 last:border-b-0">
                    <td className="px-5 text-xs font-mono font-medium text-[var(--color-text-primary)]">{r.id}</td>
                    <td className="px-5 text-xs font-mono text-[var(--color-text-secondary)]">{r.order}</td>
                    <td className="px-5 text-[13px] text-[var(--color-text-primary)]">{r.customer}</td>
                    <td className="px-5 text-xs font-mono text-[var(--color-text-primary)]">{r.item}</td>
                    <td className="px-5 text-[13px] text-[var(--color-text-secondary)]">{r.reason}</td>
                    <td className="px-5">
                      <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md ${
                        r.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 text-xs text-[var(--color-text-secondary)]">{r.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ANALYTICS SUBPAGE
function AnalyticsPage({ stats }) {
  const activeSubs = stats?.metrics?.waitlistCount !== undefined ? stats.metrics.waitlistCount : 7
  const subPercent = ((activeSubs / 1420) * 100).toFixed(1) + '%'

  return (
    <div>
      <div className="admin-page-title">Analytics</div>
      <div className="admin-page-sub">Analyze storefront traffic channels and waitlist conversion funnels.</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--gap)]">
        <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] p-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Traffic & Acquisition</h3>
          <div className="flex flex-col gap-3">
            {[
              { source: 'Direct Storefront', percent: '68%', count: '320 hits' },
              { source: 'Instagram / Organic Link', percent: '22%', count: '104 hits' },
              { source: 'Google Search / SEO', percent: '10%', count: '47 hits' }
            ].map((s, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between text-xs text-[var(--color-text-primary)] mb-1">
                  <span>{s.source}</span>
                  <span className="font-semibold">{s.percent} <span className="text-[var(--color-text-secondary)] font-normal">({s.count})</span></span>
                </div>
                <div className="h-2 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--green)] rounded-full" style={{ width: s.percent }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] p-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Waitlist Conversion Funnel</h3>
          <div className="flex flex-col gap-3">
            {[
              { stage: 'Total Site Hits', value: '1,420', percent: '100%' },
              { stage: 'View Product Details', value: '890', percent: '62%' },
              { stage: 'Click Join Waitlist', value: '180', percent: '12%' },
              { stage: 'Email Verified / Active Sub', value: activeSubs.toString(), percent: subPercent }
            ].map((st, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-[var(--color-border-tertiary)] last:border-0">
                <span className="text-[var(--color-text-secondary)]">{st.stage}</span>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-[var(--color-text-primary)] font-semibold">{st.value}</span>
                  <span className="text-[10px] text-[var(--color-text-success)]">({st.percent})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// CUSTOMERS SUBPAGE
function CustomersPage() {
  const api = useApi()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await api.get('/api/admin/customers')
        setCustomers(data)
      } catch (err) {
        console.error('Failed to load customers:', err)
        setError(err.message || 'Failed to load customers')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div>
      <div className="admin-page-title">Customers</div>
      <div className="admin-page-sub">Directory of registered customers and waitlist subscribers.</div>

      <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border-tertiary)] h-11 text-left">
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Name</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Email</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Region</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Orders Completed</th>
                <th className="px-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                    <IconLoader2 className="animate-spin w-4 h-4 inline-block mr-2 text-[var(--accent)]" /> Loading customers…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="h-20 text-center text-xs text-[var(--color-text-danger)] font-mono">
                    ✕ {error}
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="h-20 text-center text-xs text-[var(--color-text-tertiary)] font-mono">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c, idx) => (
                  <tr key={c._id || idx} className="h-14 border-b border-[var(--color-border-tertiary)] hover:bg-[var(--color-background-secondary)] transition-colors duration-100 last:border-b-0">
                    <td className="px-5 text-[13px] font-medium text-[var(--color-text-primary)]">{c.name}</td>
                    <td className="px-5 text-xs font-mono text-[var(--color-text-secondary)]">{c.email}</td>
                    <td className="px-5">
                      <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md ${
                        c.region === 'CANADA'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                          : c.region === 'INDIA'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400'
                      }`}>
                        {c.region}
                      </span>
                    </td>
                    <td className="px-5 text-xs font-mono font-semibold text-[var(--color-text-primary)]">{c.orders}</td>
                    <td className="px-5 text-xs text-[var(--color-text-secondary)]">{c.signout}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// SETTINGS SUBPAGE
function SettingsPage() {
  return (
    <div>
      <div className="admin-page-title">Settings</div>
      <div className="admin-page-sub">Configure portal parameters and auth bypass toggles.</div>

      <div className="bg-[var(--color-background-primary)] border-[0.5px] border-[var(--color-border-tertiary)] rounded-[var(--r)] p-6 max-w-xl">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Portal Settings</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-tertiary)]">
            <div>
              <div className="text-xs font-medium text-[var(--color-text-primary)]">Bypass Passcode Auth</div>
              <div className="text-[11px] text-[var(--color-text-secondary)]">Permit local bypass tokens for testing.</div>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-[var(--color-border-tertiary)] accent-[#16a34a]" />
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-tertiary)]">
            <div>
              <div className="text-xs font-medium text-[var(--color-text-primary)]">Auto-scroll Active Orders</div>
              <div className="text-[11px] text-[var(--color-text-secondary)]">Animate newest entries into view.</div>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-[var(--color-border-tertiary)] accent-[#16a34a]" />
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[var(--color-border-tertiary)]">
            <div>
              <div className="text-xs font-medium text-[var(--color-text-primary)]">Realtime Notifications</div>
              <div className="text-[11px] text-[var(--color-text-secondary)]">Flash screen green on new waitlist signups.</div>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-[var(--color-border-tertiary)] accent-[#16a34a]" />
          </div>
        </div>
      </div>
    </div>
  )
}
