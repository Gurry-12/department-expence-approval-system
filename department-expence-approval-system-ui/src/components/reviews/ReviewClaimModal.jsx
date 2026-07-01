import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppModal, AppButton, StatusBadge } from '../../common';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CLAIM_STATUS } from '../../constants';

const DetailRow = ({ label, children }) => (
  <div>
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', margin: '0 0 3px' }}>{label}</p>
    <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{children}</div>
  </div>
);

export const ReviewClaimModal = ({ isOpen, onClose, onSubmit, claim }) => {
  const [pendingAction, setPendingAction] = useState(null);
  const maxRemark = 500;

  const {
    register,
    trigger,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { reviewRemark: '' } });

  useEffect(() => {
    if (isOpen) { reset({ reviewRemark: '' }); setPendingAction(null); }
  }, [isOpen, reset]);

  const remarkValue = watch('reviewRemark', '');

  const handleAction = async (status) => {
    if (status === CLAIM_STATUS.REJECTED) {
      const isValid = await trigger('reviewRemark');
      if (!isValid) return;
    }
    const remark = getValues('reviewRemark');
    await onSubmit({
      recommendedStatus: status,
      reviewRemark: remark ? remark.trim() : null,
    });
  };

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <AppButton variant="light" onClick={onClose} disabled={isSubmitting}>Cancel</AppButton>
      <div style={{ display: 'flex', gap: 8 }}>
        <AppButton
          variant="outline-danger"
          icon="bi-x-circle"
          onClick={() => handleAction(CLAIM_STATUS.REJECTED)}
          disabled={isSubmitting}
        >
          {isSubmitting && pendingAction === 'reject' ? 'Processing…' : 'Reject'}
        </AppButton>
        <AppButton
          variant="success"
          icon="bi-check-circle"
          onClick={() => handleAction(CLAIM_STATUS.APPROVED)}
          disabled={isSubmitting}
        >
          {isSubmitting && pendingAction === 'approve' ? 'Processing…' : 'Approve'}
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
        <div>
          {/* Claim summary card */}
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px 20px', marginBottom: 20, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8' }}>Claim Details</span>
              <StatusBadge status={claim.status} />
            </div>
            <div className="row g-3">
              <div className="col-6"><DetailRow label="Employee">{claim.employeeName}</DetailRow></div>
              <div className="col-6"><DetailRow label="Department">{claim.department}</DetailRow></div>
              <div className="col-6"><DetailRow label="Category">{claim.expenseCategory?.replace(/_/g,' ')}</DetailRow></div>
              <div className="col-6">
                <DetailRow label="Amount">
                  <span style={{ color: '#16A34A', fontSize: 16 }}>{formatCurrency(claim.amount)}</span>
                </DetailRow>
              </div>
              <div className="col-6"><DetailRow label="Expense Date">{formatDate(claim.expenseDate)}</DetailRow></div>
              <div className="col-6"><DetailRow label="Submitted">{formatDate(claim.createdAt)}</DetailRow></div>
              {claim.description && (
                <div className="col-12">
                  <DetailRow label="Description">
                    <span style={{ fontWeight: 400, color: '#475569', fontSize: 13 }}>{claim.description}</span>
                  </DetailRow>
                </div>
              )}
            </div>
          </div>

          {/* Review action */}
          <div>
            <label className="form-label" htmlFor="review-remark">
              Review Remarks
              <span style={{ fontSize: 11, color: '#DC2626', marginLeft: 6 }}>* Required when rejecting</span>
            </label>
            <textarea
              id="review-remark"
              className={`form-control ${errors.reviewRemark ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              rows="3"
              placeholder="Enter your review remarks here…"
              maxLength={maxRemark}
              aria-describedby="remark-count"
              {...register('reviewRemark', {
                validate: {
                  requiredForRejection: () => true, // Validation triggered manually in handleAction
                },
              })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {errors.reviewRemark
                ? <div className="invalid-feedback d-block" role="alert">{errors.reviewRemark.message}</div>
                : <span style={{ fontSize: 11, color: '#94A3B8' }}>Optional for approval, required for rejection</span>}
              <span
                id="remark-count"
                style={{ fontSize: 11, color: (remarkValue?.length || 0) > maxRemark * 0.9 ? '#DC2626' : '#94A3B8', fontWeight: 500 }}
                aria-live="polite"
              >
                {remarkValue?.length || 0}/{maxRemark}
              </span>
            </div>
          </div>
        </div>
      )}
    </AppModal>
  );
};
