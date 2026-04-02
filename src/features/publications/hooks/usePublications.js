import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicationApi } from '../services/publicationApi';
import toast from 'react-hot-toast';

// 1. جلب المنشورات (الجدول الرئيسي)
export const usePublications = (params) => {
  return useQuery({
    queryKey: ['publications', params],
    queryFn: () => publicationApi.getPublications(params),
    keepPreviousData: true,
  });
};

// 2. جلب وتعبئة تفاصيل المنشور لصفحة التعديل
export const usePublicationDetails = (id) => {
  return useQuery({
    queryKey: ['publication', id],
    queryFn: () => publicationApi.getPublicationDetails(id),
    enabled: !!id, // يعمل فقط لو وجد الـ ID 
  });
};

// 3. دالة إضافة منشور
export const useCreatePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.createPublication,
    onSuccess: () => {
      // تحديث الجدول الرئيسي فور الإضافة
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    }
  });
};

// 4. دالة تعديل منشور
export const useUpdatePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.updatePublication,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      queryClient.invalidateQueries({ queryKey: ['publication', variables.id] });
    }
  });
};

// 5. العمليات المجمعة على الجدول (متعدد)
export const usePublicationBulkAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.bulkAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    }
  });
};

// === توابع المستندات المرفقة بالمنشور ===
export const usePublicationDocuments = (id) => {
  return useQuery({
    queryKey: ['publication-documents', id],
    queryFn: () => publicationApi.getPublicationDocuments(id),
    enabled: !!id,
  });
};

export const useAttachDocuments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.attachDocuments,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['publication-documents', variables.id] });
    }
  });
};

export const useDetachDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.detachDocument,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['publication-documents', variables.id] });
    }
  });
};

// === توابع العملاء التابعين للمنشور ===
export const usePublicationSubscribers = (id) => {
  return useQuery({
    queryKey: ['publication-subscribers', id],
    queryFn: () => publicationApi.getPublicationSubscribers(id),
    enabled: !!id,
  });
};

export const useRevokeSubscriberAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationApi.revokeSubscriberAccess,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['publication-subscribers', variables.id] });
    }
  });
};
