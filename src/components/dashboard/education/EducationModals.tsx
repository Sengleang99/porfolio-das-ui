import { Button, Modal } from "@/components/ui";
import { EducationForm } from "./EducationForm";
import type { FormData } from "./constants";

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
interface EducationModalProps {
  mode: "create" | "edit" | null;
  formData: FormData;
  formErrors: Partial<Record<keyof FormData, string>>;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: keyof FormData, value: string) => void;
}

export function EducationModal({
  mode,
  formData,
  formErrors,
  onClose,
  onSave,
  onFieldChange,
}: EducationModalProps) {
  return (
    <Modal
      open={mode !== null}
      onClose={onClose}
      title={mode === "create" ? "New Education" : "Edit Education"}
      description={
        mode === "create"
          ? "Add academic qualifications or certifications"
          : "Update the education details"
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave}>
            {mode === "create" ? "Create Record" : "Save Changes"}
          </Button>
        </>
      }
    >
      <EducationForm
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
      title="Delete Education Record"
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
        Are you sure you want to delete the record for{" "}
        <span className="font-semibold text-slate-800">
          &quot;{title}&quot;
        </span>
        ? This action cannot be undone.
      </p>
    </Modal>
  );
}
