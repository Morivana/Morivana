import { useState, useEffect } from 'react'

const CART_STORAGE_KEY = 'morivana_cart'

/**
 * useCart — localStorage-backed cart state hook.
 *
 * Rules (per spec):
 *   - Cart state is saved to localStorage on every change
 *   - On app mount, cart is rehydrated from localStorage
 *   - Cart is NOT cleared on sign-out (guest & auth share the same cart)
 *   - Auth tokens are never stored here — Clerk handles those
 *
 * Usage:
 *   const { cart, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal } = useCart()
 *
 * Item shape: { id, name, price, qty, imageUrl? }
 */
export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist to localStorage on every cart change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Storage quota exceeded or private mode — fail silently
    }
  }, [cart])

  const addItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + (item.qty ?? 1) } : i
        )
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }]
    })
  }

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return { cart, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal }
}
