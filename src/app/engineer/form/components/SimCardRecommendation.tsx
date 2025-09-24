import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, AlertCircle } from 'lucide-react';
import { FormVerificationCreate } from '@/types';

interface SimCardRecommendationProps {
  control: Control<FormVerificationCreate>;
  errors: any;
  isResubmit: boolean;
}

const providers = ['Telkomsel', 'Smartfren', 'XL', 'Indosat'] as const;

export const SimCardRecommendation: React.FC<SimCardRecommendationProps> = ({
  control,
  errors,
  isResubmit
}) => {
  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <FileText className="mr-2 h-5 w-5 text-cyan-600" />
          Rekomendasi SIM Card
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">
              Rekomendasi SIM Card <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {providers.map((provider) => (
                <div key={provider} className="flex items-center">
                  <Controller
                    name="REKOMENDASI_SIMCARD"
                    control={control}
                    rules={{ required: 'Rekomendasi SIM Card wajib dipilih' }}
                    render={({ field }) => (
                      <input
                        type="radio"
                        id={`sim-${provider}`}
                        value={provider}
                        checked={field.value === provider}
                        onChange={field.onChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={isResubmit}
                      />
                    )}
                  />
                  <Label htmlFor={`sim-${provider}`} className="ml-2 block text-sm font-medium text-gray-700">
                    {provider}
                  </Label>
                </div>
              ))}
            </div>
            {errors.REKOMENDASI_SIMCARD && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="mr-1 h-4 w-4" />
                {errors.REKOMENDASI_SIMCARD.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="REKOMENDASI_CATATAN" className="text-gray-700 font-medium">
              Catatan Rekomendasi (Opsional)
            </Label>
            <Controller
              name="REKOMENDASI_CATATAN"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Tambahkan catatan tambahan tentang rekomendasi SIM Card..."
                  disabled={isResubmit}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};