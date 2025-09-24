import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, User, Clock } from "lucide-react";
import type { FormVerification, VerificationStatus } from '@/types';
import type { VerificationTableProps } from '@/types/verification';
import { PaginationComponent } from '@/components/ui/pagination';
import { StatusBadge } from './StatusBadge';

export const VerificationTable: React.FC<VerificationTableProps> = ({
  data,
  loading,
  onViewDetails,
  pagination
}) => {
  const { currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange } = pagination;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Data tidak ditemukan</h3>
        <p className="text-gray-500 text-lg">
          Tidak ada data yang sesuai dengan filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="w-full rounded-xl border bg-card text-card-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors duration-200">
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">TID</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Lokasi</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Engineer</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Status</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">PM Periode</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Tanggal Submit</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Diperbarui</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((form) => (
                <TableRow 
                  key={form.id_verifikasi}
                  className="border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50/80"
                >
                  <TableCell className="p-6 align-middle">
                    <span className="font-semibold text-blue-600">{form.TID}</span>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{form.LOKASI}</span>
                      <span className="text-sm text-gray-600 mt-1">{form.KC_SUPERVISI}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="font-medium text-gray-900">{form.ID_ENGINEER}</span>
                      </div>
                      <span className="text-sm text-gray-600 mt-1">{form.PIC_AREA}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <StatusBadge status={form.status_verifikasi as VerificationStatus} />
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 font-medium border border-gray-200">{form.PM_PERIODE}</span>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(form.created_at).toLocaleDateString('id-ID')}
                      </span>
                      <span className="text-xs text-gray-600 mt-1">
                        {new Date(form.created_at).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    {form.updated_at && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(form.updated_at).toLocaleDateString('id-ID')}
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
                          {new Date(form.updated_at).toLocaleTimeString('id-ID')}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <Button
                      onClick={() => onViewDetails(form)}
                      variant="outline"
                      size="sm"
                      className="flex items-center whitespace-nowrap font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between px-6 py-4 bg-gray-50 rounded-xl">
        <div className="text-sm text-gray-600 font-medium">
          Total {totalItems} data
        </div>
        <PaginationComponent
          page={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </>
  );
};