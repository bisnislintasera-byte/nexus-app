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
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Data tidak ditemukan</h3>
        <p className="mt-1 text-sm text-gray-500">
          Tidak ada data yang sesuai dengan filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="w-full rounded-lg border bg-card text-card-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableHead className="h-12 px-4 text-left align-middle font-medium">TID</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-medium">Lokasi</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-medium">Engineer</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-medium">Status</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-medium">PM Periode</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-medium">Tanggal Submit</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-medium">Diperbarui</TableHead>
                <TableHead className="h-12 px-4 text-left align-middle font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((form) => (
                <TableRow 
                  key={form.id_verifikasi}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell className="p-4 align-middle">
                    <span className="font-medium">{form.TID}</span>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    <div className="flex flex-col">
                      <span>{form.LOKASI}</span>
                      <span className="text-sm text-muted-foreground">{form.KC_SUPERVISI}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{form.ID_ENGINEER}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{form.PIC_AREA}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    <StatusBadge status={form.status_verifikasi as VerificationStatus} />
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    <span className="px-2 py-1 rounded-md bg-gray-100">{form.PM_PERIODE}</span>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {new Date(form.created_at).toLocaleDateString('id-ID')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(form.created_at).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    {form.updated_at && (
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {new Date(form.updated_at).toLocaleDateString('id-ID')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(form.updated_at).toLocaleTimeString('id-ID')}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="p-4 align-middle">
                    <Button
                      onClick={() => onViewDetails(form)}
                      variant="outline"
                      size="sm"
                      className="flex items-center whitespace-nowrap"
                    >
                      <Eye className="mr-1.5 h-4 w-4" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
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