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
import { Eye, User, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { FormVerification, VerificationStatus } from '@/types';
import type { VerificationTableProps } from '@/types/verification';
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

  const getStatusBadge = (status: VerificationStatus) => {
    const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border";
    switch (status) {
      case 'PENDING':
        return (
          <span className={`${baseClasses} bg-amber-50 text-amber-800 border-amber-200`}>
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className={`${baseClasses} bg-green-50 text-green-800 border-green-200`}>
            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
            Disetujui
          </span>
        );
      case 'REJECTED':
        return (
          <span className={`${baseClasses} bg-red-50 text-red-800 border-red-200`}>
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-50 text-gray-800 border-gray-200`}>
            Unknown
          </span>
        );
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block relative overflow-x-auto">
        <div className="w-full rounded-xl border bg-card text-card-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors duration-200">
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">TID & Lokasi</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Engineer</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Status</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">PM Periode</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Tanggal Submit</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Diperbarui</TableHead>
                <TableHead className="h-14 px-6 text-left align-middle font-semibold text-gray-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((form, index) => (
                <TableRow 
                  key={form.id_verifikasi}
                  className={`border-b border-gray-100 transition-colors duration-200 hover:bg-blue-50/80 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                  onClick={() => onViewDetails(form)}
                >
                  <TableCell className="p-6 align-middle">
                    <div>
                      <span className="font-bold text-blue-600 text-sm">{form.TID}</span>
                      <p className="text-sm text-gray-600 mt-1">{form.LOKASI}</p>
                      <p className="text-xs text-gray-500 mt-1">{form.KC_SUPERVISI}</p>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 text-sm">{form.ID_ENGINEER}</span>
                        <p className="text-xs text-gray-500 mt-1">{form.PIC_AREA}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    {getStatusBadge(form.status_verifikasi as VerificationStatus)}
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <span className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 font-medium text-sm border border-purple-200">
                      {form.PM_PERIODE}
                    </span>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4" />
                      <div>
                        <p className="font-medium">{new Date(form.created_at).toLocaleDateString('id-ID')}</p>
                        <p className="text-xs text-gray-500">{new Date(form.created_at).toLocaleTimeString('id-ID')}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    {form.updated_at && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        <div>
                          <p className="font-medium">{new Date(form.updated_at).toLocaleDateString('id-ID')}</p>
                          <p className="text-xs text-gray-500">{new Date(form.updated_at).toLocaleTimeString('id-ID')}</p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="p-6 align-middle">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(form);
                      }}
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

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-100">
        {data.map((form) => (
          <div 
            key={form.id_verifikasi}
            className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            onClick={() => onViewDetails(form)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-lg font-bold text-blue-600">{form.TID}</p>
                <p className="text-sm text-gray-600 mt-1">{form.LOKASI}</p>
              </div>
              {getStatusBadge(form.status_verifikasi as VerificationStatus)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Engineer</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{form.ID_ENGINEER}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">PM Periode</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{form.PM_PERIODE}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{new Date(form.created_at).toLocaleDateString('id-ID')}</span>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(form);
                }}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Eye className="mr-1.5 h-4 w-4" />
                Detail
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between px-6 py-4 bg-gray-50 rounded-xl">
        <div className="text-sm text-gray-600 font-medium">
          Total {totalItems} data
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
};