import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { publicationApi } from "../services/publicationApi";
import toast from "react-hot-toast";

// ============================================================
// hooks/usePublicationHooks.js
// جميع الـ hooks الخاصة بالمنشورات (Publications)
// تشمل: جلب، إضافة، تعديل، عمليات مجمعة، مستندات، مشتركين
// ============================================================

// ─────────────────────────────────────────────
// 1. جلب قائمة المنشورات (للجدول الرئيسي)
// يقبل params للفلترة والترقيم والبحث
// keepPreviousData: يبقي البيانات القديمة أثناء تحميل الجديدة (تجنب الوميض)
// ─────────────────────────────────────────────
export const usePublications = (params) => {
  return useQuery({
    queryKey: ["publications","list", params], // يعيد الجلب تلقائياً عند تغيير params
    queryFn: () => publicationApi.getPublications(params),
    placeholderData: keepPreviousData,
  });
};

// ─────────────────────────────────────────────
// 2. جلب تفاصيل منشور واحد (لصفحة التعديل)
// enabled: !!id — لا يُشغَّل الطلب إلا إذا وُجد ID صالح
// ─────────────────────────────────────────────
export const usePublicationDetails = (id) => {
  return useQuery({
    queryKey: ["publication", id],
    queryFn: () => publicationApi.getPublicationDetails(id),
    enabled: !!id,
  });
};

// ─────────────────────────────────────────────
// 3. إضافة منشور جديد
// بعد النجاح: يُبطل cache الجدول الرئيسي لإعادة جلبه تلقائياً
// ─────────────────────────────────────────────
export const useCreatePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      toast.success("تم إنشاء المنشور بنجاح");
    },
    onError: (err) => {
      let errorMsg = "فشل إضافة المنشور";
      if (err.response?.data?.data) {
        errorMsg = Object.values(err.response.data.data).flat().join("\n");
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    },
  });
};

// ─────────────────────────────────────────────
// 4. تعديل منشور موجود
// بعد النجاح: يُبطل cache الجدول + cache تفاصيل المنشور المحدد
// variables.id — يأتي من البيانات التي أُرسلت عند استدعاء mutate()
// ─────────────────────────────────────────────
export const useUpdatePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.updatePublication,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      queryClient.invalidateQueries({
        queryKey: ["publication", variables.id],
      });
      toast.success("تم حفظ التعديلات بنجاح");
    },
    onError: (err) => {
      let errorMsg = "فشل التعديل";
      if (err.response?.data?.data) {
        errorMsg = Object.values(err.response.data.data).flat().join("\n");
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    },
  });
};

// ─────────────────────────────────────────────
// 5. عمليات مجمعة على عدة منشورات (حذف، نشر، إلغاء نشر...)
// بعد النجاح: يُبطل cache الجدول الرئيسي لتحديث البيانات
// ─────────────────────────────────────────────
export const usePublicationBulkAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.bulkAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      toast.success("تم تنفيذ الإجراء المجمع بنجاح");
    },
    onError: (err) => {
      let errorMsg = "فشل تنفيذ الإجراء";
      if (err.response?.data?.data) {
        errorMsg = Object.values(err.response.data.data).flat().join("\n");
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    },
  });
};

// ============================================================
// المستندات المرفقة بالمنشور
// ============================================================

// جلب قائمة المستندات التابعة لمنشور معين
export const usePublicationDocuments = (id) => {
  return useQuery({
    queryKey: ["publication-documents", id],
    queryFn: () => publicationApi.getPublicationDocuments(id),
    enabled: !!id, // لا يعمل إلا إذا وُجد ID
  });
};

// إرفاق مستند أو أكثر بمنشور
// بعد النجاح: يُحدِّث قائمة المستندات للمنشور المحدد فقط
export const useAttachDocuments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.attachDocuments,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["publication-documents", variables.id],
      });
    },
  });
};

// فصل (إزالة) مستند من منشور
// بعد النجاح: يُحدِّث قائمة المستندات للمنشور المحدد فقط
export const useDetachDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.detachDocument,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["publication-documents", variables.id],
      });
    },
  });
};

// ============================================================
// المشتركون (Subscribers) التابعون للمنشور
// ============================================================

// جلب قائمة المشتركين لمنشور معين
// enabled: !!id — لا يعمل إلا إذا وُجد ID صالح
export const usePublicationSubscribers = (id) => {
  return useQuery({
    queryKey: ["publication-subscribers", id],
    queryFn: () => publicationApi.getPublicationSubscribers(id),
  });
};

// إلغاء وصول مشترك أو المشتركين المحددين من المنشور
// بعد النجاح: يُحدِّث قائمة المشتركين
export const useRevokeSubscriberAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.revokeSubscriberAccess,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["publication-subscribers", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["publications"] }); // ربما يلزم لتحديث العداد في الجدول
    },
  });
};

export const useSelectPublications = (params = { limit: 10 }) => {
  return useQuery({
    queryKey: ["publications", "select",params],
    queryFn: async () => {
      const result = await publicationApi.getPublications(params);

      // تنظيف البيانات بناءً على الـ JSON المتوقع
      const items = Array.isArray(result?.items)
        ? result.items
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];
      return items;
    },
    staleTime: 5 * 60 * 1000, // المنشورات لا تتغير كثيراً، نحتفظ بها 5 دقائق
  });
};