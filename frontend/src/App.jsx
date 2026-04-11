import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import PrivateRoute from "./routes/PrivateRoute";

// 🚀 إضافات السيرفر: صفحات الهبوط وتسجيل الناشرين
import LandingPage from "./features/landing/pages/LandingPage";
import RegisterPublisherPage from "./features/landing/pages/RegisterPublisherPage";

import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";

// 🚀 إضافاتك المحلية: قوالب الأغلفة (Layouts) للأقسام
import UsersLayout from "./features/users/components/UsersLayout";
import DocumentsLayout from "./features/documents/components/DocumentsLayout";
import PublicationsLayout from "./features/publications/components/PublicationsLayout";

import UsersListPage from "./features/users/pages/UsersListPage";
import UserDetailPage from "./features/users/pages/UserDetailPage";
import CreateUserPage from "./features/users/pages/CreateUserPage";
import DocumentsListPage from "./features/documents/pages/DocumentsListPage";
import DocumentDetailPage from "./features/documents/pages/DocumentDetailPage";
import PublicationsListPage from "./features/publications/pages/PublicationsListPage";
import CreatePublicationPage from "./features/publications/pages/CreatePublicationPage";
import EditPublicationPage from "./features/publications/pages/EditPublicationPage";

import AccessControlPage from "./features/access/pages/AccessControlPage";
import EmailManagementPage from "./features/emails/pages/EmailManagementPage";
import SubAdminsListPage from "./features/sub_admins/pages/SubAdminsListPage";
import ReportsPage from "./features/reports/pages/ReportsPage";
import SettingsPage from "./features/settings/pages/SettingsPage";

function App() {
  return (
    <Routes>
      {/* ✅ الصفحة الرئيسية العامة — Landing (من السيرفر) */}
      <Route path="/" element={<LandingPage />} />

      {/* ✅ صفحات Auth — تسجيل الدخول + إنشاء الحساب */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/publisher/register" element={<RegisterPublisherPage />} />
      </Route>

      {/* ✅ الصفحات المحمية — تحتاج تسجيل دخول */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* =========================================
            🚀 تطبيق السحر (الغلاف المتداخل) الخاص بك
        ========================================= */}

        {/* 📦 غلاف قسم العملاء */}
        <Route path="/users" element={<UsersLayout />}>
          <Route index element={<UsersListPage />} />
          <Route path="create" element={<CreateUserPage />} />
          <Route path=":id" element={<UserDetailPage />} />
        </Route>

        {/* 📦 غلاف قسم المستندات */}
        <Route path="/documents" element={<DocumentsLayout />}>
          <Route index element={<DocumentsListPage />} />
          <Route path=":id" element={<DocumentDetailPage />} />
        </Route>

        {/* 📦 غلاف قسم المنشورات */}
        <Route path="/publications" element={<PublicationsLayout />}>
          <Route index element={<PublicationsListPage />} />
          <Route path="create" element={<CreatePublicationPage />} />
          <Route path=":id/edit" element={<EditPublicationPage />} />
        </Route>

        {/* =========================================
            الصفحات المفردة (تبقى كما هي بدون غلاف خاص)
        ========================================= */}
        <Route path="/access" element={<AccessControlPage />} />
        <Route path="/emails" element={<EmailManagementPage />} />
        <Route path="/sub-admins" element={<SubAdminsListPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* التحويل الافتراضي لأي مسار خاطئ داخل اللوحة */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
