"use client";

import { useState, useEffect } from "react";
import { Alert, Card, Button, Spinner } from "@/components/ui";
import type { Experience } from "@/types/experience";

import { ExperienceTable } from "@/components/dashboard/experience/ExperienceTable";
import {
  ExperienceModal,
  DeleteModal,
} from "@/components/dashboard/experience/ExperienceModals";
import {
  EMPTY_FORM,
  generateId,
  type FormData,
} from "@/components/dashboard/experience/constants";
import { validateExperienceForm } from "@/components/dashboard/experience/validation";
import { getExperiences, createExperience, deleteExperience, updateExperience } from "./actions";
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
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
        const data = await getExperiences();
        setExperienceList(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load experiences");
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
  const openEdit = (item: Experience) => {
    setSelectedId(item._id);
    setFormData({
      company: item.company,
      position: item.position,
      status: item.status,
      from_year: item.from_year,
      to_year: item.to_year,
      descr: item.descr,
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
    const errs = validateExperienceForm(formData);
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    if (modalMode === "create") {
      const result = await createExperience(formData);
      if (result.success) {
        if (result.data) {
          setExperienceList((prev) => [result.data!, ...prev]);
        } else {
          const freshData = await getExperiences();
          setExperienceList(freshData);
        }
        flashSuccess("Experience record created successfully.");
      } else {
        flashError(result.error || "Failed to create experience record.");
      }
      closeModal();
      setIsSaving(false);
    } else if (modalMode === "edit" && selectedId) {
      const result = await updateExperience(selectedId, formData);
      if (result.success) {
        if (result.data) {
          setExperienceList((prev) =>
            prev.map((item) => (item._id === selectedId ? result.data! : item)),
          );
        } else {
          const freshData = await getExperiences();
          setExperienceList(freshData);
        }
        flashSuccess("Experience record updated successfully.");
      } else {
        flashError(result.error || "Failed to update experience record.");
      }
      closeModal();
      setIsSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;

    const result = await deleteExperience(deleteTarget._id);
    if (result.success) {
      setExperienceList((prev) =>
        prev.filter((item) => item._id !== deleteTarget._id),
      );
      flashSuccess("Experience record deleted successfully.");
    } else {
      flashError(result.error || "Failed to delete experience record.");
    }
    setDeleteTarget(null);
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

      {/* Success / Error alerts */}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

      {/* Loading state, Error state, Empty state or Table */}
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-slate-500 mt-2">Loading experiences...</p>
          </div>
        </Card>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : experienceList.length === 0 ? (
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
        isSaving={isSaving}
      />

      {/* Delete confirm modal */}
      <DeleteModal
        open={deleteTarget !== null}
        title={
          deleteTarget ? `${deleteTarget.position} at ${deleteTarget.company}` : ""
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
