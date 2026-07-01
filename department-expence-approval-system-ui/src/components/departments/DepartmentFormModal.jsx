import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AppModal, AppButton } from '../../common';

export const DepartmentFormModal = ({ isOpen, onClose, onSubmit, defaultValues = null }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues || { departmentName: '' }
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || { departmentName: '' });
    }
  }, [isOpen, defaultValues, reset]);

  const onFormSubmit = async (data) => {
    // Trim spaces before submitting
    const payload = {
      departmentName: data.departmentName.trim()
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
          'Save Department'
        )}
      </AppButton>
    </>
  );

  return (
    <AppModal 
      isOpen={isOpen} 
      title={defaultValues ? 'Edit Department' : 'Create Department'} 
      onClose={onClose} 
      footer={footer}
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label htmlFor="departmentName" className="form-label fw-semibold text-secondary">
            Department Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.departmentName ? 'is-invalid' : ''}`}
            id="departmentName"
            placeholder="e.g. Engineering"
            {...register('departmentName', { 
              required: 'Department Name is required',
              validate: (value) => value.trim().length > 0 || 'Department Name cannot be blank'
            })}
          />
          {errors.departmentName && (
            <div className="invalid-feedback">
              {errors.departmentName.message}
            </div>
          )}
        </div>
      </form>
    </AppModal>
  );
};
