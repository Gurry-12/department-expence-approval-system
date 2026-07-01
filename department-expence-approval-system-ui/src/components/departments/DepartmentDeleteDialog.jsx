import { useState } from 'react';
import { ConfirmDialog } from '../../common';

export const DepartmentDeleteDialog = ({ isOpen, onClose, onConfirm, departmentName }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Department"
      message={
        isDeleting 
          ? "Deleting department..." 
          : `Are you sure you want to delete the department "${departmentName}"? This action cannot be undone.`
      }
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      variant="danger"
    />
  );
};
