import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppModal, AppButton } from '../../common';
import { EXPENSE_CATEGORIES } from '../../constants';
import { formatEnum } from '../../utils/formatters';

const STORAGE_KEY = 'ef_employee_name';

export const ExpenseClaimFormModal = ({ isOpen, onClose, onSubmit, defaultValues = null, departments = [] }) => {
  const isEditing = !!defaultValues;

  // Load saved employee name from localStorage
  const savedName = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) || '' : '';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues || {
      employeeName: savedName,
      departmentId: '',
      expenseCategory: '',
      amount: '',
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || {
        employeeName: savedName,
        departmentId: '',
        expenseCategory: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
  }, [isOpen, defaultValues, reset]);

  const descriptionValue = watch('description', '');
  const maxDesc = 500;

  const onFormSubmit = async (data) => {
    // Persist employee name
    if (data.employeeName?.trim()) {
      localStorage.setItem(STORAGE_KEY, data.employeeName.trim());
    }
    const payload = {
      employeeName: data.employeeName.trim(),
      departmentId: Number(data.departmentId),
      expenseCategory: data.expenseCategory,
      amount: parseFloat(data.amount),
      expenseDate: data.expenseDate,
      description: data.description ? data.description.trim() : null,
    };
    await onSubmit(payload);
  };

  // Sort departments alphabetically
  const sortedDepts = [...departments].sort((a, b) =>
    a.departmentName.localeCompare(b.departmentName)
  );

  const footer = (
    <>
      <AppButton variant="light" onClick={onClose} disabled={isSubmitting}>Cancel</AppButton>
      <AppButton
        variant="primary"
        type="submit"
        onClick={handleSubmit(onFormSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" /> Saving…</>
          : isEditing ? 'Update Claim' : 'Submit Claim'
        }
      </AppButton>
    </>
  );

  return (
    <AppModal
      isOpen={isOpen}
      title={isEditing ? 'Edit Expense Claim' : 'Submit Expense Claim'}
      onClose={onClose}
      footer={footer}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        {/* Section 1: Employee Info */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8', margin: '0 0 12px' }}>Employee Information</p>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label" htmlFor="ec-name">
                Employee Name <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="ec-name"
                type="text"
                className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
                placeholder="e.g. John Doe"
                aria-required="true"
                aria-describedby={errors.employeeName ? 'ec-name-error' : undefined}
                {...register('employeeName', {
                  required: 'Employee name is required',
                  validate: (v) => v.trim().length >= 2 || 'Must be at least 2 characters',
                })}
              />
              {errors.employeeName && (
                <div id="ec-name-error" className="invalid-feedback" role="alert">{errors.employeeName.message}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="ec-dept">
                Department <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                id="ec-dept"
                className={`form-select ${errors.departmentId ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
                aria-required="true"
                {...register('departmentId', { required: 'Department is required' })}
              >
                <option value="">Select Department</option>
                {sortedDepts.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                ))}
              </select>
              {errors.departmentId && (
                <div className="invalid-feedback" role="alert">{errors.departmentId.message}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="ec-cat">
                Expense Category <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                id="ec-cat"
                className={`form-select ${errors.expenseCategory ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
                aria-required="true"
                {...register('expenseCategory', { required: 'Category is required' })}
              >
                <option value="">Select Category</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{formatEnum(cat)}</option>
                ))}
              </select>
              {errors.expenseCategory && (
                <div className="invalid-feedback" role="alert">{errors.expenseCategory.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Expense Details */}
        <div style={{ marginBottom: 20, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8', margin: '0 0 12px' }}>Expense Details</p>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="ec-amount">
                Amount (INR) <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="ec-amount"
                type="number"
                step="0.01"
                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
                placeholder="e.g. 1500.00"
                aria-required="true"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                })}
              />
              {errors.amount && (
                <div className="invalid-feedback" role="alert">{errors.amount.message}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="ec-date">
                Expense Date <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="ec-date"
                type="date"
                className={`form-control ${errors.expenseDate ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
                max={new Date().toISOString().split('T')[0]}
                aria-required="true"
                {...register('expenseDate', { required: 'Expense date is required' })}
              />
              {errors.expenseDate && (
                <div className="invalid-feedback" role="alert">{errors.expenseDate.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Notes */}
        <div style={{ paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8', margin: '0 0 12px' }}>Additional Notes</p>
          <div>
            <label className="form-label" htmlFor="ec-desc">
              Description
              <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400, marginLeft: 6 }}>(Optional)</span>
            </label>
            <textarea
              id="ec-desc"
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              rows="3"
              placeholder="Briefly describe the expense…"
              aria-describedby="ec-desc-count"
              maxLength={maxDesc}
              {...register('description', {
                maxLength: { value: maxDesc, message: `Maximum ${maxDesc} characters allowed` },
              })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {errors.description
                ? <div className="invalid-feedback d-block" role="alert">{errors.description.message}</div>
                : <span />}
              <span
                id="ec-desc-count"
                style={{
                  fontSize: 11, color: (descriptionValue?.length || 0) > maxDesc * 0.9 ? '#DC2626' : '#94A3B8',
                  fontWeight: 500
                }}
                aria-live="polite"
              >
                {descriptionValue?.length || 0}/{maxDesc}
              </span>
            </div>
          </div>
        </div>
      </form>
    </AppModal>
  );
};
