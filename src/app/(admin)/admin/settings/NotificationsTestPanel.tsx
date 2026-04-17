'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Send } from 'lucide-react';

type ConfigStatus = {
  tilil: Record<string, string>;
  resend: Record<string, string>;
  smsReady: boolean;
};

type TestResult = {
  success?: boolean;
  mobile?: string;
  httpStatus?: number;
  tilil?: unknown;
  error?: string;
  missing?: Record<string, boolean>;
};

function StatusRow({ label, value }: { label: string; value: string }) {
  const ok = value.startsWith('✓');
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span className="mt-0.5 shrink-0">
        {ok ? (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400" />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-mono font-semibold text-gray-300">{label}</p>
        <p className={`text-xs mt-0.5 ${ok ? 'text-gray-500' : 'text-red-400 font-semibold'}`}>{value}</p>
      </div>
    </div>
  );
}

export function NotificationsTestPanel() {
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    fetch('/api/admin/test-notifications')
      .then((r) => r.json())
      .then((d: ConfigStatus) => setConfig(d))
      .catch(() => setConfig(null))
      .finally(() => setLoadingConfig(false));
  }, []);

  async function sendTestSms() {
    if (!phone.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/test-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = (await res.json()) as TestResult;
      setResult(data);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Config check */}
      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-semibold text-white mb-1">Environment Variables</p>
        <p className="text-xs text-gray-500 mb-4">
          These must be set in your Vercel dashboard (not just .env.local) for production to work.
        </p>

        {loadingConfig ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Checking…
          </div>
        ) : config ? (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2 font-semibold">TILIL SMS</p>
              {Object.entries(config.tilil).map(([k, v]) => (
                <StatusRow key={k} label={k} value={v} />
              ))}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2 font-semibold">Resend Email</p>
              {Object.entries(config.resend).map(([k, v]) => (
                <StatusRow key={k} label={k} value={v} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-400">Failed to load config.</p>
        )}
      </div>

      {/* SMS test */}
      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-semibold text-white mb-1">Send Test SMS</p>
        <p className="text-xs text-gray-500 mb-4">
          Fires a real SMS via TILIL directly from this environment. Use a Kenyan number like 0712345678.
        </p>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0712345678"
            className="flex-1 h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={() => void sendTestSms()}
            disabled={sending || !phone.trim()}
            className="h-10 px-4 flex items-center gap-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </button>
        </div>

        {result && (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#121417] p-4 text-xs font-mono text-gray-300 whitespace-pre-wrap break-all">
            {JSON.stringify(result, null, 2)}
          </div>
        )}
      </div>

      {/* Vercel instructions */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
        <p className="text-sm font-semibold text-yellow-300 mb-2">Vercel Environment Variables</p>
        <p className="text-xs text-yellow-200/70 leading-relaxed">
          If config shows variables as MISSING in production, add them in:
          <br />
          <strong className="text-yellow-200">Vercel → Project → Settings → Environment Variables</strong>
          <br /><br />
          Required variables:
        </p>
        <ul className="mt-2 space-y-1">
          {['SMS_ENDPOINT', 'TILIL_API_KEY', 'TILIL_SHORTCODE', 'RESEND_API_KEY'].map((v) => (
            <li key={v} className="text-xs font-mono text-yellow-300">• {v}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
