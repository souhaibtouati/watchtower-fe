import { useState } from 'react';
import {
  Box,
  Play,
  Square,
  RefreshCw,
  ArrowUpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardContent, Button, Badge } from './ui';
import type { Container } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ContainerListProps {
  containers: Container[];
  loading: boolean;
  onUpdate: (containerId: string) => Promise<{ success: boolean }>;
  onUpdateAll: () => Promise<{ success: boolean }>;
  onRefresh: () => void;
}

export function ContainerList({
  containers,
  loading,
  onUpdate,
  onUpdateAll,
  onRefresh,
}: ContainerListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingAll, setUpdatingAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const containersWithUpdates = containers.filter((c) => c.hasUpdate);
  const hasUpdates = containersWithUpdates.length > 0;

  const handleUpdateAll = async () => {
    setUpdatingAll(true);
    await onUpdateAll();
    setUpdatingAll(false);
    onRefresh();
  };

  const handleUpdate = async (containerId: string) => {
    await onUpdate(containerId);
    onRefresh();
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (container: Container) => {
    const statusConfig: Record<
      string,
      { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }
    > = {
      running: { variant: 'success', label: 'Running' },
      stopped: { variant: 'danger', label: 'Stopped' },
      paused: { variant: 'warning', label: 'Paused' },
      restarting: { variant: 'info', label: 'Restarting' },
      exited: { variant: 'danger', label: 'Exited' },
    };

    const config = statusConfig[container.status] || {
      variant: 'default' as const,
      label: container.status,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Containers</h2>
        </div>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent>
              <div className="h-16 animate-pulse bg-slate-700/50 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="text-2xl font-semibold text-white">Containers</h2>
          <Badge variant={hasUpdates ? 'warning' : 'success'}>
            {hasUpdates
              ? `${containersWithUpdates.length} update${containersWithUpdates.length > 1 ? 's' : ''} available`
              : 'All up to date'}
          </Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button variant="secondary" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" style={{ marginRight: '8px' }} />
            Refresh
          </Button>
          {hasUpdates && (
            <Button
              variant="success"
              size="sm"
              onClick={handleUpdateAll}
              loading={updatingAll}
            >
              <ArrowUpCircle className="w-4 h-4" style={{ marginRight: '8px' }} />
              Update All ({containersWithUpdates.length})
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {containers.map((container) => (
          <ContainerCard
            key={container.id}
            container={container}
            expanded={expandedId === container.id}
            onToggle={() =>
              setExpandedId(expandedId === container.id ? null : container.id)
            }
            onUpdate={() => handleUpdate(container.id)}
            onCopy={copyToClipboard}
            copiedId={copiedId}
            getStatusBadge={getStatusBadge}
          />
        ))}
      </div>

      {containers.length === 0 && (
        <Card>
          <CardContent className="text-center" style={{ padding: '48px 24px' }}>
            <Box className="w-12 h-12 mx-auto text-slate-500" style={{ marginBottom: '16px' }} />
            <p className="text-slate-400">No containers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ContainerCardProps {
  container: Container;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: () => Promise<void>;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  getStatusBadge: (container: Container) => React.ReactNode;
}

function ContainerCard({
  container,
  expanded,
  onToggle,
  onUpdate,
  onCopy,
  copiedId,
  getStatusBadge,
}: ContainerCardProps) {
  const isWatchtower = container.name.toLowerCase().includes('watchtower');

  return (
    <Card className={container.hasUpdate ? 'ring-1 ring-yellow-500/50' : ''}>
      <CardContent style={{ padding: 0 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', cursor: 'pointer' }}
          onClick={onToggle}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flex: 1 }}>
            <div
              style={{ padding: '12px', borderRadius: '8px' }}
              className={container.status === 'running' ? 'bg-green-400/10' : 'bg-slate-700'}
            >
              {container.status === 'running' ? (
                <Play className="w-5 h-5 text-green-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 className="font-medium text-white truncate">
                  {container.name}
                </h3>
                {getStatusBadge(container)}
                {container.hasUpdate && (
                  <Badge variant="warning" size="sm">
                    <ArrowUpCircle className="w-3 h-3" style={{ marginRight: '4px' }} />
                    Update
                  </Badge>
                )}
                {isWatchtower && (
                  <Badge variant="info" size="sm">
                    Watchtower
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-400 truncate" style={{ marginTop: '4px' }}>
                {container.image}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
            {container.hasUpdate && !container.isUpdating && (
              <Button
                variant="success"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate();
                }}
              >
                <ArrowUpCircle className="w-4 h-4 mr-1" />
                Update
              </Button>
            )}
            {container.isUpdating && (
              <Badge variant="info">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Updating...
              </Badge>
            )}
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </div>

        {expanded && (
          <div className="border-t border-slate-700" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }} className="text-sm">
              <div>
                <p className="text-slate-400" style={{ marginBottom: '4px' }}>Container ID</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code className="text-slate-200 bg-slate-700/50 rounded text-xs" style={{ padding: '4px 8px' }}>
                    {container.id.substring(0, 12)}
                  </code>
                  <button
                    className="text-slate-400 hover:text-white transition-colors"
                    onClick={() => onCopy(container.id, `id-${container.id}`)}
                  >
                    {copiedId === `id-${container.id}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-slate-400" style={{ marginBottom: '4px' }}>Image ID</p>
                <code className="text-slate-200 bg-slate-700/50 rounded text-xs" style={{ padding: '4px 8px' }}>
                  {container.imageId.substring(0, 19)}
                </code>
              </div>
              <div>
                <p className="text-slate-400" style={{ marginBottom: '4px' }}>Created</p>
                <p className="text-slate-200">
                  {formatDistanceToNow(new Date(container.created), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div>
                <p className="text-slate-400" style={{ marginBottom: '4px' }}>Ports</p>
                {container.ports.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {container.ports.map((port, i) => (
                      <Badge key={i} variant="default" size="sm">
                        {port.publicPort
                          ? `${port.publicPort}:${port.privatePort}`
                          : port.privatePort}
                        /{port.type}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">None</p>
                )}
              </div>
            </div>

            {container.hasUpdate && container.latestImageId && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <ArrowUpCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium">
                      Update Available
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      New image available:{' '}
                      <code className="bg-slate-700/50 px-1 rounded">
                        {container.latestImageId.substring(0, 19)}
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {Object.keys(container.labels).length > 0 && (
              <div>
                <p className="text-slate-400 mb-2 text-sm">Labels</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(container.labels)
                    .slice(0, 5)
                    .map(([key, value]) => (
                      <Badge key={key} variant="default" size="sm">
                        {key.split('.').pop()}={value}
                      </Badge>
                    ))}
                  {Object.keys(container.labels).length > 5 && (
                    <Badge variant="default" size="sm">
                      +{Object.keys(container.labels).length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4 mr-1" />
                View Logs
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
