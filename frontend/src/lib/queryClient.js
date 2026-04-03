/**
 * ملف: queryClient.js
 * المسار: frontend/src/lib/queryClient.js
 *
 * إعداد QueryClient المركزي لـ React Query (TanStack Query v5).
 *
 * كيفية الاستخدام في main.jsx أو App.jsx:
 *
 *   import { QueryClientProvider } from '@tanstack/react-query'
 *   import { queryClient } from './lib/queryClient'
 *
 *   root.render(
 *     <QueryClientProvider client={queryClient}>
 *       <App />
 *     </QueryClientProvider>
 *   )
 */

import { QueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ── مدة صلاحية الكاش: 5 دقائق
      staleTime: 1000 * 60 * 5,

      // ── الاحتفاظ بالبيانات 10 دقائق بعد إلغاء المشتركين
      gcTime: 1000 * 60 * 10,

      // ── لا تُعد الجلب عند العودة لنافذة المتصفح (يُقلل الطلبات)
      refetchOnWindowFocus: false,

      // ── إعادة المحاولة مرة واحدة فقط عند الفشل
      retry: 1,

      // ── الاحتفاظ بالبيانات القديمة أثناء جلب البيانات الجديدة
      keepPreviousData: true,

      // ── معالج الأخطاء المركزي
      onError: (err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ غير متوقع'
        toast.error(message)
      },
    },
    mutations: {
      // ── لا تُعيد المحاولة تلقائياً للـ mutations
      retry: 0,

      // ── معالج الأخطاء المركزي للـ mutations
      onError: (err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'فشلت العملية. يرجى المحاولة مرة أخرى.'
        toast.error(message)
      },
    },
  },
})
