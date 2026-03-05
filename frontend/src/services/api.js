import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 minutes — Gemini can be slow
})

/**
 * Upload a prescription file and return the analysis result.
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function analyzePrescription(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/api/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * Call the health check endpoint.
 * @returns {Promise<Object>}
 */
export async function checkHealth() {
  const response = await api.get('/api/health')
  return response.data
}
