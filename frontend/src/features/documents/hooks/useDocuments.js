/**
 * ملف: useDocuments.js
 * المسار: frontend/src/features/documents/hooks/useDocuments.js
 *
 * جميع React Query hooks الخاصة بـ feature المستندات.
 * تُستخدم هذه الـ hooks في:
 *   - DocumentsListPage.jsx
 *   - DocumentDetailPage.jsx
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import documentService from '../services/documentService'

// ─────────────────────────────────────────────────────────────────────────────
// مفاتيح الـ Query (مركزية لتسهيل الـ invalidation)
// ─────────────────────────────────────────────────────────────────────────────
export const DOCUMENTS_KEYS = {
  all:        () => ['documents'],
  list:       (params) => ['documents', 'list', params],
  detail:     (id)     => ['documents', 'detail', id],
  accessList: (id)     => ['documents', 'access', id],
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. جلب قائمة المستندات مع فلاتر + pagination
// ─────────────────────────────────────────────────────────────────────────────
/**
 * useDocuments
 * @param {object} params - { search, show, sort_by, per_page, page }
 * @returns useQuery result
 */
export const useDocuments = (params = {}) => {
  return useQuery({
    queryKey:         DOCUMENTS_KEYS.list(params),
    queryFn:          () => documentService.getAll(params),
    keepPreviousData: true,        // يُبقي البيانات القديمة أثناء جلب الصفحة الجديدة
    staleTime:        1000 * 60 * 2, // 2 دقائق قبل إعادة الجلب
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. جلب تفاصيل مستند واحد
// ─────────────────────────────────────────────────────────────────────────────
/**
 * useDocumentDetail
 * @param {number|null} id - معرف المستند (null يُعطّل الـ query)
 */
export const useDocumentDetail = (id) => {
  return useQuery({
    queryKey:  DOCUMENTS_KEYS.detail(id),
    queryFn:   () => documentService.getById(id),
    enabled:   !!id,           // لا يعمل إذا كان id فارغاً أو null
    staleTime: 1000 * 60 * 5,  // 5 دقائق
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. جلب قائمة الوصول (العملاء المصرح لهم) لمستند معين
// ─────────────────────────────────────────────────────────────────────────────
/**
 * useDocumentAccessList
 * @param {number|null} id - معرف المستند (null يُعطّل الـ query)
 * FIX: كان يستدعي documentService.getAccessList (غير موجود)
 *      الصحيح: documentService.getDocumentAccessList
 */
export const useDocumentAccessList = (id) => {
  return useQuery({
    queryKey:  DOCUMENTS_KEYS.accessList(id),
    queryFn:   () => documentService.getDocumentAccessList(id), // ✅ الاسم الصحيح
    enabled:   !!id,
    staleTime: 1000 * 60 * 3,  // 3 دقائق
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. تنفيذ عملية على مستند / مستندات (Suspend, Activate, Delete)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * useDocumentAction
 * الاستخدام:
 *   const mutation = useDocumentAction()
 *   await mutation.mutateAsync({ ids: [1, 2], action: 'Suspend' })
 */
export const useDocumentAction = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, action }) =>
      documentService.executeAction(ids, action.toLowerCase()),
    onSuccess: () => {
      // إلغاء صلاحية كل مفاتيح قائمة المستندات لإعادة الجلب
      qc.invalidateQueries({ queryKey: DOCUMENTS_KEYS.all() })
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'فشل تنفيذ العملية'
      )
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. تحديث بيانات مستند
// ─────────────────────────────────────────────────────────────────────────────
/**
 * useUpdateDocument
 * الاستخدام:
 *   const mutation = useUpdateDocument()
 *   await mutation.mutateAsync({ id: 5, data: { description, expired, status } })
 */
export const useUpdateDocument = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => documentService.update(id, data),
    onSuccess: (_, { id }) => {
      // تحديث كاش التفاصيل + إعادة جلب القائمة
      qc.invalidateQueries({ queryKey: DOCUMENTS_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: DOCUMENTS_KEYS.all() })
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'فشل تحديث المستند'
      )
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. تصدير CSV
// ─────────────────────────────────────────────────────────────────────────────
/**
 * useDocumentExport
 * يُنزّل ملف CSV تلقائياً عند النجاح.
 * الاستخدام:
 *   const mutation = useDocumentExport()
 *   await mutation.mutateAsync(params)
 */
export const useDocumentExport = () => {
  return useMutation({
    mutationFn: (params) => documentService.exportCSV(params),
    onSuccess: (response) => {
      const url  = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href  = url
      link.setAttribute('download', `documents-${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'فشل تصدير الملف'
      )
    },
  })
}
