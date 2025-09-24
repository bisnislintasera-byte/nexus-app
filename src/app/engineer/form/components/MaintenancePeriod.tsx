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
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Satellite className="mr-2 h-5 w-5 text-purple-600" />
          Periode Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">
            PM Periode <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pmPeriodeList.map((periode) => (
              <div key={periode} className="flex items-center">
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
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      disabled={isResubmit}
                    />
                  )}
                />
                <Label htmlFor={`pm-${periode}`} className="ml-2 block text-sm font-medium text-gray-700">
                  {periode}
                </Label>
              </div>
            ))}
          </div>
          {errors.PM_PERIODE && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              {errors.PM_PERIODE.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};