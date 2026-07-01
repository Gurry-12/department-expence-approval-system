import { useState } from 'react';
import { ConfirmDialog } from '../../common';

export const ExpenseClaimDeleteDialog = ({ isOpen, onClose, onConfirm, detailText }) => {
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
      title="Delete Expense Claim"
      message={
        isDeleting 
          ? "Deleting claim..." 
          : `Are you sure you want to delete the claim "${detailText}"? This action cannot be undone.`
      }
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      variant="danger"
    />
  );
};
