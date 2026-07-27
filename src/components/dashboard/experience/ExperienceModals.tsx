import { Button, Modal } from "@/components/ui";
import { ExperienceForm } from "./ExperienceForm";
import type { FormData } from "./constants";

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
interface ExperienceModalProps {
  mode: "create" | "edit" | null;
  formData: FormData;
  formErrors: Partial<Record<keyof FormData, string>>;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: keyof FormData, value: string) => void;
  isSaving?: boolean;
}

export function ExperienceModal({
  mode,
  formData,
  formErrors,
  onClose,
  onSave,
  onFieldChange,
  isSaving = false,
}: ExperienceModalProps) {
  return (
    <Modal
      open={mode !== null}
      onClose={onClose}
      title={mode === "create" ? "New Experience" : "Edit Experience"}
      description={
        mode === "create"
          ? "Add a new work experience record to your portfolio"
          : "Update the work experience details"
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave} loading={isSaving}>
            {mode === "create" ? "Create Record" : "Save Changes"}
          </Button>
        </>
      }
    >
      <ExperienceForm
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
      title="Delete Experience Record"
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
        Are you sure you want to delete the experience record for{" "}
        <span className="font-semibold text-slate-800">
          &quot;{title}&quot;
        </span>
        ? This action cannot be undone.
      </p>
    </Modal>
  );
}
