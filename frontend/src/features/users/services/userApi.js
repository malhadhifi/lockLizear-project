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
    return response
  },
  
  // 2. إضافة عميل جديد
  createCustomer: async (customerData) => {
    // Route::post('/customer-licenses', [CustomerLicenseController::class, 'store']);
    const response = await api.post('/customer-management/customer-licenses', customerData)
    return response
  },

  // 3. الإجراءات الجماعية (إيقاف، حذف، تفعيل، إلخ)
  bulkAction: async (data) => {
    // Route::post('/customer-licenses/bulk-action', ...);
    // يتوقع الباك إند: { license_ids: [], action: 'suspend' | 'activate' ... }
    const response = await api.post('/customer-management/customer-licenses/bulk-action', data)
    return response
  },

  // 4. جلب تفاصيل عميل محدد
  getCustomerDetails: async (id) => {
    // Route::get('/customer-licenses/{id}', ...);
    const response = await api.get(`/customer-management/customer-licenses/${id}`)
    return response
  },

  // 5. تعديل بيانات عميل
  updateCustomer: async ({ id, data }) => {
    // يتوقع الباك إند طلب PUT
    const response = await api.put(`/customer-management/customer-licenses/${id}`, data)
    return response
  },

  // 6. تحميل ملف الرخصة
  downloadLicense: async (id) => {
    const response = await api.get(`/customer-management/customer-licenses/${id}/download`, {
      responseType: 'blob'
    })
    return response
  },

  // 7. جلب منشورات العميل مع حالة الوصول
  getCustomerPublications: async (customerId) => {
    const response = await api.get(`/customer-management/customer-licenses/${customerId}/publications`)
    return response
  },

  // 8. تعديل صلاحيات وصول المنشورات (unlimited / limited / revoke)
  updatePublicationAccess: async ({ customerId, data }) => {
    const response = await api.post(`/customer-management/customer-licenses/${customerId}/publications/bulk-access`, data)
    return response
  },

  // 9. جلب مستندات العميل مع حالة الوصول
  getCustomerDocuments: async (customerId) => {
    const response = await api.get(`/customer-management/customer-licenses/${customerId}/documents`)
    return response
  },

  // 10. تعديل صلاحيات وصول المستندات (unlimited / limited / baselimited / revoke)
  updateDocumentAccess: async ({ customerId, data }) => {
    const response = await api.post(`/customer-management/customer-licenses/${customerId}/documents/bulk-access`, data)
    return response
  }
}
