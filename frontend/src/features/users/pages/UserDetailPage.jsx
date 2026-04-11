
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
// 🚀 استيراد useQueryClient لتحديث البيانات فور الحفظ
import { useQueryClient } from "@tanstack/react-query";
import {
  useCustomerDetails,
  useUpdateCustomer,
  useCustomerBulkAction,
  useDownloadLicense,
  useUpdatePublicationAccess,
  useUpdateDocumentAccess,
} from "../hooks/useUsers";

import UserPublicationAccess from "../components/UserPublicationAccess";
import UserDocumentAccess from "../components/UserDocumentAccess";
import ConfirmAccessModal from "../components/ConfirmAccessModal";
import SuspendActivateDeviceModal from "../components/SuspendActivateDeviceModal";
import ChangeViewsModal from "../components/ChangeViewsModal";
import ChangePrintsModal from "../components/ChangePrintsModal";
import EmailDeliveryStatusModal from "../components/EmailDeliveryStatusModal";

import CustomerAccountDetails from "../components/UserDetailSections/CustomerAccountDetails";
import CustomerLicensesInfo from "../components/UserDetailSections/CustomerLicensesInfo";
import CustomerManageAccess from "../components/UserDetailSections/CustomerManageAccess";
import CustomerHistoryLogs from "../components/UserDetailSections/CustomerHistoryLogs";

import styles from "./UserDetailPage.module.css";

export default function UserDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient(); // 🚀 تعريف الـ client

  const { data: customerResponse, isLoading, isError } = useCustomerDetails(id);
  const cust = customerResponse?.data || customerResponse;

  const initialDocIds = React.useMemo(() => {
    if (cust?.documents && Array.isArray(cust.documents)) {
      return cust.documents.map((doc) => Number(doc.id));
    }
    return [];
  }, [cust]);

  const updateMutation = useUpdateCustomer();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    notes: "",
    licenses: 1,
    neverExpires: true,
    validUntil: "",
    resendLicenseEmail: false,
  });

  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isViewsModalOpen, setIsViewsModalOpen] = useState(false);
  const [isPrintsModalOpen, setIsPrintsModalOpen] = useState(false);
  const [isEmailStatusOpen, setIsEmailStatusOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [accessActionType, setAccessActionType] = useState("");

  const bulkMutation = useCustomerBulkAction();
  const downloadMutation = useDownloadLicense();
  const pubAccessMutation = useUpdatePublicationAccess();
  const docAccessMutation = useUpdateDocumentAccess();

  useEffect(() => {
    const cust = customerResponse?.data || customerResponse;
    if (cust && cust.id) {
      setForm({
        name: cust.name || "",
        email: cust.email || "",
        company: cust.company || "",
        notes: cust.note || "",
        licenses: cust.count_license || 1,
        neverExpires: Boolean(cust.never_expires),
        validUntil: cust.valid_until ? cust.valid_until.split(" ")[0] : "",
        resendLicenseEmail: false,
      });
    }
  }, [customerResponse]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    updateMutation.mutate(
      {
        id: id,
        data: {
          name: form.name,
          email: form.email,
          company: form.company,
          note: form.notes,
          never_expires: form.neverExpires,
          valid_until: form.neverExpires ? null : form.validUntil,
        },
      },
      {
        onSuccess: () => {
          toast.success("Changes saved successfully!");
          navigate("/users");
        },
        onError: (err) => {
          toast.error("Failed to save changes!");
          console.error(err);
        },
      },
    );
  };
const handlePublicationAccess = (
  selectedPubs,
  action = "unlimited",
  validFrom = "",
  validUntil = "",
) => {
  // 1. استخراج وتحويل الـ IDs
  const pubIds = selectedPubs.map((p) =>
    typeof p === "object" ? Number(p.id) : Number(p),
  );
  if (!pubIds.length) return;

  // 2. تحديد الإجراء
  const apiAction =
    action === "grant_unlimited"
      ? "unlimited"
      : action === "grant_limited"
        ? "limited"
        : action === "revoke"
          ? "revoke"
          : action;

  // 3. 🚀 إنشاء المتغير data (هنا كان الخطأ)
  const data = { action: apiAction, publication_ids: pubIds };
  if (apiAction === "limited" && validFrom) data.valid_from = validFrom;
  if (apiAction === "limited" && validUntil) data.valid_until = validUntil;

  // 4. إرسال الطلب
  pubAccessMutation.mutate(
    { customerId: id, data },
    {
      onSuccess: () => {
        toast.success("Publication access updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["customerDetails", id] });
        queryClient.invalidateQueries({ queryKey: ["customer", id] });
        setIsPubModalOpen(false);
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to update publication access!",
        );
        console.error(err);
      },
    },
  );
};

const handleDocumentAccess = (
  selectedDocs,
  action = "unlimited",
  validFrom = "",
  validUntil = "",
) => {
  // 1. استخراج وتحويل الـ IDs
  const docIds = selectedDocs.map((d) =>
    typeof d === "object" ? Number(d.id) : Number(d),
  );
  if (!docIds.length) return;

  // 2. تحديد الإجراء
  const apiAction =
    action === "grant_unlimited"
      ? "unlimited"
      : action === "grant_limited"
        ? "limited"
        : action === "revoke"
          ? "revoke"
          : action;

  // 3. 🚀 إنشاء المتغير data (هنا كان الخطأ)
  const data = { action: apiAction, document_ids: docIds };
  if (apiAction === "limited" && validFrom) data.valid_from = validFrom;
  if (apiAction === "limited" && validUntil) data.valid_until = validUntil;

  // 4. إرسال الطلب
  docAccessMutation.mutate(
    { customerId: id, data },
    {
      onSuccess: () => {
        toast.success("Document access updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["customerDetails", id] });
        queryClient.invalidateQueries({ queryKey: ["customer", id] });
        setIsDocModalOpen(false);
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to update document access!",
        );
        console.error(err);
      },
    },
  );
};
  const handleDownloadLicense = async (e) => {
    e.preventDefault();
    try {
      const blob = await downloadMutation.mutateAsync(id);
      const custType = customerResponse?.data?.type || customerResponse?.type;
      const extension = custType === "group" ? "xlsx" : "lzpk";
      const fileName = `license_${id}.${extension}`;

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("License downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download license file.");
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
        Loading customer details...
      </div>
    );
  if (isError)
    return (
      <div
        style={{ padding: 40, textAlign: "center", fontSize: 18, color: "red" }}
      >
        Error! Customer not found.
      </div>
    );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainWrapper}>
        <div className={styles.topHeader}>
          <span>
            Customer: {form.name} ({form.email})
          </span>
          <i className="bi bi-person-fill" />
        </div>

        <CustomerAccountDetails
          form={form}
          cust={cust}
          handleChange={handleChange}
        />

        <CustomerLicensesInfo
          form={form}
          handleChange={handleChange}
          handleDownloadLicense={handleDownloadLicense}
          isDownloading={downloadMutation.isPending}
          onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
        />

        <CustomerManageAccess
          cust={cust}
          onOpenPubModal={() => setIsPubModalOpen(true)}
          onOpenDocModal={() => setIsDocModalOpen(true)}
        />

        <CustomerHistoryLogs
          onOpenViewsModal={() => setIsViewsModalOpen(true)}
          onOpenPrintsModal={() => setIsPrintsModalOpen(true)}
          onOpenEmailStatusModal={() => setIsEmailStatusOpen(true)}
        />

        <hr
          style={{ margin: 0, border: "none", borderTop: "1px solid #ccc" }}
        />

        <div
          style={{
            padding: "15px 20px",
            display: "flex",
            justifyContent: "center",
            gap: 10,
            backgroundColor: "#e6e6e6",
          }}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            style={{
              backgroundColor: "#009cad",
              color: "#fff",
              border: "none",
              padding: "6px 30px",
              fontSize: 13,
              cursor: updateMutation.isPending ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: updateMutation.isPending ? 0.7 : 1,
            }}
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/users")}
            disabled={updateMutation.isPending}
            style={{
              backgroundColor: "#888",
              color: "#fff",
              border: "none",
              padding: "6px 20px",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: "bold",
              opacity: updateMutation.isPending ? 0.7 : 1,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      {isPubModalOpen&&(
        <UserPublicationAccess
          isOpen={isPubModalOpen}
          onClose={() => setIsPubModalOpen(false)}
          customerLicenseId={id}
          onSelect={(selectedData, action, fromDate, untilDate) => {
            setSelectedResource({ type: "pub", data: selectedData });
            setAccessActionType(action);
            handlePublicationAccess(selectedData, action, fromDate, untilDate);
          }}
        />
      )}
      {isDocModalOpen && (
        <UserDocumentAccess
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          initialSelectedIds={initialDocIds}
          customerLicenseId={id} // 👈 🚀 هذا هو السطر الناقص! تمرير الـ ID هنا
          onSelect={(selectedData, action, fromDate, untilDate) => {
            setSelectedResource({ type: "doc", data: selectedData });
            setAccessActionType(action);
            handleDocumentAccess(selectedData, action, fromDate, untilDate);
          }}
        />
      )}
      <ConfirmAccessModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        items={selectedResource?.data || []}
        actionType={accessActionType}
        onConfirm={() => {
          if (selectedResource?.type === "pub") {
            handlePublicationAccess(selectedResource.data, accessActionType);
          } else if (selectedResource?.type === "doc") {
            handleDocumentAccess(selectedResource.data, accessActionType);
          }
        }}
      />
      <SuspendActivateDeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />
      <ChangeViewsModal
        isOpen={isViewsModalOpen}
        onClose={() => setIsViewsModalOpen(false)}
      />
      <ChangePrintsModal
        isOpen={isPrintsModalOpen}
        onClose={() => setIsPrintsModalOpen(false)}
      />
      <EmailDeliveryStatusModal
        isOpen={isEmailStatusOpen}
        onClose={() => setIsEmailStatusOpen(false)}
      />
    </div>
  );
}