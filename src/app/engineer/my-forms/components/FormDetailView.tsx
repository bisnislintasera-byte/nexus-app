'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import PhotoStatusIndicator from '@/components/ui/photo-status-indicator'
import PhotoRejectionComment from '@/components/ui/photo-rejection-comment'
import { FileText, Calendar, User, MapPin, XCircle, Eye, Image, AlertCircle } from 'lucide-react'
import { FormVerification } from '@/types'

interface FormDetailViewProps {
  form: FormVerification
  onClose: () => void
}

const getStatusBadge = (status: string) => {
  let className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  switch (status) {
    case 'PENDING':
      className += ' bg-yellow-100 text-yellow-800'
      return <span className={className}>Pending</span>
    case 'APPROVED':
      className += ' bg-green-100 text-green-800'
      return <span className={className}>Approved</span>
    case 'REJECTED':
      className += ' bg-red-100 text-red-800'
      return <span className={className}>Rejected</span>
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>
  }
}

const PhotoCard = ({ src, alt, label, details }: { src: string; alt: string; label: string; details?: any }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <div className="p-2 bg-gray-50 border-b border-gray-200">
      <Label className="text-sm text-gray-700">{label}</Label>
    </div>
    <div className="relative">
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-40 object-cover cursor-pointer"
        onClick={() => window.open(src, '_blank')}
      />
      <Button 
        variant="ghost" 
        size="sm"
        className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100"
        onClick={() => window.open(src, '_blank')}
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
    {details && (
      <div className="p-2 bg-gray-50 border-t border-gray-200">
        <PhotoStatusIndicator 
          status={details.status} 
          komentar={details.komentar}
        />
      </div>
    )}
  </div>
)

export default function FormDetailView({ form, onClose }: FormDetailViewProps) {
  return (
    <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0 mt-8">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl font-bold">
            <div className="p-2 bg-blue-100 rounded-xl mr-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            Detail Form Verifikasi
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-lg hover:bg-blue-100 transition-all duration-200"
          >
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-base text-gray-700 mt-3 font-medium">
          TID: {form.TID} | Lokasi: {form.LOKASI}
        </p>
      </CardHeader>

      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Dasar</h3>
            <div className="space-y-5">
              {[
                { label: 'Kanwil', value: form.KANWIL },
                { label: 'KC Supervisi', value: form.KC_SUPERVISI },
                { label: 'Project', value: form.PROJECT },
                { label: 'PIC Area', value: form.PIC_AREA },
                { label: 'No PC', value: form.NO_PC },
                { label: 'SN Mini PC', value: form.SN_MINI_PC }
              ].map((item) => (
                <div key={item.label} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">{item.label}</Label>
                  <p className="text-gray-900 font-medium mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Details */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Detail Verifikasi</h3>
            <div className="space-y-5">
              <div>
                <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Status</Label>
                <div className="mt-2">
                  {getStatusBadge(form.status_verifikasi)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">PM Periode</Label>
                <p className="text-gray-900 font-medium mt-1">{form.PM_PERIODE}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Engineer</Label>
                <div className="flex items-center mt-2">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-900 font-medium">{form.ID_ENGINEER}</span>
                </div>
              </div>
              {form.latitude && form.longitude && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Lokasi</Label>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-900 font-medium text-xs">
                      {form.latitude}, {form.longitude}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Dibuat pada</Label>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-900 font-medium text-sm">
                    {form.created_at ? new Date(form.created_at).toLocaleString('id-ID') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Checklist Verifikasi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'STATUS_SIGNAL_MODEM', label: 'Status Signal Modem' },
              { key: 'STATUS_DASHBOARD', label: 'Status Dashboard' },
              { key: 'STATUS_CAMERA', label: 'Status Camera' },
              { key: 'STATUS_NVR', label: 'Status NVR' },
              { key: 'STATUS_KABEL_LAN', label: 'Status Kabel LAN' },
              { key: 'STATUS_HDMI', label: 'Status HDMI' },
              { key: 'STATUS_ADAPTOR', label: 'Status Adaptor' },
              { key: 'STATUS_HARDISK', label: 'Status Hardisk' },
              { key: 'STATUS_MODEM', label: 'Status Modem' },
              { key: 'REKOMENDASI_SIMCARD', label: 'Rekomendasi SIM Card' }
            ].map((item) => (
              <div key={item.key} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                  form[item.key as keyof typeof form] 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {form[item.key as keyof typeof form] ? 'OK' : 'NOT OK'}
                </span>
                <Label className="ml-4 block text-sm font-semibold text-gray-800">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Dokumentasi Foto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'FOTO_MINI_PC_FULL', label: 'Foto Mini PC Full' },
              { key: 'FOTO_SN_MINI_PC', label: 'Foto SN Mini PC' },
              { key: 'FOTO_TID', label: 'Foto TID' },
              { key: 'FOTO_DASHBOARD_VIMS', label: 'Foto Dashboard VIMS' },
              { key: 'FOTO_SIGNAL_MODEM', label: 'Foto Signal Modem' },
              { key: 'FOTO_STORAGE_MINI', label: 'Foto Storage Mini' }
            ].map((item) => {
              const photoUrl = form[item.key as keyof typeof form]
              const details = form.foto_verifikasi_details?.[item.key as keyof typeof form.foto_verifikasi_details]
              return photoUrl ? (
                <PhotoCard
                  key={item.key}
                  src={photoUrl as string}
                  alt={item.label}
                  label={item.label}
                  details={details}
                />
              ) : null
            })}
            
            {/* Temuan Rusak - Full width */}
            {form.FOTO_TEMUAN_RUSAK && (
              <div className="md:col-span-3">
                <PhotoCard
                  src={form.FOTO_TEMUAN_RUSAK}
                  alt="Foto Temuan Rusak"
                  label="Foto Temuan Rusak"
                  details={form.foto_verifikasi_details?.FOTO_TEMUAN_RUSAK}
                />
              </div>
            )}
          </div>

          {/* No Photos Message */}
          {(!form.FOTO_MINI_PC_FULL && 
            !form.FOTO_SN_MINI_PC && 
            !form.FOTO_TID && 
            !form.FOTO_DASHBOARD_VIMS && 
            !form.FOTO_SIGNAL_MODEM && 
            !form.FOTO_STORAGE_MINI && 
            !form.FOTO_TEMUAN_RUSAK) && (
            <div className="text-center py-16">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada foto</h3>
              <p className="text-gray-500">
                Belum ada foto dokumentasi yang diunggah untuk form ini.
              </p>
            </div>
          )}
        </div>

        {/* Rejection Comments */}
        {form.status_verifikasi === 'REJECTED' && form.comment_verifikasi && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Komentar Penolakan</h3>
            <div className="p-6 bg-red-50 rounded-xl border border-red-200/50">
              <div className="flex items-start">
                <div className="p-1 bg-red-100 rounded-lg mr-3 flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-red-900 leading-relaxed font-medium">{form.comment_verifikasi}</p>
              </div>
            </div>
            
            {/* Photo Rejection Details */}
            {form.foto_verifikasi_details && (
              <div className="mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Detail Penolakan Foto</h4>
                <div className="space-y-3">
                  {Object.entries(form.foto_verifikasi_details).map(([fieldName, detail]) => {
                    if (detail.status === 'REJECTED' && detail.komentar) {
                      const fieldLabels: Record<string, string> = {
                        'FOTO_MINI_PC_FULL': 'Foto Mini PC Full',
                        'FOTO_SN_MINI_PC': 'Foto SN Mini PC',
                        'FOTO_TID': 'Foto TID',
                        'FOTO_DASHBOARD_VIMS': 'Foto Dashboard VIMS',
                        'FOTO_SIGNAL_MODEM': 'Foto Signal Modem',
                        'FOTO_STORAGE_MINI': 'Foto Storage Mini',
                        'FOTO_TEMUAN_RUSAK': 'Foto Temuan Rusak'
                      }
                      
                      return (
                        <PhotoRejectionComment 
                          key={fieldName} 
                          komentar={`${fieldLabels[fieldName] || fieldName}: ${detail.komentar}`} 
                        />
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}