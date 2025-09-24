import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle, Wifi, Monitor, Video, Server, Cable, Plug, HardDrive, Radio } from 'lucide-react';
import { FormVerificationCreate } from '@/types';

interface ChecklistVerificationProps {
  control: Control<FormVerificationCreate>;
  isResubmit: boolean;
}

const checklistItems = [
  { name: 'STATUS_SIGNAL_MODEM', label: 'Status Signal Modem', icon: Wifi },
  { name: 'STATUS_DASHBOARD', label: 'Status Dashboard', icon: Monitor },
  { name: 'STATUS_CAMERA', label: 'Status Camera', icon: Video },
  { name: 'STATUS_NVR', label: 'Status NVR', icon: Server },
  { name: 'STATUS_KABEL_LAN', label: 'Status Kabel LAN', icon: Cable },
  { name: 'STATUS_HDMI', label: 'Status HDMI', icon: Plug },
  { name: 'STATUS_ADAPTOR', label: 'Status Adaptor', icon: Plug },
  { name: 'STATUS_HARDISK', label: 'Status Hardisk', icon: HardDrive },
  { name: 'STATUS_MODEM', label: 'Status Modem', icon: Radio },
];

export const ChecklistVerification: React.FC<ChecklistVerificationProps> = ({
  control,
  isResubmit
}) => {
  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          Checklist Verifikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {checklistItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <Icon className="mr-3 h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <Label className="block text-sm font-medium text-gray-700">
                    {item.label}
                  </Label>
                  <Controller
                    name={item.name as keyof FormVerificationCreate}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value ? 'OK' : 'NOT OK'}
                        onChange={(e) => field.onChange(e.target.value === 'OK')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        disabled={isResubmit}
                      >
                        <option value="OK">OK</option>
                        <option value="NOT OK">NOT OK</option>
                      </select>
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};