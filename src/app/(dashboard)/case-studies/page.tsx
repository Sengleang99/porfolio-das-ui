"use client";

import { useState, useEffect } from "react";
import { Alert, Card, Button, Spinner } from "@/components/ui";
import type { CaseStudy } from "@/types/caseStudy";

import { CaseStudyHeader } from "@/components/dashboard/case-studies/CaseStudyHeader";
import { CaseStudyCard } from "@/components/dashboard/case-studies/CaseStudyCard";
import {
  CaseStudyModal,
  DeleteModal,
} from "@/components/dashboard/case-studies/CaseStudyModals";
import {
  EMPTY_FORM,
  type FormData,
} from "@/components/dashboard/case-studies/constants";
import {
  getCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from "./action";

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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CaseStudiesPage() {
  const [projects, setProjects] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
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
        const data = await getCaseStudies();
        setProjects(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load case studies");
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
  const openEdit = (project: CaseStudy) => {
    setSelectedId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      tag: project.tag,
      tech: project.tech ? project.tech.join(", ") : "",
      demoUrl: project.demoUrl ?? "",
      githubUrl: project.githubUrl ?? "",
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
    if (!formData.title.trim()) errs.title = "Title is required.";
    if (!formData.tag.trim()) errs.tag = "Tag / Category is required.";
    if (!formData.description.trim())
      errs.description = "Description is required.";
    if (!formData.tech.trim()) errs.tech = "Tech stack is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    if (modalMode === "create") {
      const result = await createCaseStudy(formData);
      if (result.success) {
        if (result.data) {
          setProjects((prev) => [result.data!, ...prev]);
        } else {
          const freshData = await getCaseStudies();
          setProjects(freshData);
        }
        flashSuccess("Case study created successfully.");
      } else {
        flashError(result.error || "Failed to create case study.");
      }
      closeModal();
      setIsSaving(false);
    } else if (modalMode === "edit" && selectedId) {
      const result = await updateCaseStudy(selectedId, formData);
      if (result.success) {
        if (result.data) {
          setProjects((prev) =>
            prev.map((p) => (p.id === selectedId ? result.data! : p)),
          );
        } else {
          const freshData = await getCaseStudies();
          setProjects(freshData);
        }
        flashSuccess("Case study updated successfully.");
      } else {
        flashError(result.error || "Failed to update case study.");
      }
      closeModal();
      setIsSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;

    const result = await deleteCaseStudy(deleteTarget.id);
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      flashSuccess("Case study deleted successfully.");
    } else {
      flashError(result.error || "Failed to delete case study.");
    }
    setDeleteTarget(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Case Studies</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="primary" onClick={openCreate} leftIcon={<IconPlus />}>
          New Project
        </Button>
      </div>

      {/* Success / Error alerts */}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

      {/* Loading state, Error state, Empty state or Cards */}
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-slate-500 mt-2">
              Loading case studies...
            </p>
          </div>
        </Card>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : projects.length === 0 ? (
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
          <p className="text-sm font-medium text-slate-700">No projects yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;New Project&quot; to add your first case study
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <CaseStudyCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <CaseStudyModal
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
        title={deleteTarget?.title ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
