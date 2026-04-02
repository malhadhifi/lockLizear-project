import api from '../../../lib/axios'

/**
 * ملف: userApi.js
 * الوظيفة: يتصل بخوادم الباك إند الخاصة بالعملاء (Customer Licenses).
 * المسار الأساسي في Axios تم ضبطه على /api/customer-management مسبقاً.
 */
export const userApi = {
  // 1. جلب قائمة العملاء
  fetchCustomers: async () => {
    // بناءً على راوتر لارافيل: Route::get('/customer-licenses', [CustomerLicenseController::class, 'index']);
    const response = await api.get('/customer-management/customer-licenses')
    return response.data
  },
  
  // 2. إضافة عميل جديد
  createCustomer: async (customerData) => {
    // Route::post('/customer-licenses', [CustomerLicenseController::class, 'store']);
    const response = await api.post('/customer-management/customer-licenses', customerData)
    return response.data
  },

  // 3. الإجراءات الجماعية (إيقاف، حذف، تفعيل، إلخ)
  bulkAction: async (data) => {
    // Route::post('/customer-licenses/bulk-action', ...);
    // يتوقع الباك إند: { license_ids: [], action: 'suspend' | 'activate' ... }
    const response = await api.post('/customer-management/customer-licenses/bulk-action', data)
    return response.data
  },

  // 4. جلب تفاصيل عميل محدد
  getCustomerDetails: async (id) => {
    // Route::get('/customer-licenses/{id}', ...);
    const response = await api.get(`/customer-management/customer-licenses/${id}`)
    return response.data
  },

  // 5. تعديل بيانات عميل
  updateCustomer: async ({ id, data }) => {
    // يتوقع الباك إند طلب PUT
    const response = await api.put(`/customer-management/customer-licenses/${id}`, data)
    return response.data
  }
}
