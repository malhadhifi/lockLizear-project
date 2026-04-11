import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { userApi } from "../services/userApi";

export const USER_KEYS = {
  all: (params) => ["customers", "list", params],
  // 🚀 إضافة مفتاح جديد لمستندات العميل
  customerDocuments: (id, params) => ["customer", id, "documents", params],
};

// ... (باقي الخطافات الخاصة بك كما هي) ...

// 🚀 خطاف جديد لجلب مستندات عميل محدد مع الفلترة والتقسيم
export const useCustomerDocuments = (customerLicenseId, params = {}) => {
  return useQuery({
    queryKey: USER_KEYS.customerDocuments(customerLicenseId, params),
    queryFn: () => userApi.getCustomerDocuments(customerLicenseId, params),
    placeholderData: keepPreviousData,
    enabled: !!customerLicenseId, // لن يتم تفعيل الطلب إلا إذا كان الـ ID موجوداً
  });
};
export const useCustomerPublications = (customerLicenseId, params = {}) => {
  return useQuery({
    queryKey: USER_KEYS.customerDocuments(customerLicenseId, params),
    queryFn: () => userApi.getCustomerPublications(customerLicenseId, params),
    placeholderData: keepPreviousData,
    enabled: !!customerLicenseId, // لن يتم تفعيل الطلب إلا إذا كان الـ ID موجوداً
  });
};

// خطاف جلب قائمة العملاء وعرضهم في الجدول
export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: USER_KEYS.all(params), // اسم الكاش
    queryFn: () => userApi.fetchCustomers(params), // الدالة التي ستتصل بالباك إند
    placeholderData: keepPreviousData,
  });
};

// خطاف العمليات الجماعية للعملاء
export const useCustomerBulkAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.bulkAction,
    onSuccess: () => {
      // إجبار الجدول على إعادة تعبئة نفسه بالبيانات الجديدة بعد التحديث
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["publication-subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["document-access-list"] });
    },
  });
};

// خطاف جلب تفاصيل عميل محدد
export const useCustomerDetails = (id) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => userApi.getCustomerDetails(id),
    enabled: !!id, // جلب البيانات فقط إذا كان المعرف موجوداً
  });
};

// خطاف حفظ التعديلات على بيانات العميل
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateCustomer,
    onSuccess: (data, variables) => {
      // تحديث الجدول وقائمة تفاصيل هذا العميل لتعكس البيانات الحقيقية
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", variables.id] });
    },
  });
};

// خطاف تحميل الرخصة
export const useDownloadLicense = () => {
  return useMutation({
    mutationFn: userApi.downloadLicense,
  });
};

// خطاف تعديل صلاحيات وصول المنشورات لعميل محدد
export const useUpdatePublicationAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updatePublicationAccess,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId],
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["publication-subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["all-customers-for-pub"] });
    },
  });
};

// خطاف تعديل صلاحيات وصول المستندات لعميل محدد
export const useUpdateDocumentAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateDocumentAccess,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId],
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
