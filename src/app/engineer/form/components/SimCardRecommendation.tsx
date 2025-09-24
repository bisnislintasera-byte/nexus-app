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
    <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
        <CardTitle className="flex items-center text-xl font-bold">
          <div className="p-2 bg-cyan-100 rounded-xl mr-3">
            <FileText className="h-6 w-6 text-cyan-600" />
          </div>
          Rekomendasi SIM Card
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-gray-800 font-semibold text-sm">
              Rekomendasi SIM Card <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {providers.map((provider) => (
                <div key={provider} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
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
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                        disabled={isResubmit}
                      />
                    )}
                  />
                  <Label htmlFor={`sim-${provider}`} className="block text-sm font-semibold text-gray-800 cursor-pointer">
                    {provider}
                  </Label>
                </div>
              ))}
            </div>
            {errors.REKOMENDASI_SIMCARD && (
              <p className="text-sm text-red-600 flex items-center font-medium">
                <AlertCircle className="mr-1 h-4 w-4" />
                {errors.REKOMENDASI_SIMCARD.message}
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="REKOMENDASI_CATATAN" className="text-gray-800 font-semibold text-sm">
              Catatan Rekomendasi (Opsional)
            </Label>
            <Controller
              name="REKOMENDASI_CATATAN"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-400 bg-white"
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