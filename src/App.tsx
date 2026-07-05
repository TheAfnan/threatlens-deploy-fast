import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Search, Bell, Menu, ArrowLeft } from 'lucide-react';
import { useUser, useClerk, UserButton } from './clerk-mock';
import { useAppStore } from './lib/store';
import { AnimatePresence } from 'framer-motion';

// Mock data and types imports
import { mockAPKReports, mockAIReports, mockMalwareFamilies } from './mockData';
import { APKReport } from './types';
import { Toaster } from './components/Toaster';
import { CommandPalette } from './components/CommandPalette';
import { PageLoader } from './components/PageLoader';
import { PageTransition } from './components/PageTransition';
import { Logo } from './components/Logo';

// Lazy Subcomponents imports
const LandingPage = lazy(() => import('./components/LandingPage'));
const Docs = lazy(() => import('./components/Docs'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const APKAnalysis = lazy(() => import('./components/APKAnalysis'));
const StaticAnalysis = lazy(() => import('./components/StaticAnalysis'));
const DynamicSandbox = lazy(() => import('./components/DynamicSandbox'));
const ThreatIntel = lazy(() => import('./components/ThreatIntel'));
const FraudMapping = lazy(() => import('./components/FraudMapping'));
const AIInvestigation = lazy(() => import('./components/AIInvestigation'));
const RiskReports = lazy(() => import('./components/RiskReports'));
const ReportPage = lazy(() => import('./components/ReportPage'));
const History = lazy(() => import('./components/History'));
const Settings = lazy(() => import('./components/Settings'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const Pricing = lazy(() => import('./components/Pricing'));
const Legal = lazy(() => import('./components/Legal'));
const Profile = lazy(() => import('./components/Profile'));
const ExtensionRoadmap = lazy(() => import('./components/ExtensionRoadmap'));

// Wrapper to extract :type URL param and pass it to the Legal component
function LegalWrapper({ onBack }: { onBack: () => void }) {
  const { type } = useParams<{ type: string }>();
  return <Legal type={(type as 'privacy' | 'terms') || 'privacy'} onBack={onBack} />;
}

export default function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, isProUser, credits } = useAppStore();

  const [selectedAPKId, setSelectedAPKId] = useState<string | null>('apk-01');
  const [apkReports, setApkReports] = useState<APKReport[]>(mockAPKReports);
  const [aiReports, setAiReports] = useState(mockAIReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardSearchTerm, setDashboardSearchTerm] = useState('');
  // Sidebar starts hidden on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-bold text-slate-500">Loading Secure Core...</div>;
  }

  const handleLogout = () => {
    signOut();
    navigate('/');
    addToast({ title: 'Session Terminated', description: 'Disconnected securely from ThreatLens AI compilers.', type: 'info' });
  };

  const handleAddReport = (newReport: APKReport) => {
    setApkReports(prev => [newReport, ...prev]);
    setSelectedAPKId(newReport.id);
  };

  const handleDeleteReport = (id: string) => {
    setApkReports(prev => prev.filter(r => r.id !== id));
    setSelectedAPKId(prevId => (prevId === id ? null : prevId));
  };

  const handleSelectAPKAndNavigate = (id: string, view: 'report' | 'static' | 'dynamic') => {
    setSelectedAPKId(id);
    if (view === 'report') navigate('/reports');
    else if (view === 'static') navigate('/static-analysis');
    else if (view === 'dynamic') navigate('/sandbox');
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = apkReports.find(
      r => r.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.packageName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      setSelectedAPKId(match.id);
      navigate('/reports');
      addToast({ title: 'Record Found', description: `Redirected to security report of ${match.filename}`, type: 'success' });
    } else {
      addToast({ title: 'No Direct Match', description: `Searching threat feeds for '${searchQuery}'`, type: 'info' });
      navigate('/threat-intel');
    }
    setSearchQuery('');
  };

  const currentView = location.pathname === '/' ? 'landing' : location.pathname.substring(1);
  const isPublicRoute = location.pathname === '/' || location.pathname === '/docs' || location.pathname === '/pricing' || location.pathname.startsWith('/legal');

  return (
    <div className="flex app-bg-container text-slate-800 min-h-screen font-sans relative overflow-hidden" id="applet-viewport">
      <div className="app-bg animate-breathe" />
      <Toaster />
      <CommandPalette />
      
      {isSignedIn && !isPublicRoute && (
        <Suspense fallback={null}>
          <Sidebar 
            currentView={currentView}
            onNavigate={(view) => {
              navigate(`/${view}`);
              // Close sidebar on mobile after navigation
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            onLogout={handleLogout}
            userEmail={user?.primaryEmailAddress?.emailAddress || 'User'}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </Suspense>
      )}

      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto relative z-10">
        {!isSignedIn && !isPublicRoute && (
          <button
            onClick={() => navigate('/')}
            className="fixed top-6 left-6 z-[100] h-10 w-10 bg-white/40 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center text-slate-700 hover:bg-white/60 hover:scale-105 transition-all shadow-glass"
            title="Back to Home"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {isSignedIn && !isPublicRoute && (
          <header className="sticky top-0 bg-white/10 backdrop-blur-3xl border-b border-white/20 h-[72px] px-4 md:px-8 flex items-center justify-between z-20 flex-shrink-0 shadow-glass print:hidden">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="mr-4 p-2 rounded-xl bg-white/20 hover:bg-white/40 transition-colors md:hidden text-slate-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Logo className="w-8 h-8 mr-3 hidden md:block drop-shadow-md" />
              <div className="flex flex-col">
                <h2 className="text-[18px] md:text-[22px] font-black tracking-tight text-slate-800 leading-tight">ThreatLens AI Console</h2>
                <span className="text-[11px] md:text-[13px] text-[#0F357E] font-bold hidden md:block">Secure Compiler</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 md:space-x-8">
              <form onSubmit={handleGlobalSearch} className="relative hidden lg:block w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-[#0f357e] transition-colors" />
                <input 
                  type="text"
                  placeholder="Search... (Press Cmd+K to navigate)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white/20 backdrop-blur-xl border border-white/50 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-[3px] focus:ring-[#0f357e]/30 w-full placeholder-slate-500 transition-all shadow-glass focus:bg-white/40"
                />
              </form>

              <button 
                onClick={() => addToast({ title: 'System Integrity Scan', description: 'No anomalous logs detected in hardware sandbox containers.', type: 'success' })}
                className="text-slate-500 hover:text-slate-700 transition-all cursor-pointer relative hover:scale-110"
              >
                <Bell className="h-[22px] w-[22px]" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-[#DC2626] rounded-full border-2 border-white animate-pulse-ring" />
              </button>

              <div className="flex items-center space-x-3 border-l border-white/30 pl-4 md:pl-8">
                {!isProUser && (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-400/20 to-blue-500/20 border border-sky-400/30 text-sky-700 text-xs font-bold hover:scale-105 transition-transform"
                  >
                    <span>Credits: {credits}/5</span>
                  </button>
                )}
                {isProUser && (
                  <span className="hidden sm:inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm">
                    Pro Max Ultra
                  </span>
                )}
                <div className="flex-col items-end hidden sm:flex">
                  <div className="text-[13px] font-black text-slate-800">{user?.fullName || 'Analyst'}</div>
                  <div className="text-[11px] text-slate-600 font-bold max-w-[120px] truncate">{user?.primaryEmailAddress?.emailAddress}</div>
                </div>
                <div className="shadow-glass transition-transform hover:scale-105 ml-2">
                  <UserButton onNavigateToProfile={() => navigate('/profile')} />
                </div>
              </div>
            </div>
          </header>
        )}

        <main className={`${isSignedIn && !isPublicRoute ? 'p-4 md:p-6 flex-grow max-w-7xl w-full mx-auto pb-12' : 'w-full'}`}>
          <AnimatePresence mode="wait">
            {/* @ts-ignore - React Router v6 Routes doesn't explicitly type the key prop but it's needed for AnimatePresence */}
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={
                !isSignedIn ? (
                  <Suspense fallback={<PageLoader />}><PageTransition><LandingPage 
                    onEnterDashboard={() => navigate('/dashboard')} 
                    onNavigateToDocs={() => navigate('/docs')} 
                    onNavigateToLegal={(type) => navigate(`/legal/${type}`)}
                  /></PageTransition></Suspense>
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } />
              <Route path="/docs" element={<Suspense fallback={<PageLoader />}><PageTransition><Docs onBack={() => navigate('/')} /></PageTransition></Suspense>} />
              <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><PageTransition><Pricing onBack={() => navigate('/')} /></PageTransition></Suspense>} />
              <Route path="/legal/:type" element={<Suspense fallback={<PageLoader />}><PageTransition><LegalWrapper onBack={() => navigate('/')} /></PageTransition></Suspense>} />
              <Route path="/extension-roadmap" element={<Suspense fallback={<PageLoader />}><PageTransition><ExtensionRoadmap onBack={() => navigate('/')} /></PageTransition></Suspense>} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <Suspense fallback={<PageLoader />}><PageTransition><Dashboard 
                  apkReports={apkReports}
                  malwareFamilies={mockMalwareFamilies}
                  onSelectAPK={handleSelectAPKAndNavigate}
                  onNavigateToUpload={() => navigate('/analyze')}
                  onSearch={setDashboardSearchTerm}
                  searchTerm={dashboardSearchTerm}
                /></PageTransition></Suspense>
              } />
              <Route path="/analyze" element={
                <Suspense fallback={<PageLoader />}><PageTransition><APKAnalysis 
                  apkReports={apkReports}
                  onAddReport={handleAddReport}
                  onSelectAPK={handleSelectAPKAndNavigate}
                  triggerToast={(t, d, typ) => addToast({ title: t, description: d, type: typ as any })}
                /></PageTransition></Suspense>
              } />
              <Route path="/static-analysis" element={
                <Suspense fallback={<PageLoader />}><PageTransition><StaticAnalysis 
                  apkReports={apkReports}
                  selectedAPKId={selectedAPKId}
                  onSelectAPK={setSelectedAPKId}
                /></PageTransition></Suspense>
              } />
              <Route path="/sandbox" element={
                <Suspense fallback={<PageLoader />}><PageTransition><DynamicSandbox 
                  apkReports={apkReports}
                  selectedAPKId={selectedAPKId}
                  onSelectAPK={setSelectedAPKId}
                  triggerToast={(t, d, typ) => addToast({ title: t, description: d, type: typ as any })}
                  onUpgrade={() => navigate('/pricing')}
                /></PageTransition></Suspense>
              } />
              <Route path="/threat-intel" element={<Suspense fallback={<PageLoader />}><PageTransition><ThreatIntel onUpgrade={() => navigate('/pricing')} /></PageTransition></Suspense>} />
              <Route path="/fraud" element={<Suspense fallback={<PageLoader />}><PageTransition><FraudMapping /></PageTransition></Suspense>} />
              <Route path="/investigate" element={
                <Suspense fallback={<PageLoader />}><PageTransition><AIInvestigation 
                  apkReports={apkReports}
                  aiReports={aiReports}
                  selectedAPKId={selectedAPKId}
                  onSelectAPK={setSelectedAPKId}
                  triggerToast={(t, d, typ) => addToast({ title: t, description: d, type: typ as any })}
                  onUpgrade={() => navigate('/pricing')}
                /></PageTransition></Suspense>
              } />
              <Route path="/risk" element={
                <Suspense fallback={<PageLoader />}><PageTransition><RiskReports 
                  apkReports={apkReports}
                  selectedAPKId={selectedAPKId}
                  onSelectAPK={setSelectedAPKId}
                  onNavigateToReport={(id) => {
                    setSelectedAPKId(id);
                    navigate('/reports');
                  }}
                /></PageTransition></Suspense>
              } />
              <Route path="/reports" element={
                <Suspense fallback={<PageLoader />}><PageTransition><ReportPage 
                  apkReports={apkReports}
                  selectedAPKId={selectedAPKId}
                  onSelectAPK={setSelectedAPKId}
                  triggerToast={(t, d, typ) => addToast({ title: t, description: d, type: typ as any })}
                /></PageTransition></Suspense>
              } />
              <Route path="/history" element={
                <Suspense fallback={<PageLoader />}><PageTransition><History 
                  apkReports={apkReports}
                  onSelectAPK={handleSelectAPKAndNavigate}
                  onDeleteReport={handleDeleteReport}
                  triggerToast={(t, d, typ) => addToast({ title: t, description: d, type: typ as any })}
                /></PageTransition></Suspense>
              } />
              <Route path="/settings" element={
                <Suspense fallback={<PageLoader />}><PageTransition><Settings triggerToast={(t, d, typ) => addToast({ title: t, description: d, type: typ as any })} /></PageTransition></Suspense>
              } />
              <Route path="/profile" element={
                <Suspense fallback={<PageLoader />}><PageTransition><Profile 
                  user={{
                    fullName: user?.fullName || 'Security Analyst',
                    email: user?.primaryEmailAddress?.emailAddress || null,
                    photoURL: user?.photoURL || null,
                    creationTime: user?.creationTime,
                    lastSignInTime: user?.lastSignInTime,
                    providerId: user?.providerId || 'password'
                  }}
                  apkReports={apkReports}
                  onSignOut={handleLogout}
                  triggerToast={(t, d, typ) => addToast({ title: t, description: d, type: typ as any })}
                /></PageTransition></Suspense>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
