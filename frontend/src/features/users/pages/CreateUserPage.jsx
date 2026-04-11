/**
 * ملف: CreateUserPage.jsx
 * الوظيفة: إضافة عميل جديد (Add New Customer)
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userApi";

// 1. استيراد النوافذ المنبثقة
import SelectPublicationModal from "../../publications/components/SelectPublicationModal";
import SelectDocumentModal from "../../documents/components/SelectDocumentModal";

// 2. استيراد المكونات الفرعية الثلاثة التي أرسلتها لي
import CreateUserMainInfo from "../components/CreateUserSections/CreateUserMainInfo";
import CreateUserManageAccess from "../components/CreateUserSections/CreateUserManageAccess";
import CreateUserLicenseInfo from "../components/CreateUserSections/CreateUserLicenseInfo";

// 3. استيراد ملف التنسيقات المعزول
import styles from "./CreateUserPage.module.css";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // حالة (State) لتهيئة وتخزين مدخلات نموذج إضافة العميل الجديد (نفس المنطق 100%)
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    type: "individual",
    count_license: 1,
    startDate: new Date().toISOString().split("T")[0],
    validUntil: "",
    neverExpires: true,
    notes: "",
    emailLicense: true,
  });

  // حالات التحكم بالنوافذ والمصفوفات لتخزين الاختيارات
  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // خطاف (Hook) للاتصال بالخادم وإرسال طلب الإضافة
  const mutation = useMutation({
    mutationFn: userApi.createCustomer,
    onSuccess: () => {
      toast.success("تمت إضافة العميل بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/users");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء إضافة العميل، يرجى المحاولة مرة أخرى.");
      console.error(error);
    },
  });

  const submit = (e) => {
    e.preventDefault();
    const adminUser = JSON.parse(sessionStorage.getItem("admin_user") || "{}");
    const publisherId = adminUser.id || 1;

    // ربط البيانات كما يتوقعها الباك إند (نفس أسماء الحقول التي اعتمدتها)
    const dataToSend = {
      publisher_id: publisherId,
      name: form.name,
      email: form.email,
      company: form.company,
      note: form.notes,
      type: form.type,
      valid_from: form.startDate,
      never_expires: form.neverExpires,
      valid_until: form.neverExpires ? null : form.validUntil,
      send_via_email: form.emailLicense,
      // إرسال مصفوفات المعرفات (IDs) للمنشورات والمستندات المختارة
      publication_ids: selectedPublications.map((pub) => pub.id),
      document_ids: selectedDocuments.map((doc) => doc.id),
    };

    if (form.type === "group") {
      dataToSend.count_license = parseInt(form.count_license, 10) || 1;
    }

    mutation.mutate(dataToSend);
  };

  // معالجة تغييرات نصوص صناديق الإدخال وتحديث الحالة
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className={styles.pageContainer}>
      {/* مساحة علوية فارغة */}
      <div className={styles.spacer} />

      {/* الحاوية الرئيسية للنموذج */}
      <div className={styles.mainWrapper}>
        {/* شريط العنوان العلوي */}
        <div className={styles.topHeader}>
          <div className={styles.headerTitle}>
            <span>إضافة عميل جديد (New customer)</span>
          </div>
          <i className="bi bi-person-plus-fill" />
        </div>

        {/* بداية النموذج الذي يتصل بدالة الحفظ عند الإرسال */}
        <form onSubmit={submit}>
          {/* 1. قسم المعلومات الأساسية */}
          <CreateUserMainInfo form={form} handleChange={handleChange} />

          {/* 2. قسم إدارة الوصول (مع تمرير المصفوفات لكي يظهر الـ Badge المطور) */}
          <CreateUserManageAccess
            selectedPubs={selectedPublications}
            selectedDocs={selectedDocuments}
            onOpenPubModal={() => setIsPubModalOpen(true)}
            onOpenDocModal={() => setIsDocModalOpen(true)}
          />

          {/* 3. قسم خيارات إرسال التراخيص */}
          <CreateUserLicenseInfo form={form} handleChange={handleChange} />

          <hr className={styles.divider} />

          {/* شريط الإجراءات السفلي وأزرار الإرسال */}
          <div className={styles.footerActions}>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={styles.submitButton}
              style={{
                cursor: mutation.isPending ? "not-allowed" : "pointer",
                opacity: mutation.isPending ? 0.7 : 1,
              }}
            >
              {mutation.isPending ? "جاري الإضافة..." : "إضافة (Add)"}
            </button>
          </div>
        </form>
      </div>

      {/* النوافذ المنبثقة مع تمرير المصفوفات لكي تتحدد مسبقاً (الميزة الذكية التي أضفتها) */}
      <SelectPublicationModal
        isOpen={isPubModalOpen}
        onClose={() => setIsPubModalOpen(false)}
        selectedItems={selectedPublications}
        onSelect={(selectedArray) => {
          setSelectedPublications(selectedArray);
          setIsPubModalOpen(false);
        }}
      />

      <SelectDocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        selectedItems={selectedDocuments}
        onSelect={(selectedArray) => {
          setSelectedDocuments(selectedArray);
          setIsDocModalOpen(false);
        }}
      />
    </div>
  );
};

export default CreateUserPage;
