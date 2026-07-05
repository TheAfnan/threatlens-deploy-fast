import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Shield,
  Clock,
  LogOut,
  Trash2,
  Bell,
  Key,
  Activity,
  FileText,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface ProfileProps {
  user: {
    fullName: string | null;
    email: string | null;
    photoURL: string | null;
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
    providerId: string;
  };
  apkReports: { riskLevel: string; aiReport?: unknown }[];
  onSignOut: () => void;
  triggerToast: (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

function formatTimestamp(raw: string | undefined): string {
  if (!raw) return '—';
  const date = new Date(raw);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(email: string | null): string {
  if (!email) return 'SA';
  return email.slice(0, 2).toUpperCase();
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

export default function Profile({ user, apkReports, onSignOut, triggerToast }: ProfileProps) {
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [apiAccess, setApiAccess] = useState(false);

  const isGoogle = user.providerId === 'google.com';
  const displayName = user.fullName || 'Security Analyst';

  const handleToggle = (
    label: string,
    current: boolean,
    setter: (v: boolean) => void,
  ) => {
    setter(!current);
    triggerToast(
      `${label} ${!current ? 'Enabled' : 'Disabled'}`,
      `${label} has been ${!current ? 'enabled' : 'disabled'} for your account.`,
      !current ? 'success' : 'info',
    );
  };

  const reportsGenerated = apkReports.length;
  const aiInvestigations = apkReports.filter(r => r.aiReport).length;
  const threatsDetected = apkReports.filter(r => r.riskLevel !== 'Safe').length;

  const stats = [
    { label: 'Reports Generated', value: reportsGenerated, icon: FileText, color: '#2563EB' },
    { label: 'AI Investigations', value: aiInvestigations, icon: Activity, color: '#8B5CF6' },
    { label: 'Threats Detected', value: threatsDetected, icon: AlertTriangle, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 font-sans text-[#0F172A]">
      {/* Page Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Account Profile</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your identity, sessions, and security preferences
          </p>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono bg-[#16A34A]/10 px-3 py-1.5 rounded-lg border border-[#16A34A]/10 text-[#16A34A] font-bold">
          <Shield className="h-3.5 w-3.5" />
          <span>IDENTITY_CORE: VERIFIED</span>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="bg-white/20 backdrop-blur-xl p-6 rounded-xl border border-[#E2E8F0] shadow-glass flex flex-col sm:flex-row items-center sm:items-start gap-5"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-[#2563EB]/30 ring-offset-2 shrink-0"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-[#2563EB]/10 border-2 border-[#2563EB]/30 flex items-center justify-center text-2xl font-extrabold text-[#2563EB] shrink-0">
            {getInitials(user.email)}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <h3 className="text-lg font-extrabold tracking-tight">{displayName}</h3>
          <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {user.email || 'No email on file'}
          </p>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
              isGoogle
                ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/10'
                : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/10'
            }`}
          >
            {isGoogle ? (
              <>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
                </svg>
                Google Account
              </>
            ) : (
              <>
                <Mail className="h-3 w-3" />
                Email Account
              </>
            )}
          </span>
        </div>

        <button
          onClick={() => triggerToast('Coming Soon', 'Profile editing will be available in a future update.', 'info')}
          className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/10 rounded-lg hover:bg-[#2563EB]/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <User className="h-3.5 w-3.5" />
          Edit Profile
        </button>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Session Information */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-4"
          >
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[#2563EB]" />
              <span>Session Information</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-[#E2E8F0]/60">
                <span className="text-xs font-bold text-slate-600">Account Created</span>
                <span className="text-xs font-semibold text-slate-800 font-mono">
                  {formatTimestamp(user.creationTime)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-[#E2E8F0]/60">
                <span className="text-xs font-bold text-slate-600">Last Sign In</span>
                <span className="text-xs font-semibold text-slate-800 font-mono">
                  {formatTimestamp(user.lastSignInTime)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-[#E2E8F0]/60">
                <span className="text-xs font-bold text-slate-600">Auth Provider</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  {isGoogle ? (
                    <>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#2563EB]" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
                      </svg>
                      Google
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5 text-[#F59E0B]" />
                      Email / Password
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-[#E2E8F0]/60">
                <span className="text-xs font-bold text-slate-600">Session Status</span>
                <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
                  </span>
                  Active
                </span>
              </div>
            </div>
          </motion.div>

          {/* Usage Statistics */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-4"
          >
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#8B5CF6]" />
              <span>Usage Statistics</span>
            </h3>

            <div className="space-y-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-[#E2E8F0]/60"
                >
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                    {stat.label}
                  </span>
                  <span className="text-sm font-extrabold font-mono" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security Settings */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-4"
          >
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-[#16A34A]" />
              <span>Security Settings</span>
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Two-Factor Authentication', icon: Key, value: twoFactor, setter: setTwoFactor, desc: 'Add an extra layer of account security' },
                { label: 'Email Notifications', icon: Bell, value: emailNotifs, setter: setEmailNotifs, desc: 'Receive threat alerts via email' },
                { label: 'API Access', icon: ChevronRight, value: apiAccess, setter: setApiAccess, desc: 'Enable external API integrations' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleToggle(item.label, item.value, item.setter)}
                  className="w-full p-3 bg-white/30 rounded-lg border border-[#E2E8F0]/60 flex items-center justify-between transition-all hover:bg-white/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-[#2563EB]" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-700 block">{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                  <div
                    className={`relative w-10 h-5.5 rounded-full transition-colors ${
                      item.value ? 'bg-[#16A34A]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform ${
                        item.value ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#DC2626]/30 shadow-glass space-y-4"
          >
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#DC2626] flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Danger Zone</span>
            </h3>

            <div className="space-y-3">
              <button
                onClick={onSignOut}
                className="w-full p-3 border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs font-bold transition-all hover:bg-[#DC2626]/5 hover:border-[#DC2626]/30 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-slate-700">
                  <LogOut className="h-4 w-4 text-[#DC2626]" />
                  Sign Out
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                onClick={() =>
                  triggerToast(
                    'Account Deletion',
                    'Please contact your SOC administrator to request account deletion.',
                    'error',
                  )
                }
                className="w-full p-3 border border-[#DC2626]/20 bg-[#DC2626]/5 rounded-xl flex items-center justify-between text-xs font-bold transition-all hover:bg-[#DC2626]/10 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-[#DC2626]">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </span>
                <ChevronRight className="h-4 w-4 text-[#DC2626]/50" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
