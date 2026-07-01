import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AppModal, AppButton } from '../../common';
import { MONTHS } from '../../constants';

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const formatMonth = (m) => {
  if (!m) return '';
  const name = typeof m === 'number' ? MONTHS[m - 1] : m;
  return name ? name.charAt(0) + name.slice(1).toLowerCase() : m;
};

export const BudgetFormModal = ({ isOpen, onClose, onSubmit, defaultValues = null, departments = [] }) => {
  const isEditing = !!defaultValues;

  const sortedDepts = [...departments].sort((a, b) =>
    a.departmentName.localeCompare(b.departmentName)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues
      ? { ...defaultValues, month: typeof defaultValues.month === 'number' ? MONTHS[defaultValues.month - 1] : defaultValues.month }
      : { departmentId: '', month: '', year: new Date().getFullYear(), budgetAmount: '' },
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        reset({
          ...defaultValues,
          month: typeof defaultValues.month === 'number' ? MONTHS[defaultValues.month - 1] : defaultValues.month,
        });
      } else {
        reset({ departmentId: '', month: '', year: new Date().getFullYear(), budgetAmount: '' });
      }
    }
  }, [isOpen, defaultValues, reset]);

  const onFormSubmit = async (values) => {
    const payload = {
      departmentId: Number(values.departmentId),
      month: values.month,
      year: Number(values.year),
      budgetAmount: parseFloat(values.budgetAmount),
    };
    await onSubmit(payload);
  };

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
          : isEditing ? 'Update Budget' : 'Allocate Budget'
        }
      </AppButton>
    </>
  );

  return (
    <AppModal
      isOpen={isOpen}
      title={isEditing ? 'Update Budget Allocation' : 'Allocate Budget'}
      onClose={onClose}
      footer={footer}
      size="sm"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="b-dept">
              Department <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              id="b-dept"
              className={`form-select ${errors.departmentId ? 'is-invalid' : ''}`}
              aria-required="true"
              {...register('departmentId', {
                required: 'Department is required',
                disabled: isEditing || isSubmitting,
              })}
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

          <div className="col-6">
            <label className="form-label" htmlFor="b-month">
              Month <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              id="b-month"
              className={`form-select ${errors.month ? 'is-invalid' : ''}`}
              aria-required="true"
              {...register('month', {
                required: 'Month is required',
                disabled: isEditing || isSubmitting,
              })}
            >
              <option value="">Select Month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{formatMonth(m)}</option>
              ))}
            </select>
            {errors.month && (
              <div className="invalid-feedback" role="alert">{errors.month.message}</div>
            )}
          </div>

          <div className="col-6">
            <label className="form-label" htmlFor="b-year">
              Year <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              id="b-year"
              className={`form-select ${errors.year ? 'is-invalid' : ''}`}
              aria-required="true"
              {...register('year', {
                required: 'Year is required',
                disabled: isEditing || isSubmitting,
              })}
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            {errors.year && (
              <div className="invalid-feedback" role="alert">{errors.year.message}</div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="b-amount">
              Budget Amount (INR) <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="b-amount"
              type="number"
              step="0.01"
              className={`form-control ${errors.budgetAmount ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              placeholder="e.g. 50000.00"
              aria-required="true"
              {...register('budgetAmount', {
                required: 'Budget amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
              })}
            />
            {errors.budgetAmount && (
              <div className="invalid-feedback" role="alert">{errors.budgetAmount.message}</div>
            )}
          </div>

          {isEditing && (
            <div className="col-12">
              <div
                style={{
                  background: '#EFF6FF', border: '1px solid rgba(37,99,235,0.2)',
                  borderRadius: 8, padding: '10px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#1D4ED8',
                }}
                role="note"
              >
                <i className="bi bi-info-circle-fill" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
                <span>Only the <strong>Budget Amount</strong> can be updated. Department, Month, and Year are locked.</span>
              </div>
            </div>
          )}
        </div>
      </form>
    </AppModal>
  );
};
