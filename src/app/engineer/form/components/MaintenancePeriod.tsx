import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Satellite, AlertCircle } from 'lucide-react';
import { FormVerificationCreate } from '@/types';

interface MaintenancePeriodProps {
  control: Control<FormVerificationCreate>;
  errors: any;
  pmPeriodeList: string[];
  isResubmit: boolean;
}

export const MaintenancePeriod: React.FC<MaintenancePeriodProps> = ({
  control,
  errors,
  pmPeriodeList,
  isResubmit
}) => {
  return (
    <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
        <CardTitle className="flex items-center text-xl font-bold">
          <div className="p-2 bg-purple-100 rounded-xl mr-3">
            <Satellite className="h-6 w-6 text-purple-600" />
          </div>
          Periode Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4">
          <Label className="text-gray-800 font-semibold text-sm">
            PM Periode <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pmPeriodeList.map((periode) => (
              <div key={periode} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                <Controller
                  name="PM_PERIODE"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="radio"
                      id={`pm-${periode}`}
                      value={periode}
                      checked={field.value === periode}
                      onChange={field.onChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                      disabled={isResubmit}
                    />
                  )}
                />
                <Label htmlFor={`pm-${periode}`} className="block text-sm font-semibold text-gray-800 cursor-pointer">
                  {periode}
                </Label>
              </div>
            ))}
          </div>
          {errors.PM_PERIODE && (
            <p className="text-sm text-red-600 flex items-center font-medium">
              <AlertCircle className="mr-1 h-4 w-4" />
              {errors.PM_PERIODE.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};