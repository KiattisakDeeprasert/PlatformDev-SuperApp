import Modal from "@shared/components/Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: (id: string) => void;
  onClose: () => void;
  message: string;
  id: string
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onClose,
  message,
  id
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Confirm Delete"
      onClose={onClose}
      actions={
        <div className="flex justify-between">
          <button
            onClick={() => onConfirm(id)}
            className="bg-black text-white px-2 py-2 rounded-full"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-2 py-2 rounded-full ml-6"
          >
            Cancel
          </button>
        </div>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}