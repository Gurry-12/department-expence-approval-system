import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AppModal, AppButton } from '../../common';
import { EXPENSE_CATEGORIES } from '../../constants';

export const ExpenseClaimFormModal = ({ isOpen, onClose, onSubmit, defaultValues = null, departments = [] }) => {
  const isEditing = !!defaultValues;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues || {
      employeeName: '',
      departmentId: '',
      expenseCategory: '',
      amount: '',
      expenseDate: new Date().toISOString().split('T')[0],
      description: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || {
        employeeName: '',
        departmentId: '',
        expenseCategory: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [isOpen, defaultValues, reset]);

  const onFormSubmit = async (data) => {
    const payload = {
      employeeName: data.employeeName.trim(),
      departmentId: Number(data.departmentId),
      expenseCategory: data.expenseCategory,
      amount: parseFloat(data.amount),
      expenseDate: data.expenseDate,
      description: data.description ? data.description.trim() : null
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
          'Submit Claim'
        )}
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
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="row">
          
          <div className="col-md-12 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Employee Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              placeholder="e.g. John Doe"
              {...register('employeeName', { 
                required: 'Employee Name is required',
                validate: (value) => value.trim().length >= 2 || 'Must be at least 2 characters'
              })}
            />
            {errors.employeeName && <div className="invalid-feedback">{errors.employeeName.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Department <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.departmentId ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
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
              Expense Category <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.expenseCategory ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              {...register('expenseCategory', { required: 'Category is required' })}
            >
              <option value="">Select Category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.expenseCategory && <div className="invalid-feedback">{errors.expenseCategory.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Amount (USD) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              placeholder="e.g. 150.50"
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be positive' }
              })}
            />
            {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Expense Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${errors.expenseDate ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              max={new Date().toISOString().split('T')[0]}
              {...register('expenseDate', { 
                required: 'Expense date is required'
              })}
            />
            {errors.expenseDate && <div className="invalid-feedback">{errors.expenseDate.message}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label fw-semibold text-secondary">
              Description (Optional)
            </label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              disabled={isSubmitting}
              rows="3"
              placeholder="Briefly describe the expense..."
              {...register('description', {
                maxLength: { value: 500, message: 'Maximum 500 characters allowed' }
              })}
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
          </div>

        </div>
      </form>
    </AppModal>
  );
};
