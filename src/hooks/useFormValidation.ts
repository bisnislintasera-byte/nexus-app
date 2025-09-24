import { useCallback, useState, useEffect } from 'react';

export interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string[]>;
  hasUnsavedChanges: boolean;
}

export interface UseFormValidationOptions {
  onSave?: (data: any) => Promise<void>;
  autoSaveInterval?: number; // in milliseconds
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation(
  initialData: any,
  validationSchema: any,
  options: UseFormValidationOptions = {}
) {
  const {
    onSave,
    autoSaveInterval = 30000, // default 30 seconds
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  const [formState, setFormState] = useState<FormState>({
    isDirty: false,
    isSubmitting: false,
    errors: {},
    hasUnsavedChanges: false,
  });

  const [formData, setFormData] = useState(initialData);
  const [lastSavedData, setLastSavedData] = useState(initialData);

  // Validate the entire form
  const validateForm = useCallback(async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setFormState(prev => ({ ...prev, errors: {} }));
      return true;
    } catch (err: any) {
      const errors: Record<string, string[]> = {};
      err.inner.forEach((error: any) => {
        if (!errors[error.path]) {
          errors[error.path] = [];
        }
        errors[error.path].push(error.message);
      });
      setFormState(prev => ({ ...prev, errors }));
      return false;
    }
  }, [formData, validationSchema]);

  // Handle field change
  const handleChange = useCallback(async (
    name: string,
    value: any,
    shouldValidate: boolean = validateOnChange
  ) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    setFormState(prev => ({
      ...prev,
      isDirty: true,
      hasUnsavedChanges: JSON.stringify(newData) !== JSON.stringify(lastSavedData),
    }));

    if (shouldValidate) {
      try {
        await validationSchema.validateAt(name, newData);
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [name]: [],
          },
        }));
      } catch (err: any) {
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [name]: [err.message],
          },
        }));
      }
    }
  }, [formData, lastSavedData, validateOnChange, validationSchema]);

  // Handle field blur
  const handleBlur = useCallback(async (name: string) => {
    if (validateOnBlur) {
      try {
        await validationSchema.validateAt(name, formData);
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [name]: [],
          },
        }));
      } catch (err: any) {
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [name]: [err.message],
          },
        }));
      }
    }
  }, [formData, validateOnBlur, validationSchema]);

  // Auto-save functionality
  useEffect(() => {
    if (!onSave || !formState.isDirty || !formState.hasUnsavedChanges) {
      return;
    }

    const timer = setTimeout(async () => {
      const isValid = await validateForm();
      if (isValid) {
        try {
          setFormState(prev => ({ ...prev, isSubmitting: true }));
          await onSave(formData);
          setLastSavedData(formData);
          setFormState(prev => ({
            ...prev,
            isSubmitting: false,
            isDirty: false,
            hasUnsavedChanges: false,
          }));
        } catch (error) {
          setFormState(prev => ({
            ...prev,
            isSubmitting: false,
          }));
        }
      }
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [formData, formState.isDirty, formState.hasUnsavedChanges, autoSaveInterval, onSave, validateForm]);

  // Prevent leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formState.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formState.hasUnsavedChanges]);

  return {
    formData,
    formState,
    handleChange,
    handleBlur,
    validateForm,
    setFormData,
  };
}