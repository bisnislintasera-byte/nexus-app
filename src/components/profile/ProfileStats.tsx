import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserStats } from '@/hooks/useProfile';
import {
  BarChart3,
  Clock,
  FileCheck,
  FileText,
  Percent
} from 'lucide-react';

interface ProfileStatsProps {
  stats: UserStats;
  isLoading?: boolean;
}

export function ProfileStats({ stats, isLoading }: ProfileStatsProps) {
  const items = [
    {
      title: 'Total Form Dibuat',
      value: stats.total_forms_created,
      icon: FileText,
      description: 'Form yang telah dibuat',
      trend: null,
      color: 'text-blue-600',
    },
    {
      title: 'Form Diverifikasi',
      value: stats.total_forms_verified,
      icon: FileCheck,
      description: 'Form yang telah diverifikasi',
      trend: null,
      color: 'text-green-600',
    },
    {
      title: 'Tingkat Verifikasi',
      value: `${Math.round(stats.verification_rate * 100)}%`,
      icon: Percent,
      description: 'Persentase form yang diverifikasi',
      trend: stats.verification_rate > 0.75 ? 'up' : 'down',
      color: 'text-purple-600',
    },
    {
      title: 'Rata-rata Waktu',
      value: `${Math.round(stats.average_verification_time)} menit`,
      icon: Clock,
      description: 'Rata-rata waktu verifikasi',
      trend: stats.average_verification_time < 30 ? 'up' : 'down',
      color: 'text-orange-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 bg-muted rounded mb-2" />
              <div className="h-4 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
                {item.trend && (
                  <span className={item.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {' '}
                    {item.trend === 'up' ? '↑' : '↓'}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}