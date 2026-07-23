import { Button, Modal } from "@/components/ui";
import { CaseStudyForm } from "./CaseStudyForm";
import type { FormData } from "./constants";

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
interface CaseStudyModalProps {
  mode: "create" | "edit" | null;
  formData: FormData;
  formErrors: Partial<Record<keyof FormData, string>>;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: keyof FormData, value: string) => void;
}

export function CaseStudyModal({
  mode,
  formData,
  formErrors,
  onClose,
  onSave,
  onFieldChange,
}: CaseStudyModalProps) {
  return (
    <Modal
      open={mode !== null}
      onClose={onClose}
      title={mode === "create" ? "New Project" : "Edit Project"}
      description={
        mode === "create"
          ? "Add a new case study to your portfolio"
          : "Update the project details"
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave}>
            {mode === "create" ? "Create Project" : "Save Changes"}
          </Button>
        </>
      }
    >
      <CaseStudyForm
        data={formData}
        onChange={onFieldChange}
        errors={formErrors}
      />
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
interface DeleteModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({
  open,
  title,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Case Study"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-slate-800">
          &quot;{title}&quot;
        </span>
        ? This action cannot be undone.
      </p>
    </Modal>
  );
}
