import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../services/userApi'

// خطاف جلب قائمة العملاء وعرضهم في الجدول
export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],          // اسم الكاش
    queryFn: userApi.fetchCustomers   // الدالة التي ستتصل بالباك إند
  })
}

// خطاف العمليات الجماعية للعملاء
export const useCustomerBulkAction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.bulkAction,
    onSuccess: () => {
      // إجبار الجدول على إعادة تعبئة نفسه بالبيانات الجديدة بعد التحديث
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })
}

// خطاف جلب تفاصيل عميل محدد
export const useCustomerDetails = (id) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => userApi.getCustomerDetails(id),
    enabled: !!id // جلب البيانات فقط إذا كان المعرف موجوداً
  })
}

// خطاف حفظ التعديلات على بيانات العميل
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.updateCustomer,
    onSuccess: (data, variables) => {
      // تحديث الجدول وقائمة تفاصيل هذا العميل لتعكس البيانات الحقيقية
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] })
    }
  })
}
