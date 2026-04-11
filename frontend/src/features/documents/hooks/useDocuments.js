/**
 * useDocuments.js
 * React Query hooks لـ feature المستندات.
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import documentService from '../services/documentService'

// ── مفاتيح الـ Query ─────────────────────────────────────────────
export const DOCUMENTS_KEYS = {
  all:        () => ['documents'],
  list:       (params) => ['documents', 'list', params],
  detail:     (id)     => ['documents', 'detail', id],
  accessList: (id)     => ['documents', 'access', id],
}

// 1. جلب القائمة
export const useDocuments = (params = {}) =>
  useQuery({
    queryKey:         DOCUMENTS_KEYS.list(params),
    queryFn:          () => documentService.getAllAccess(params),
    placeholderData:  keepPreviousData,
    staleTime:        1000 * 60 * 2,
  })

// 2. تفاصيل مستند
export const useDocumentDetail = (id) =>
  useQuery({
    queryKey:  DOCUMENTS_KEYS.detail(id),
    queryFn:   () => documentService.getById(id),
    enabled:   !!id,
    staleTime: 1000 * 60 * 5,
  })

// 3. قائمة الوصول — تم توحيد الاسم مع documentService.getAccessList
export const useDocumentAccessList = (id) =>
  useQuery({
    queryKey:  DOCUMENTS_KEYS.accessList(id),
    queryFn:   () => documentService.getAccessList(id), // ✅ متطابق مع documentService
    enabled:   !!id,
    staleTime: 1000 * 60 * 3,
  })

// 4. تنفيذ عملية (Suspend / Activate / Delete)
export const useDocumentAction = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, action }) =>
      documentService.executeAction(ids, action),  // lowercase يتم داخل الـ service
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_KEYS.all() })
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || 'فشل تنفيذ العملية'
      )
    },
  })
}

// 5. تحديث بيانات مستند
export const useUpdateDocument = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => documentService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: DOCUMENTS_KEYS.all() })
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || 'فشل تحديث المستند'
      )
    },
  })
}

// 6. تصدير CSV
export const useDocumentExport = () =>
  useMutation({
    mutationFn: (params) => documentService.exportCSV(params),
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || 'فشل تصدير الملف'
      )
    },
  })

export const useSelectDocuments = (params = {}) => {
  const stringifiedParams = JSON.stringify(params);

  return useQuery({
    queryKey: DOCUMENTS_KEYS.all(stringifiedParams),

    queryFn: async () => {
      // 1. استلام البيانات (الكائن الذي يحتوي على items و pagination)
      const result = await documentService.getAll(params);

      // 2. تحديث المفتش الذكي ليطابق الـ JSON الخاص بك تماماً
      const items = Array.isArray(result?.items)
        ? result.items // ✅ يبحث هنا أولاً
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];

      // 3. قراءة عدد الصفحات من كائن pagination
      const totalPages =
        result?.pagination?.last_page || result?.last_page || 1;

      // تسليمها للواجهة
      return { items, totalPages };
    },

    placeholderData: keepPreviousData,
    retry: false,
  });
};
