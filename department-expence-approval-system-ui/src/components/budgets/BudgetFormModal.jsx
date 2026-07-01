import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AppModal, AppButton } from '../../common';
import { MONTHS } from '../../constants';

export const BudgetFormModal = ({ isOpen, onClose, onSubmit, defaultValues = null, departments = [] }) => {
  const isEditing = !!defaultValues;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues || {
      departmentId: '',
      month: '',
      year: new Date().getFullYear(),
      budgetAmount: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || {
        departmentId: '',
        month: '',
        year: new Date().getFullYear(),
        budgetAmount: ''
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onFormSubmit = async (data) => {
    const payload = {
      departmentId: Number(data.departmentId),
      month: data.month,
      year: Number(data.year),
      budgetAmount: parseFloat(data.budgetAmount)
    };
    await onSubmit(payload);
  };

  const footer = (
    <>
      <AppButton variant="light" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </AppButton>
      <AppButton 
        variant="primary" 
        onClick={handleSubmit(onFormSubmit)} 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...</>
        ) : (
          'Save Budget'
        )}
      </AppButton>
    </>
  );

  return (
    <AppModal 
      isOpen={isOpen} 
      title={isEditing ? 'Update Budget' : 'Allocate Budget'} 
      onClose={onClose} 
      footer={footer}
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Department <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.departmentId ? 'is-invalid' : ''}`}
              disabled={isEditing || isSubmitting}
              {...register('departmentId', { required: 'Department is required' })}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
            {errors.departmentId && <div className="invalid-feedback">{errors.departmentId.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Month <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.month ? 'is-invalid' : ''}`}
              disabled={isEditing || isSubmitting}
              {...register('month', { required: 'Month is required' })}
            >
              <option value="">Select Month</option>
              {MONTHS.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            {errors.month && <div className="invalid-feedback">{errors.month.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Year <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.year ? 'is-invalid' : ''}`}
              disabled={isEditing || isSubmitting}
              {...register('year', { 
                required: 'Year is required',
                min: { value: 2000, message: 'Year must be 2000 or later' },
                max: { value: 2100, message: 'Year cannot exceed 2100' }
              })}
            />
            {errors.year && <div className="invalid-feedback">{errors.year.message}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Budget Amount (USD) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${errors.budgetAmount ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              placeholder="e.g. 50000.00"
              {...register('budgetAmount', { 
                required: 'Budget amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
            />
            {errors.budgetAmount && <div className="invalid-feedback">{errors.budgetAmount.message}</div>}
          </div>
        </div>
        
        {isEditing && (
          <div className="alert alert-info py-2 mt-2 mb-0 border-0">
            <i className="bi bi-info-circle me-2"></i>
            Only the Budget Amount can be updated. Department, Month, and Year are locked.
          </div>
        )}
      </form>
    </AppModal>
  );
};
