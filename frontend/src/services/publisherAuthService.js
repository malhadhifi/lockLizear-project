import api from '../lib/axios'

/**
 * POST /publisher/register
 * يُرسل بيانات التسجيل ويعيد { success, code, data }
 */
export async function registerPublisher(formData) {
  const response = await api.post('/publisher/register', formData)
  return response
}
