export async function http(method, url, body, config = {}) {
  const token = localStorage.getItem('accessToken');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...config.headers,
    },
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  let data = null;
  const contentType = res.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    data = await res.json();
  }

  if (!res.ok) {
    // If unauthorized and token exists, clear it (token might be expired)
    if (res.status === 401) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    
    const error = new Error(data?.error || data?.message || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const GET = (url, config) => http('GET', url, null, config);
export const POST = (url, body, config) => http('POST', url, body, config);
export const PUT = (url, body, config) => http('PUT', url, body, config);
export const DELETE = (url, config) => http('DELETE', url, null, config);
