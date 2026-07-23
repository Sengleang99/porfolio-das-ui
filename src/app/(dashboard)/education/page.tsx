"use client";

import { useState } from "react";
import { Alert, Card, Button } from "@/components/ui";
import type { Education } from "@/types/education";

import { EducationTable } from "@/components/dashboard/education/EducationTable";
import {
  EducationModal,
  DeleteModal,
} from "@/components/dashboard/education/EducationModals";
import {
  SEED_DATA,
  EMPTY_FORM,
  generateId,
  type FormData,
} from "@/components/dashboard/education/constants";

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
  const [educationList, setEducationList] = useState<Education[]>(SEED_DATA);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [successMsg, setSuccessMsg] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────────────
  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

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
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy,
      startDate: item.startDate,
      endDate: item.endDate,
      grade: item.grade ?? "",
      description: item.description ?? "",
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
    if (!formData.institution.trim())
      errs.institution = "Institution is required.";
    if (!formData.degree.trim()) errs.degree = "Degree is required.";
    if (!formData.fieldOfStudy.trim())
      errs.fieldOfStudy = "Field of study is required.";
    if (!formData.startDate) errs.startDate = "Start date is required.";
    if (!formData.endDate) {
      errs.endDate = "End date or 'Currently studying' is required.";
    } else if (
      formData.endDate !== "Present" &&
      formData.startDate &&
      formData.endDate < formData.startDate
    ) {
      errs.endDate = "End date must be after start date.";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!validate()) return;

    if (modalMode === "create") {
      setEducationList((prev) => [
        {
          ...formData,
          id: generateId(),
          grade: formData.grade || undefined,
          description: formData.description || undefined,
        },
        ...prev,
      ]);
      flash("Education record created successfully.");
    } else if (modalMode === "edit" && selectedId) {
      setEducationList((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                ...formData,
                grade: formData.grade || undefined,
                description: formData.description || undefined,
              }
            : item,
        ),
      );
      flash("Education record updated successfully.");
    }

    closeModal();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!deleteTarget) return;
    setEducationList((prev) =>
      prev.filter((item) => item.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
    flash("Education record deleted.");
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

      {/* Success toast */}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {/* Empty state or Table */}
      {educationList.length === 0 ? (
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
      />

      {/* Delete confirm modal */}
      <DeleteModal
        open={deleteTarget !== null}
        title={
          deleteTarget
            ? `${deleteTarget.degree} in ${deleteTarget.fieldOfStudy} from ${deleteTarget.institution}`
            : ""
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
