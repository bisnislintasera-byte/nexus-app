'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MyFormList } from "./components/MyFormList";
import { MyFormFilter } from "./components/MyFormFilter";
import FormDetailView from "./components/FormDetailView";
import { Loader2, Plus } from 'lucide-react';

// Hooks
import { useFormManagement } from './hooks/useFormManagement';
import { useFormDetailManagement } from './hooks/useFormDetailManagement';

function MyFormsPage() {
  const router = useRouter();
  const { 
    filteredForms, 
    loading, 
    filterStatus, 
    handleFilter,
    statusCounts,
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setPageSize
  } = useFormManagement();

  const {
    selectedForm,
    showDetailView,
    viewFormDetails,
    closeDetailView,
    handleResubmit,
    resubmittingId
  } = useFormDetailManagement();

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Daftar Form Saya</h1>
              <p className="text-gray-600 mt-2">Kelola form verifikasi aset yang telah Anda submit</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/engineer/form")}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Buat Form Baru
          </Button>
        </div>

        <MyFormFilter
          selectedStatus={filterStatus}
          onStatusChange={handleFilter}
          counts={statusCounts}
        />

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada form yang ditemukan</p>
          </div>
        ) : (
          <MyFormList
            forms={filteredForms}
            onViewDetail={viewFormDetails}
            onResubmit={handleResubmit}
            resubmittingId={resubmittingId || undefined}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </Card>

      {showDetailView && selectedForm && (
        <FormDetailView
          form={selectedForm}
          onClose={closeDetailView}
        />
      )}
    </div>
  );
}

function MyFormsPageWrapper() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <MyFormsPage />
    </Suspense>
  );
}

export default MyFormsPageWrapper;