"use client";

import { useState } from "react";
import { Alert, Card, Button } from "@/components/ui";
import type { Experience } from "@/types/experience";

import { ExperienceTable } from "@/components/dashboard/experience/ExperienceTable";
import {
  ExperienceModal,
  DeleteModal,
} from "@/components/dashboard/experience/ExperienceModals";
import {
  SEED_DATA,
  EMPTY_FORM,
  generateId,
  type FormData,
} from "@/components/dashboard/experience/constants";

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

export default function ExperiencesPage() {
  const [experienceList, setExperienceList] = useState<Experience[]>(SEED_DATA);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
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
  const openEdit = (item: Experience) => {
    setSelectedId(item.id);
    setFormData({
      company: item.company,
      role: item.role,
      employmentType: item.employmentType,
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
      description: item.description,
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
    if (!formData.company.trim()) errs.company = "Company is required.";
    if (!formData.role.trim()) errs.role = "Role / Title is required.";
    if (!formData.location.trim()) errs.location = "Location is required.";
    if (!formData.startDate) errs.startDate = "Start date is required.";
    if (!formData.endDate) {
      errs.endDate = "End date or 'Currently work here' is required.";
    } else if (
      formData.endDate !== "Present" &&
      formData.startDate &&
      formData.endDate < formData.startDate
    ) {
      errs.endDate = "End date must be after start date.";
    }
    if (!formData.description.trim())
      errs.description = "Description is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!validate()) return;

    if (modalMode === "create") {
      setExperienceList((prev) => [
        {
          ...formData,
          id: generateId(),
        },
        ...prev,
      ]);
      flash("Experience record created successfully.");
    } else if (modalMode === "edit" && selectedId) {
      setExperienceList((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                ...formData,
              }
            : item,
        ),
      );
      flash("Experience record updated successfully.");
    }

    closeModal();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!deleteTarget) return;
    setExperienceList((prev) =>
      prev.filter((item) => item.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
    flash("Experience record deleted.");
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Experience</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {experienceList.length} role{experienceList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="primary" onClick={openCreate} leftIcon={<IconPlus />}>
          New Experience
        </Button>
      </div>

      {/* Success toast */}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {/* Empty state or Table */}
      {experienceList.length === 0 ? (
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700">
            No experience history yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;New Experience&quot; to add your first role
          </p>
        </Card>
      ) : (
        <ExperienceTable
          items={experienceList}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Create / Edit modal */}
      <ExperienceModal
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
          deleteTarget ? `${deleteTarget.role} at ${deleteTarget.company}` : ""
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
