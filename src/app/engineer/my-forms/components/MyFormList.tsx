import { FormVerification } from '@/types'
import { StatusBadge } from './StatusBadge'
import { Calendar, AlertCircle, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { StandardTable, ColumnDef } from '@/components/ui/standard-table'
import { StandardPagination } from '@/components/ui/standard-pagination'

interface MyFormListProps {
  forms: FormVerification[]
  onViewDetail: (form: FormVerification) => void
  onResubmit: (id: string) => void
  resubmittingId?: string
  currentPage?: number
  totalPages?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function MyFormList({ 
  forms, 
  onViewDetail, 
  onResubmit, 
  resubmittingId,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}: MyFormListProps) {
  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Tidak ada form yang ditemukan</p>
      </div>
    )
  }

  const formColumns: ColumnDef<FormVerification>[] = [
    {
      id: 'tid',
      header: 'TID & Lokasi',
      cell: (row) => (
        <div>
          <p className="text-sm font-medium text-blue-600">{row.TID}</p>
          <p className="text-sm text-gray-500 mt-0.5">{row.LOKASI}</p>
        </div>
      ),
    },
    {
      id: 'periode',
      header: 'PM Periode',
      cell: (row) => (
        <span className="text-xs text-gray-500">PM: {row.PM_PERIODE}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status_verifikasi} />,
    },
    {
      id: 'created_at',
      header: 'Dibuat',
      cell: (row) => (
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="mr-1.5 h-3.5 w-3.5" />
          <span>
            {row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.status_verifikasi === 'REJECTED' && row.comment_verifikasi && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast(row.comment_verifikasi || '', { icon: '💬' })}
              className="flex-1 sm:flex-none justify-center"
            >
              <AlertCircle className="mr-1 h-4 w-4" />
              Lihat Komentar
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetail(row)}
            className="flex-1 sm:flex-none justify-center"
          >
            Detail
          </Button>
          {row.status_verifikasi === 'REJECTED' && (
            <Button
              size="sm"
              onClick={() => onResubmit(row.id_verifikasi)}
              disabled={resubmittingId === row.id_verifikasi}
              className="flex-1 sm:flex-none justify-center bg-orange-600 hover:bg-orange-700 text-white disabled:bg-orange-400"
            >
              {resubmittingId === row.id_verifikasi ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Memvalidasi...
                </>
              ) : (
                <>
                  <Upload className="mr-1 h-4 w-4" />
                  Kirim Ulang
                </>
              )}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <StandardTable 
        columns={formColumns} 
        data={forms} 
        onRowClick={onViewDetail}
        mobileView={(row) => (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-blue-600">{row.TID}</p>
                <p className="text-sm text-gray-500 mt-0.5">{row.LOKASI}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">PM: {row.PM_PERIODE}</span>
                <StatusBadge status={row.status_verifikasi} />
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              <span>
                {row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : 'N/A'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {row.status_verifikasi === 'REJECTED' && row.comment_verifikasi && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast(row.comment_verifikasi || '', { icon: '💬' })}
                  className="flex-1 sm:flex-none justify-center"
                >
                  <AlertCircle className="mr-1 h-4 w-4" />
                  Lihat Komentar
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetail(row)}
                className="flex-1 sm:flex-none justify-center"
              >
                Detail
              </Button>
              {row.status_verifikasi === 'REJECTED' && (
                <Button
                  size="sm"
                  onClick={() => onResubmit(row.id_verifikasi)}
                  disabled={resubmittingId === row.id_verifikasi}
                  className="flex-1 sm:flex-none justify-center bg-orange-600 hover:bg-orange-700 text-white disabled:bg-orange-400"
                >
                  {resubmittingId === row.id_verifikasi ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Memvalidasi...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-1 h-4 w-4" />
                      Kirim Ulang
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      />
      {onPageChange && onPageSizeChange && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <StandardPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  )
}