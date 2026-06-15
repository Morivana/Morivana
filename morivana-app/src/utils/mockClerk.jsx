import React, { createContext, useContext, useState, useEffect } from 'react'

const ClerkContext = createContext(null)

export function ClerkProvider({ children }) {
  return <ClerkContext.Provider value={{}}>{children}</ClerkContext.Provider>
}

export function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    return typeof window !== 'undefined' && !!localStorage.getItem('admin_bypass_token')
  })

  useEffect(() => {
    const check = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_bypass_token') : null
      setIsSignedIn(!!token)
    }
    window.addEventListener('storage', check)
    // Check periodically or handle standard local changes
    const interval = setInterval(check, 1000)
    return () => {
      window.removeEventListener('storage', check)
      clearInterval(interval)
    }
  }, [])

  return {
    isLoaded: true,
    isSignedIn: isSignedIn,
    signOut: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_bypass_token')
        window.dispatchEvent(new Event('storage'))
      }
    },
    getToken: async () => typeof window !== 'undefined' ? localStorage.getItem('admin_bypass_token') : null,
  }
}

export function useUser() {
  const { isSignedIn, signOut } = useAuth()
  
  const mockUser = {
    id: 'user_mock_12345',
    fullName: 'Bypass Admin',
    firstName: 'Bypass',
    lastName: 'Admin',
    primaryEmailAddress: {
      emailAddress: 'admin@morivana.local',
    },
    unsafeMetadata: {
      phone: '+91 99999 99999',
      gender: 'male',
      newsletter: true,
    },
    createdAt: new Date().toISOString(),
    update: async (data) => {
      console.log('Mock user.update called with:', data)
      return { ok: true }
    },
  }

  return {
    isLoaded: true,
    isSignedIn: isSignedIn,
    user: isSignedIn ? mockUser : null,
  }
}

export function useClerk() {
  const { signOut } = useAuth()
  return {
    signOut,
  }
}

export function useSession() {
  return {
    session: {
      id: 'sess_mock_12345',
    },
  }
}

export function useSessionList() {
  return {
    isLoaded: true,
    sessions: [
      {
        id: 'sess_mock_12345',
        latestActivity: {
          browser: 'Chrome',
          os: 'macOS',
          ipAddress: '127.0.0.1',
        },
      },
    ],
  }
}

export function SignIn({ appearance, routing, path, afterSignInUrl, signUpUrl }) {
  return (
    <div style={{ padding: '20px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px', color: '#333', textAlign: 'center' }}>
      <h3 style={{ margin: '0 0 10px' }}>Mock Sign In</h3>
      <p style={{ margin: '0 0 15px', fontSize: '13px' }}>Clerk has been mocked on localhost to prevent domain restriction errors.</p>
      <button
        onClick={() => {
          localStorage.setItem('admin_bypass_token', 'mock_dev_bypass_token')
          window.location.href = afterSignInUrl || '/account'
        }}
        style={{
          background: '#194102',
          color: '#CDD883',
          border: 'none',
          borderRadius: '999px',
          padding: '10px 20px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Sign In as Mock User
      </button>
    </div>
  )
}

export function SignUp({ appearance, routing, path, signInUrl }) {
  return (
    <div style={{ padding: '20px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px', color: '#333', textAlign: 'center' }}>
      <h3 style={{ margin: '0 0 10px' }}>Mock Sign Up</h3>
      <p style={{ margin: '0 0 15px', fontSize: '13px' }}>Clerk has been mocked on localhost to prevent domain restriction errors.</p>
      <button
        onClick={() => {
          localStorage.setItem('admin_bypass_token', 'mock_dev_bypass_token')
          window.location.href = '/account'
        }}
        style={{
          background: '#194102',
          color: '#CDD883',
          border: 'none',
          borderRadius: '999px',
          padding: '10px 20px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Sign Up as Mock User
      </button>
    </div>
  )
}
