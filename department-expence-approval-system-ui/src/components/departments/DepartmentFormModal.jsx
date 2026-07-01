import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AppModal, AppButton } from '../../common';

export const DepartmentFormModal = ({ isOpen, onClose, onSubmit, defaultValues = null }) => {
  const isEditing = !!defaultValues;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues || { departmentName: '' },
  });

  useEffect(() => {
    if (isOpen) reset(defaultValues || { departmentName: '' });
  }, [isOpen, defaultValues, reset]);

  const onFormSubmit = async (data) => {
    await onSubmit({ departmentName: data.departmentName.trim() });
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
          : isEditing ? 'Update Department' : 'Create Department'
        }
      </AppButton>
    </>
  );

  return (
    <AppModal
      isOpen={isOpen}
      title={isEditing ? 'Edit Department' : 'Create Department'}
      onClose={onClose}
      footer={footer}
      size="sm"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <div>
          <label className="form-label" htmlFor="dept-name">
            Department Name <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            id="dept-name"
            type="text"
            className={`form-control ${errors.departmentName ? 'is-invalid' : ''}`}
            disabled={isSubmitting}
            placeholder="e.g. Engineering, Finance, HR…"
            aria-required="true"
            aria-describedby={errors.departmentName ? 'dept-name-error' : undefined}
            {...register('departmentName', {
              required: 'Department name is required',
              validate: (v) => v.trim().length >= 2 || 'Must be at least 2 characters',
              maxLength: { value: 100, message: 'Maximum 100 characters allowed' },
            })}
          />
          {errors.departmentName && (
            <div id="dept-name-error" className="invalid-feedback" role="alert">{errors.departmentName.message}</div>
          )}
        </div>
      </form>
    </AppModal>
  );
};
