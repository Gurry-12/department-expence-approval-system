import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AppModal, AppButton, StatusBadge } from '../../common';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CLAIM_STATUS } from '../../constants';

export const ReviewClaimModal = ({ isOpen, onClose, onSubmit, claim }) => {
  const {
    register,
    trigger,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      reviewRemark: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({ reviewRemark: '' });
    }
  }, [isOpen, reset]);

  const handleAction = async (status) => {
    // If Rejecting, review remark is mandatory
    if (status === CLAIM_STATUS.REJECTED) {
      const isValid = await trigger('reviewRemark');
      if (!isValid) return;
    }

    const remark = getValues('reviewRemark');
    
    await onSubmit({
      recommendedStatus: status,
      reviewRemark: remark ? remark.trim() : null
    });
  };

  const footer = (
    <div className="d-flex justify-content-between w-100">
      <AppButton variant="light" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </AppButton>
      <div className="d-flex gap-2">
        <AppButton 
          variant="danger" 
          onClick={() => handleAction(CLAIM_STATUS.REJECTED)} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Reject'}
        </AppButton>
        <AppButton 
          variant="success" 
          onClick={() => handleAction(CLAIM_STATUS.APPROVED)} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Approve'}
        </AppButton>
      </div>
    </div>
  );

  return (
    <AppModal 
      isOpen={isOpen} 
      title="Review Expense Claim" 
      onClose={onClose} 
      footer={footer}
    >
      {claim && (
        <div className="row g-3">
          <div className="col-12">
            <h6 className="border-bottom pb-2 mb-3 text-primary">Claim Details</h6>
          </div>

          <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Employee</label>
            <div className="fw-semibold">{claim.employeeName}</div>
          </div>
          
          <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Department</label>
            <div className="fw-semibold">{claim.department}</div>
          </div>

          <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Category</label>
            <div className="fw-semibold">{claim.expenseCategory}</div>
          </div>

          <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Amount</label>
            <div className="fw-semibold text-success">{formatCurrency(claim.amount)}</div>
          </div>

          <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Date</label>
            <div className="fw-semibold">{formatDate(claim.expenseDate)}</div>
          </div>

          <div className="col-md-6">
            <label className="form-label small text-muted mb-1">Current Status</label>
            <div><StatusBadge status={claim.status} /></div>
          </div>

          <div className="col-12">
            <label className="form-label small text-muted mb-1">Description</label>
            <div className="p-2 bg-light rounded text-break">
              {claim.description || <span className="text-muted fst-italic">No description provided</span>}
            </div>
          </div>

          <div className="col-12 mt-4">
            <h6 className="border-bottom pb-2 mb-3 text-primary">Review Action</h6>
            <label className="form-label fw-semibold text-secondary">
              Review Remark <span className="text-danger">* (Required for Rejection)</span>
            </label>
            <textarea
              className={`form-control ${errors.reviewRemark ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              rows="3"
              placeholder="Enter your review remarks..."
              {...register('reviewRemark', {
                validate: {
                  requiredForRejection: (value) => true // Validation handled manually in handleAction for context-awareness
                }
              })}
            ></textarea>
            {errors.reviewRemark && <div className="invalid-feedback">{errors.reviewRemark.message}</div>}
          </div>
        </div>
      )}
    </AppModal>
  );
};
