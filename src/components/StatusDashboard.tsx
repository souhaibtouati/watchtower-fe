import {
  Activity,
  Clock,
  Server,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, Button } from './ui';
import type { WatchtowerStatus } from '../types';
import { formatDistanceToNow, format } from 'date-fns';

interface StatusDashboardProps {
  status: WatchtowerStatus | null;
  loading: boolean;
  onForceCheck: () => Promise<{ success: boolean }>;
  onRefresh: () => void;
}

export function StatusDashboard({
  status,
  loading,
  onForceCheck,
  onRefresh,
}: StatusDashboardProps) {
  const handleForceCheck = async () => {
    await onForceCheck();
    onRefresh();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent>
              <div className="h-20 animate-pulse bg-slate-700/50 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32 text-slate-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          Unable to fetch Watchtower status
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Status',
      value: status.isRunning ? 'Running' : 'Stopped',
      icon: status.isRunning ? CheckCircle : AlertCircle,
      color: status.isRunning ? 'text-green-400' : 'text-red-400',
      bgColor: status.isRunning ? 'bg-green-400/10' : 'bg-red-400/10',
    },
    {
      label: 'Monitored Containers',
      value: status.monitoredContainers.toString(),
      icon: Server,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Updates Available',
      value: status.containersWithUpdates.toString(),
      icon: Activity,
      color:
        status.containersWithUpdates > 0
          ? 'text-yellow-400'
          : 'text-green-400',
      bgColor:
        status.containersWithUpdates > 0
          ? 'bg-yellow-400/10'
          : 'bg-green-400/10',
    },
    {
      label: 'Last Check',
      value: status.lastCheck
        ? formatDistanceToNow(new Date(status.lastCheck), { addSuffix: true })
        : 'Never',
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="text-2xl font-semibold text-white">Watchtower Status</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button variant="secondary" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" style={{ marginRight: '8px' }} />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleForceCheck}>
            <Activity className="w-4 h-4" style={{ marginRight: '8px' }} />
            Force Check
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className={`rounded-lg ${stat.bgColor}`} style={{ padding: '12px' }}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className={`text-xl font-semibold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {status.nextCheck && (
        <Card>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }} className="text-slate-300">
                <Clock className="w-5 h-5 text-slate-400" style={{ marginRight: '8px' }} />
                <span>Next scheduled check:</span>
              </div>
              <span className="text-slate-200 font-medium">
                {format(new Date(status.nextCheck), 'PPpp')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
