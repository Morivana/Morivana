/**
 * Environment Validation Utility
 * Checks for mandatory environment variables at start up and throws explicit errors in development.
 */
export function validateEnv() {
  const required = [
    'VITE_CLERK_PUBLISHABLE_KEY'
  ]
  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    const errorMsg = `Missing environment variables: ${missing.join(', ')}. Please configure them in .env`
    console.error(`[Env Validation] ${errorMsg}`)
    if (import.meta.env.DEV) {
      throw new Error(errorMsg)
    }
  }
}
