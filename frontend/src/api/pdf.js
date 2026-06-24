import api from './axios'

export async function mergePdfs(files) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const { data } = await api.post('/api/pdf/merge', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  })

  return data
}

export async function imageToPdf(files) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const { data } = await api.post('/api/pdf/image-to-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  })

  return data
}

export async function wordToPdf(file) {
  const formData = new FormData()
  formData.append('files', file)

  const { data } = await api.post('/api/pdf/word-to-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  })

  return data
}

export async function splitPdf(file) {
  const formData = new FormData()
  formData.append('files', file)

  const { data } = await api.post('/api/pdf/split', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  })
  return data
}

export async function getPdfErrorMessage(error, fallback = 'Failed to process PDF') {
  if (error.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text()
      const json = JSON.parse(text)
      if (json.message) return json.message
    } catch {
      /* use fallback */
    }
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Unable to reach server. Please check your connection.'
  }

  return fallback
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
