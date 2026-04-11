/**
 * ملف: useDebounce.js
 * المسار: frontend/src/hooks/useDebounce.js
 *
 * Hook عام لتأخير تحديث قيمة بعد فترة انتظار.
 * يُستخدم في صندوق البحث لمنع طلبات API متكررة أثناء الكتابة.
 *
 * مثال الاستخدام:
 *   const debouncedSearch = useDebounce(searchInput, 300)
 *   // debouncedSearch يتحدث فقط بعد 300ms من آخر تغيير
 */

import { useState, useEffect } from 'react'

/**
 * @param {any}    value - القيمة المراد تأخيرها
 * @param {number} delay - مدة التأخير بالميلي ثانية (افتراضي: 300)
 * @returns {any} القيمة المُؤجَّلة
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // تنظيف: إلغاء الـ timer إذا تغيّرت القيمة قبل انتهاء المدة
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
