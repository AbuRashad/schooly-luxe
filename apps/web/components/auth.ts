export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('schooly_luxe_token');
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('schooly_luxe_token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('schooly_luxe_token');
  }
}
