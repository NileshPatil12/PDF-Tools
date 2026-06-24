const EMAIL_REGEX = /^\S+@\S+\.\S+$/

export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required'
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return ''
}

export function validateName(name) {
  if (!name?.trim()) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  if (name.trim().length > 100) return 'Name cannot exceed 100 characters'
  return ''
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}

export function validateLoginForm({ email, password }) {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
  }
}

export function validateRegisterForm({ name, email, password, confirmPassword }) {
  return {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  }
}
