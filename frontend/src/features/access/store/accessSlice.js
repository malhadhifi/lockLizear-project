// ===== شريحة Redux لبيانات Access Control =====
import { createSlice } from "@reduxjs/toolkit";

const accessSlice = createSlice({
  name: "access", // اسم الشريحة في Redux

  // ===== الحالة الابتدائية =====
  initialState: {
    // المستخدم المختار حالياً (من القائمة اليمنى)
    selectedUserId: null,
    selectedUser: null, // بياناته الكاملة

    // ===== تبويب الخصائص =====
    properties: {
      status: "active", // الحالة: active/suspend/expired
      maxDevices: 3, // أجهزة قصوى
      expiryDate: "", // تاريخ الانتهاء
      offlineAccess: true, // السماح بالأوفلاين؟
      offlineCheckinDays: 30, // التحقق كل كم يوم؟
      multipleSessions: false, // جلسات متعددة؟
      ipRestrictions: [], // قائمة IP المسموحة
      countryRestrictions: [], // قائمة الدول الممنوعة
    },

    // ===== تبويب الملفات =====
    documentAccess: [],

    // ===== تبويب المنشورات =====
    publicationAccess: [],

    loading: false, // حالة التحميل
  },

  // ===== الإجراءات (Actions) =====
  reducers: {
    // تحديد مستخدم جديد من القائمة
    setSelectedUser: (state, action) => {
      state.selectedUserId = action.payload.id;
      state.selectedUser = action.payload;
    },

    // تحديث خصائص التبويب الأول
    updateProperties: (state, action) => {
      state.properties = { ...state.properties, ...action.payload };
    },

    // تحديث صلاحيات الملفات
    updateDocumentAccess: (state, action) => {
      state.documentAccess = action.payload;
    },

    // تحديث صلاحيات المنشورات
    updatePublicationAccess: (state, action) => {
      state.publicationAccess = action.payload;
    },
  },
});

// ===== تصدير الإجراءات للاستخدام في المكونات =====
export const {
  setSelectedUser,
  updateProperties,
  updateDocumentAccess,
  updatePublicationAccess,
} = accessSlice.actions;

// ===== تصدير الـ Reducer للـ Store الرئيسي =====
export default accessSlice.reducer;
