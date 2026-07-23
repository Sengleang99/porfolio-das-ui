"use client";

import { useState } from "react";
import { Alert, Card } from "@/components/ui";
import type { CaseStudy } from "@/types/caseStudy";

import { CaseStudyHeader } from "@/components/dashboard/case-studies/CaseStudyHeader";
import { CaseStudyCard } from "@/components/dashboard/case-studies/CaseStudyCard";
import {
  CaseStudyModal,
  DeleteModal,
} from "@/components/dashboard/case-studies/CaseStudyModals";
import {
  SEED_DATA,
  EMPTY_FORM,
  generateId,
  type FormData,
} from "@/components/dashboard/case-studies/constants";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CaseStudiesPage() {
  const [projects, setProjects] = useState<CaseStudy[]>(SEED_DATA);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
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
  const openEdit = (project: CaseStudy) => {
    setSelectedId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      liveUrl: project.liveUrl ?? "",
      repoUrl: project.repoUrl ?? "",
      status: project.status,
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
    if (!formData.description.trim())
      errs.description = "Description is required.";
    if (!formData.techStack.trim()) errs.techStack = "Tech stack is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!validate()) return;

    if (modalMode === "create") {
      setProjects((prev) => [
        {
          ...formData,
          id: generateId(),
          liveUrl: formData.liveUrl || undefined,
          repoUrl: formData.repoUrl || undefined,
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
      flash("Project created successfully.");
    } else if (modalMode === "edit" && selectedId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedId
            ? {
                ...p,
                ...formData,
                liveUrl: formData.liveUrl || undefined,
                repoUrl: formData.repoUrl || undefined,
              }
            : p,
        ),
      );
      flash("Project updated successfully.");
    }

    closeModal();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!deleteTarget) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    flash("Project deleted.");
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <CaseStudyHeader count={projects.length} onCreateClick={openCreate} />

      {/* Success toast */}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {/* Empty state */}
      {projects.length === 0 ? (
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
