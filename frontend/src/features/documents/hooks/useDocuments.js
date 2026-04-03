import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import documentService from '../services/documentService'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────
// 1. جلب قائمة المستندات مع دعم الفلاتر
//    params: { show, sort_by, per_page, page }
// ─────────────────────────────────────────────
export const useDocuments = (params = {}) => {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentService.getAll(params),
    keepPreviousData: true, // لا flash عند تبديل الصفحة أو الفلتر
  })
}

// ─────────────────────────────────────────────
// 2. جلب تفاصيل مستند واحد بواسطة ID
// ─────────────────────────────────────────────
export const useDocumentDetail = (id) => {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: () => documentService.getById(id),
    enabled: !!id, // لا تجلب إذا لم يكن الـ ID موجوداً
  })
}

// ─────────────────────────────────────────────
// 3. تنفيذ إجراء على مستند أو مجموعة مستندات
//    action: 'Suspend' | 'Activate' | 'Delete'
// ─────────────────────────────────────────────
export const useDocumentAction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, action }) => documentService.executeAction(ids, action),
    onSuccess: (_, variables) => {
      // تحديث القائمة الكاملة
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      // لو كان إجراء على مستند واحد، تحديث تفاصيله أيضاً
      if (variables.ids.length === 1) {
        queryClient.invalidateQueries({ queryKey: ['documents', variables.ids[0]] })
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'فشل تنفيذ الإجراء')
    },
  })
}

// ─────────────────────────────────────────────
// 4. تحديث بيانات مستند (description, expired, status)
// ─────────────────────────────────────────────
export const useUpdateDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => documentService.update(id, data),
    onSuccess: (_, variables) => {
      // تحديث القائمة وتفاصيل هذا المستند تحديداً
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['documents', variables.id] })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'فشل تحديث المستند')
    },
  })
}

// ─────────────────────────────────────────────
// 5. جلب قائمة العملاء المصرح لهم بالوصول لمستند
// ─────────────────────────────────────────────
export const useDocumentAccessList = (id) => {
  return useQuery({
    queryKey: ['document-access', id],
    queryFn: () => documentService.getDocumentAccessList(id),
    enabled: !!id,
  })
}

// ─────────────────────────────────────────────
// 6. تصدير المستندات CSV
// ─────────────────────────────────────────────
export const useDocumentExport = () => {
  return useMutation({
    mutationFn: (params) => documentService.exportCSV(params),
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'فشل تصدير الملف')
    },
  })
}
