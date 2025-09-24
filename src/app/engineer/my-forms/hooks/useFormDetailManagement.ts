import { useState } from 'react';
import { FormVerification } from '@/types';
import { EnhancedFormVerification } from './useFormManagement';
import { useFormResubmission } from './useFormResubmission';

export function useFormDetailManagement() {
  const [selectedForm, setSelectedForm] = useState<EnhancedFormVerification | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const { initiateResubmit, resubmittingId } = useFormResubmission();

  const viewFormDetails = (form: FormVerification) => {
    setSelectedForm(form as EnhancedFormVerification);
    setShowDetailView(true);
  };

  const closeDetailView = () => {
    setShowDetailView(false);
    setSelectedForm(null);
  };

  const handleResubmit = async (formId: string) => {
    closeDetailView(); // Tutup detail view sebelum memulai proses resubmit
    await initiateResubmit(formId);
  };

  return {
    selectedForm,
    showDetailView,
    viewFormDetails,
    closeDetailView,
    handleResubmit,
    resubmittingId
  };
}