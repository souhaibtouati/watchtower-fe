import { Header, StatusDashboard, ContainerList, UpdateLogs } from './components';
import { useContainers, useWatchtowerStatus, useUpdateLogs } from './hooks/useWatchtower';

function App() {
  const {
    containers,
    loading: containersLoading,
    refetch: refetchContainers,
    updateContainer,
    updateAllContainers,
  } = useContainers();

  const {
    status,
    loading: statusLoading,
    refetch: refetchStatus,
    forceCheck,
  } = useWatchtowerStatus();

  const { logs, loading: logsLoading, refetch: refetchLogs } = useUpdateLogs();

  const handleRefreshAll = () => {
    refetchContainers();
    refetchStatus();
    refetchLogs();
  };

  return (
    <div className="min-h-screen w-full bg-slate-900">
      <Header isConnected={status?.isRunning ?? false} />
      
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Status Dashboard */}
          <StatusDashboard
            status={status}
            loading={statusLoading}
            onForceCheck={forceCheck}
            onRefresh={handleRefreshAll}
          />

          {/* Main Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {/* Container List - Takes 2 columns */}
            <div style={{ gridColumn: 'span 2' }}>
              <ContainerList
                containers={containers}
                loading={containersLoading}
                onUpdate={updateContainer}
                onUpdateAll={updateAllContainers}
                onRefresh={refetchContainers}
              />
            </div>

            {/* Update Logs - Takes 1 column */}
            <div style={{ gridColumn: 'span 1' }}>
              <UpdateLogs logs={logs} loading={logsLoading} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800" style={{ marginTop: '48px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 32px' }}>
          <p className="text-center text-sm text-slate-500">
            Watchtower Frontend • Manage your Docker container updates with ease
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
