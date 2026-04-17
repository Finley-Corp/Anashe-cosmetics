import { NotificationsTestPanel } from './NotificationsTestPanel';

export const metadata = { title: 'Settings — Anashe Admin' };

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Verify and test notification integrations.</p>
      </div>
      <NotificationsTestPanel />
    </div>
  );
}
