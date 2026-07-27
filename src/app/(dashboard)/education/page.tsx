"use client";

import { useState, useEffect } from "react";
import { Alert, Card, Button, Spinner } from "@/components/ui";
import type { Education } from "@/types/education";

import { EducationTable } from "@/components/dashboard/education/EducationTable";
import {
  EducationModal,
  DeleteModal,
} from "@/components/dashboard/education/EducationModals";
import {
  EMPTY_FORM,
  type FormData,
} from "@/components/dashboard/education/constants";
import {
  getEducations,
  createEducation,
  deleteEducation,
  updateEducation,
} from "./actions";

const IconPlus = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function EducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const flashSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const flashError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEducations();
        setEducationList(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load education history";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setModalMode("create");
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = (item: Education) => {
    setSelectedId(item.id);
    setFormData({
      university: item.university,
      degree: item.degree,
      major: item.major,
      start_year: item.start_year,
      end_year: item.end_year,
      descr: item.descr ?? "",
    });
    setFormErrors({});
    setModalMode("edit");
  };

  // ── Close modal ───────────────────────────────────────────────────────────
  const closeModal = () => {
    setModalMode(null);
    setSelectedId(null);
  };

  // ── Field change ──────────────────────────────────────────────────────────
  const handleField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field])
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!formData.university.trim())
      errs.university = "Institution is required.";
    if (!formData.degree.trim()) errs.degree = "Degree is required.";
    if (!formData.major.trim()) errs.major = "Field of study is required.";
    if (!formData.start_year) errs.start_year = "Start date is required.";
    if (!formData.end_year) {
      errs.end_year = "End date or 'Currently studying' is required.";
    } else if (
      formData.end_year !== "Present" &&
      formData.start_year &&
      formData.end_year < formData.start_year
    ) {
      errs.end_year = "End date must be after start date.";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    if (modalMode === "create") {
      const result = await createEducation(formData);
      if (result.success) {
        if (result.data) {
          setEducationList((prev) => [result.data!, ...prev]);
        } else {
          const freshData = await getEducations();
          setEducationList(freshData);
        }
        flashSuccess("Education record created successfully.");
      } else {
        flashError(result.error || "Failed to create education record.");
      }
      closeModal();
      setIsSaving(false);
    } else if (modalMode === "edit" && selectedId) {
      const result = await updateEducation(selectedId, formData);
      if (result.success) {
        if (result.data) {
          setEducationList((prev) =>
            prev.map((item) => (item.id === selectedId ? result.data! : item)),
          );
        } else {
          const freshData = await getEducations();
          setEducationList(freshData);
        }
        flashSuccess("Education record updated successfully.");
      } else {
        flashError(result.error || "Failed to update education record.");
      }
      closeModal();
      setIsSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;

    const result = await deleteEducation(deleteTarget.id);
    if (result.success) {
      setEducationList((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id),
      );
      flashSuccess("Education record deleted successfully.");
    } else {
      flashError(result.error || "Failed to delete education record.");
    }
    setDeleteTarget(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Education</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {educationList.length} qualification
            {educationList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="primary" onClick={openCreate} leftIcon={<IconPlus />}>
          New Education
        </Button>
      </div>

      {/* Success / Error alerts */}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

      {/* Loading state, Error state, Empty state or Table */}
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-slate-500 mt-2">
              Loading education history...
            </p>
          </div>
        </Card>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : educationList.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-slate-400"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700">
            No education history yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;New Education&quot; to add your first qualification
          </p>
        </Card>
      ) : (
        <EducationTable
          items={educationList}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Create / Edit modal */}
      <EducationModal
        mode={modalMode}
        formData={formData}
        formErrors={formErrors}
        onClose={closeModal}
        onSave={handleSave}
        onFieldChange={handleField}
        isSaving={isSaving}
      />

      {/* Delete confirm modal */}
      <DeleteModal
        open={deleteTarget !== null}
        title={
          deleteTarget
            ? `${deleteTarget.degree} in ${deleteTarget.major} from ${deleteTarget.university}`
            : ""
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
