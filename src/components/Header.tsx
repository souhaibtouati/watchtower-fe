import { Droplets } from 'lucide-react';

interface HeaderProps {
  isConnected?: boolean;
}

export function Header({ isConnected = true }: HeaderProps) {
  return (
    <header className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-10">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="bg-blue-600 rounded-lg" style={{ padding: '8px' }}>
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Watchtower</h1>
              <p className="text-xs text-slate-400">Container Update Manager</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{ width: '8px', height: '8px', borderRadius: '50%' }}
              className={isConnected ? 'bg-green-400' : 'bg-red-400'}
            />
            <span className="text-sm text-slate-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
