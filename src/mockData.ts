import { APKReport, MalwareFamily, ThreatIndicator, TimelineEvent, BankingThreatScenario, AIReport } from './types';

export const mockMalwareFamilies: MalwareFamily[] = [
  {
    id: 'fam-01',
    name: 'Sova Botnet V5',
    type: 'Banking Trojan & Ransomware',
    firstSeen: '2022-09-14',
    primaryTargets: ['SBI Yono', 'HDFC MobileBanking', 'ICICI iMobile', 'Axis Mobile'],
    severity: 'Critical',
    description: 'Advanced Android banking trojan capable of credential harvesting via overlay screens, session hijacking, cookie stealing, and local file encryption (ransomware mode). Specifically targets Indian UPI apps and banking portals.',
    detectionRate: '98.4%'
  },
  {
    id: 'fam-02',
    name: 'Xenomorph Trojan v3',
    type: 'Automated Transfer System (ATS)',
    firstSeen: '2023-02-01',
    primaryTargets: ['KMP Mobile', 'SBI Quick', 'Baroda M-Connect Plus', 'Canara ai1'],
    severity: 'Critical',
    description: 'Highly modular malware utilizing Android Accessibility Services to automate transaction interception, OTP harvesting, and fund exfiltration. Bypasses standard two-factor authentication silently.',
    detectionRate: '96.2%'
  },
  {
    id: 'fam-03',
    name: 'Anubis Spyware v2.4',
    type: 'Remote Access Tool (RAT)',
    firstSeen: '2020-05-18',
    primaryTargets: ['HDFC Bank Mobile', 'ICICI iMobile', 'Union Bank Mobile'],
    severity: 'High',
    description: 'Classic banking Trojan evolved into a full-scale RAT. Captures screen recordings, logs keypresses, forwards incoming SMS packets (containing OTPs), and triggers lock-screens for credential phishing.',
    detectionRate: '94.1%'
  },
  {
    id: 'fam-04',
    name: 'SharkBot Lite',
    type: 'ATS & Dropper',
    firstSeen: '2021-11-03',
    primaryTargets: ['BHIM UPI', 'Google Pay', 'PhonePe', 'Paytm', 'SBI Pay'],
    severity: 'Critical',
    description: 'Injects fake overlay screens on top of legal financial applications. Features an automatic transfer engine that processes instant money transfers out of UPI accounts when the device is idle.',
    detectionRate: '97.8%'
  },
  {
    id: 'fam-05',
    name: 'Medusa SpyBot',
    type: 'Keylogger & Screen Overlay',
    firstSeen: '2020-07-22',
    primaryTargets: ['Kotak Mobile Banking', 'IPPB Mobile', 'BOI Mobile', 'PNB One'],
    severity: 'High',
    description: 'Specializes in harvesting credentials via customized overlays for Indian Public Sector Bank apps. Actively abuses accessibility permissions to prevent uninstallation.',
    detectionRate: '92.5%'
  }
];

export const mockThreatIndicators: ThreatIndicator[] = [
  { id: 'ind-01', type: 'IP', value: '185.220.101.42', threatActor: 'Lazarus Android Wing', associatedMalware: 'Sova Botnet v5', source: 'CERT-In', confidence: 95, status: 'Active' },
  { id: 'ind-02', type: 'Domain', value: 'secure-sbi-update-yono.com', threatActor: 'PhishGang India', associatedMalware: 'Sova Botnet v5', source: 'VirusTotal', confidence: 99, status: 'Active' },
  { id: 'ind-03', type: 'IP', value: '45.138.172.90', threatActor: 'Unknown Trojan Operator', associatedMalware: 'Xenomorph Trojan', source: 'MITRE ATT&CK', confidence: 88, status: 'Active' },
  { id: 'ind-04', type: 'Domain', value: 'api.hdfc-kyc-verify.net', threatActor: 'Aura Threat Group', associatedMalware: 'Anubis RAT', source: 'CERT-In', confidence: 97, status: 'Active' },
  { id: 'ind-05', type: 'Hash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', threatActor: 'Medusa Campaign', associatedMalware: 'Medusa SpyBot', source: 'VirusTotal', confidence: 100, status: 'Active' },
  { id: 'ind-06', type: 'IP', value: '193.109.246.5', threatActor: 'Lazarus Android Wing', associatedMalware: 'Sova Botnet v5', source: 'MITRE ATT&CK', confidence: 92, status: 'Active' },
  { id: 'ind-07', type: 'Domain', value: 'icici-security-patch.org', threatActor: 'PhishGang India', associatedMalware: 'Xenomorph Trojan v3', source: 'CERT-In', confidence: 94, status: 'Active' },
  { id: 'ind-08', type: 'Domain', value: 'upiasp-bhim-login.in', threatActor: 'UPI Fraud Ring', associatedMalware: 'SharkBot Lite', source: 'CERT-In', confidence: 91, status: 'Active' },
  { id: 'ind-09', type: 'Hash', value: '8f4e2c3a5b6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f', threatActor: 'Xenomorph Operators', associatedMalware: 'Xenomorph Trojan v3', source: 'YARA Rule Team', confidence: 98, status: 'Active' },
  { id: 'ind-10', type: 'Certificate', value: 'CN=Android Debug, O=Android, C=US (SHA256: 3a9c7b...)', threatActor: 'Generic Spammer', associatedMalware: 'Generic Adware', source: 'VirusTotal', confidence: 75, status: 'Under Observation' },
  { id: 'ind-11', type: 'IP', value: '103.88.221.41', threatActor: 'Medusa Campaign', associatedMalware: 'Medusa SpyBot', source: 'CERT-In', confidence: 89, status: 'Active' },
  { id: 'ind-12', type: 'Domain', value: 'axis-net-verify-portal.in', threatActor: 'PhishGang India', associatedMalware: 'Sova Botnet v5', source: 'CERT-In', confidence: 96, status: 'Active' },
  { id: 'ind-13', type: 'IP', value: '85.114.135.24', threatActor: 'Lazarus Android Wing', associatedMalware: 'Anubis Spyware', source: 'MITRE ATT&CK', confidence: 90, status: 'Mitigated' },
  { id: 'ind-14', type: 'Domain', value: 'pnb-one-kyc.net', threatActor: 'UPI Fraud Ring', associatedMalware: 'Medusa SpyBot', source: 'CERT-In', confidence: 93, status: 'Active' },
  { id: 'ind-15', type: 'IP', value: '194.58.112.33', threatActor: 'Unknown Trojan Operator', associatedMalware: 'SharkBot Lite', source: 'VirusTotal', confidence: 85, status: 'Active' },
  { id: 'ind-16', type: 'Domain', value: 'boi-mobile-secure.co.in', threatActor: 'PhishGang India', associatedMalware: 'Sova Botnet v5', source: 'CERT-In', confidence: 95, status: 'Active' },
  { id: 'ind-17', type: 'Hash', value: '2d3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d', threatActor: 'Aura Threat Group', associatedMalware: 'Anubis Spyware v2.4', source: 'YARA Rule Team', confidence: 96, status: 'Active' },
  { id: 'ind-18', type: 'IP', value: '5.188.10.22', threatActor: 'Medusa Campaign', associatedMalware: 'Medusa SpyBot', source: 'MITRE ATT&CK', confidence: 91, status: 'Active' },
  { id: 'ind-19', type: 'Domain', value: 'canara-update-ai1.info', threatActor: 'Xenomorph Operators', associatedMalware: 'Xenomorph Trojan v3', source: 'CERT-In', confidence: 95, status: 'Active' },
  { id: 'ind-20', type: 'IP', value: '91.241.19.102', threatActor: 'Lazarus Android Wing', associatedMalware: 'Sova Botnet v5', source: 'VirusTotal', confidence: 94, status: 'Active' },
  { id: 'ind-21', type: 'Domain', value: 'kotak-support-kyc.com', threatActor: 'PhishGang India', associatedMalware: 'Medusa SpyBot', source: 'CERT-In', confidence: 92, status: 'Active' },
  { id: 'ind-22', type: 'Hash', value: 'f1e2d3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100', threatActor: 'SharkBot Crew', associatedMalware: 'SharkBot Lite', source: 'YARA Rule Team', confidence: 99, status: 'Active' },
  { id: 'ind-23', type: 'IP', value: '185.190.140.75', threatActor: 'PhishGang India', associatedMalware: 'Sova Botnet v5', source: 'MITRE ATT&CK', confidence: 87, status: 'Active' },
  { id: 'ind-24', type: 'Domain', value: 'bhim-upi-reward.net', threatActor: 'UPI Fraud Ring', associatedMalware: 'SharkBot Lite', source: 'CERT-In', confidence: 96, status: 'Active' },
  { id: 'ind-25', type: 'Certificate', value: 'CN=YonoSBI Bypass Signer, O=YonoBypass, C=IN', threatActor: 'PhishGang India', associatedMalware: 'Sova Botnet v5', source: 'YARA Rule Team', confidence: 98, status: 'Active' }
];

export const mockTimelineEvents: TimelineEvent[] = [
  { id: 'ev-01', timestamp: '10:00:01', type: 'System', action: 'Process Launch', details: 'Application launched as process ID 12845 (package: com.yono.sbi.banking.secure)', severity: 'Info' },
  { id: 'ev-02', timestamp: '10:00:03', type: 'System', action: 'API Binding', details: 'Binds to Android Accessibility Service framework (accessibility_id: 42)', severity: 'Warning' },
  { id: 'ev-03', timestamp: '10:00:05', type: 'Accessibility', action: 'Abuse Detected', details: 'Requested WRITE_SECURE_SETTINGS & enabled overlay listeners silently', severity: 'Critical' },
  { id: 'ev-04', timestamp: '10:00:09', type: 'Network', action: 'C2 Handshake', details: 'Initiated TLS connection to remote C2 domain secure-sbi-update-yono.com', severity: 'Critical' },
  { id: 'ev-05', timestamp: '10:00:12', type: 'File', action: 'Resource Injection', details: 'Downloaded compressed payload "assets_enc.bin" and unpacked to private database path', severity: 'Warning' },
  { id: 'ev-06', timestamp: '10:00:15', type: 'Overlay', action: 'Overlay Attack Triggered', details: 'Detected Foreground App launch of "com.sbi.yono". Spawned target window overlay matching Yono login.', severity: 'Critical' },
  { id: 'ev-07', timestamp: '10:00:18', type: 'SMS', action: 'Interception Configured', details: 'Registered content observer on content://sms/inbox to capture incoming OTP messages.', severity: 'Critical' },
  { id: 'ev-08', timestamp: '10:00:22', type: 'SMS', action: 'OTP Exfiltrated', details: 'Intercepted SMS from VK-SBI_IN: "Your OTP is 482931". Forwarded details to C2 server.', severity: 'Critical' },
  { id: 'ev-09', timestamp: '10:00:26', type: 'System', action: 'Persistence Check', details: 'Hooked BOOT_COMPLETED intent and created dual alarm-service loops.', severity: 'Warning' },
  { id: 'ev-10', timestamp: '10:00:30', type: 'Network', action: 'Sensitive Data Upload', details: 'Exfiltrated contact list (412 items) and device hardware fingerprint via HTTPS POST.', severity: 'Warning' },
  { id: 'ev-11', timestamp: '10:00:35', type: 'System', action: 'Bypass attempt', details: 'Checked root access via Superuser.apk search & Magisk daemon verification.', severity: 'Info' },
  { id: 'ev-12', timestamp: '10:00:40', type: 'File', action: 'Clipboard Harvest', details: 'Read system clipboard: "SBI Transaction Password: Hdfc@9211". Sent to C2.', severity: 'Critical' },
  { id: 'ev-13', timestamp: '10:00:44', type: 'System', action: 'Uninstall Prevention', details: 'Intercepted Android Settings app launching. Blocked Settings page when user attempted to disable device admin.', severity: 'Critical' },
  { id: 'ev-14', timestamp: '10:00:48', type: 'Overlay', action: 'UPI Intercept', details: 'Detected BHIM app launcher. Overlaid fake GPay transaction prompt for ₹25,000 to "merchant.upi.fraud@icici".', severity: 'Critical' },
  { id: 'ev-15', timestamp: '10:00:52', type: 'Network', action: 'Port Scan', details: 'Probed localhost network ports (80, 443, 8080) for active debugger software.', severity: 'Info' },
  { id: 'ev-16', timestamp: '10:00:57', type: 'System', action: 'Keylogger Start', details: 'Registered touch-coordinate capture service via accessibility dispatch.', severity: 'Critical' },
  { id: 'ev-17', timestamp: '10:01:02', type: 'System', action: 'Screen Recorder', details: 'Initialized MediaProjection session to record banking credential input fields.', severity: 'Critical' },
  { id: 'ev-18', timestamp: '10:01:08', type: 'System', action: 'Notification Blocking', details: 'Suppressed push alerts from SBI Yono to hide fraudulent withdrawal notifications.', severity: 'Critical' },
  { id: 'ev-19', timestamp: '10:01:15', type: 'Network', action: 'Heartbeat Send', details: 'Dispatched standard state telemetry heartbeat to 185.220.101.42:443.', severity: 'Info' },
  { id: 'ev-20', timestamp: '10:01:20', type: 'System', action: 'Self Protection', details: 'Wiped logcat traces and cleared sandbox environment files upon dynamic debug alert.', severity: 'Warning' }
];

export const mockBankingThreatScenarios: BankingThreatScenario[] = [
  { id: 'scen-01', name: 'Fake Yono SBI APK Upgrade', description: 'SMS campaign urging customers to download an .APK file to complete mandatory KYC updates, which replaces or mimics SBI Yono app.', targetBanks: ['State Bank of India (SBI)'], threatVector: 'Phishing SMS + Sova Dropper', mitigation: 'Block SMS links, monitor lookalike domains, enforce Google Play Protect checks.' },
  { id: 'scen-02', name: 'HDFC Security App Overlay', description: 'A fake security scanner app triggers transparent login overlays when the legitimate HDFC Mobile Banking application is opened.', targetBanks: ['HDFC Bank'], threatVector: 'Accessibility overlay injection', mitigation: 'Implement overlay-prevention APIs inside HDFC Mobile app, detect active overlays.' },
  { id: 'scen-03', name: 'ICICI UPI Reward Phishing', description: 'Scam campaign offering cash rewards on ICICI UPI. Users install an APK that launches automated transfer mechanisms behind GPay/BHIM.', targetBanks: ['ICICI Bank', 'BHIM UPI'], threatVector: 'ATS (Automated Transfer System)', mitigation: 'Incorporate transaction-delay protections and active accessibility detection on the payment screens.' },
  { id: 'scen-04', name: 'Axis KYC Verification RAT', description: 'Malware binds to official Axis Mobile login and records keystrokes. Captures OTP via SMS permission abuse.', targetBanks: ['Axis Bank'], threatVector: 'RAT Keylogger & SMS Sniffer', mitigation: 'Restrict SMS access permissions, deploy secure soft keyboards, flag generic debug signatures.' },
  { id: 'scen-05', name: 'BOI Mobile Double Screen', description: 'Draws a fraudulent OTP extraction overlay over BOI Mobile banking app during authentication loops.', targetBanks: ['Bank of India (BOI)'], threatVector: 'Screen Overlay + OTP interception', mitigation: 'Suppress background accessibility services, implement window flags secure.' },
  { id: 'scen-06', name: 'Kotak 811 Verification Trojan', description: 'Promotes an app called "Kotak 811 Helper" which is Sova botnet designed to execute UPI commands automatically.', targetBanks: ['Kotak Mahindra Bank'], threatVector: 'UPI Auto-execution botnet', mitigation: 'Monitor fake helper applications on alternative app stores, verify app installer signatures.' },
  { id: 'scen-07', name: 'Baroda m-Connect Accessibility Abuse', description: 'Trojan gains accessibility permissions on pretense of system optimization, then intercepts Baroda login.', targetBanks: ['Bank of Baroda'], threatVector: 'Accessibility API Exploitation', mitigation: 'Reject login if active unknown accessibility services are enabled on the phone.' },
  { id: 'scen-08', name: 'Canara ai1 SMS Forwarder', description: 'Lightweight spyware hiding inside utility apps designed strictly to capture OTPs from Canara Bank.', targetBanks: ['Canara Bank'], threatVector: 'SMS Interceptor & RAT', mitigation: 'Transition to in-app secure push tokens instead of SMS-based OTP verification.' },
  { id: 'scen-09', name: 'PNB One Credential Phisher', description: 'In-app browser (WebView) injection designed to load fake login screens for PNB Mobile users.', targetBanks: ['Punjab National Bank (PNB)'], threatVector: 'Phishing WebViews', mitigation: 'Enforce strict SSL checking, block third-party WebView URL loading to unapproved domains.' },
  { id: 'scen-10', name: 'Union Bank Assistant RAT', description: 'Provides remote desktop mirroring to scam callers using MediaProjection API, bypassing device controls.', targetBanks: ['Union Bank of India'], threatVector: 'MediaProjection Screen Mirroring', mitigation: 'Trigger warning banners when active screen recording or mirroring APIs are running.' },
  { id: 'scen-11', name: 'Indian Bank Instant Loan Fraud', description: 'Deceptive loan APK harvests contacts and uploads them to extort money from vulnerable users.', targetBanks: ['Indian Bank'], threatVector: 'Contact harvesting & Extortion RAT', mitigation: 'Verify app reputation before letting UPI link bindings, audit broad storage permissions.' },
  { id: 'scen-12', name: 'UCO Bank SMS Forwarding Loop', description: 'Disguised SMS router app transfers critical credit card verification messages silently over HTTP API.', targetBanks: ['UCO Bank'], threatVector: 'Quiet SMS Forwarder', mitigation: 'Warn users when non-default SMS apps are installed and performing internet requests.' },
  { id: 'scen-13', name: 'IDFC First Overlay Prompt', description: 'Injects persistent banking overlay when IDFC app gains focus, requesting complete ATM pin details.', targetBanks: ['IDFC FIRST Bank'], threatVector: 'Phishing Overlay UI', mitigation: 'Use window secure attributes to mask PIN screens from overlays and screenshots.' },
  { id: 'scen-14', name: 'Federal Bank OTP Interceptor', description: 'Xenomorph variant intercepting transaction authorization codes to transfer funds to dynamic UPI IDs.', targetBanks: ['Federal Bank'], threatVector: 'Automated Transaction Execution', mitigation: 'Validate and bind biometric fingerprints for transaction authorization instead of pin/SMS.' },
  { id: 'scen-15', name: 'Central Bank of India Helper', description: 'Fake help desk app mirroring support channels while hijacking clipboard and SMS stores.', targetBanks: ['Central Bank of India'], threatVector: 'Remote access hijacking', mitigation: 'Identify lookalike customer service numbers, flag unofficial launcher downloads.' }
];

export const mockAPKReports: APKReport[] = [
  {
    id: 'apk-01',
    filename: 'SBI_Yono_Mandatory_Upgrade_2026.apk',
    packageName: 'com.yono.sbi.banking.secure',
    version: '4.8.2',
    size: '14.8 MB',
    hash: '8f4e2c3a5b6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    riskScore: 94,
    riskLevel: 'Critical',
    status: 'Completed',
    uploadedAt: '2026-06-29 10:12:35',
    certInfo: {
      issuer: 'CN=YonoSBI Bypass Signer, O=YonoBypass, C=IN',
      serialNumber: '7c8936ef11029ba',
      validFrom: '2026-01-10',
      validTo: '2036-01-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['DexGuard Obfuscation', 'Reflection API', 'String Encryption'],
      riskFactor: 'High'
    },
    permissions: [
      { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Allows app to receive SMS messages.', abuseScenario: 'Used to intercept bank transaction OTP codes silently.' },
      { name: 'android.permission.READ_SMS', dangerous: true, description: 'Allows app to read saved SMS messages.', abuseScenario: 'Harvests transaction history to estimate account balances.' },
      { name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', dangerous: true, description: 'Grants control of on-screen elements.', abuseScenario: 'Logs user keystrokes, prevents uninstall, and draws overlay screens.' },
      { name: 'android.permission.SYSTEM_ALERT_WINDOW', dangerous: true, description: 'Allows drawing windows on top of other apps.', abuseScenario: 'Launches transparent phishing overlays over genuine bank apps.' },
      { name: 'android.permission.INTERNET', dangerous: false, description: 'Allows internet access.', abuseScenario: 'Exfiltrates captured credentials to remote command servers.' }
    ],
    manifest: {
      activities: ['.MainActivity', '.UpgradeWizardActivity', '.OverlayTemplateActivity', '.PhishPortal'],
      services: ['.AccessibilityTracker', '.SMSRelayService', '.BackgroundAgent'],
      receivers: ['.BootReceiver', '.SMSBroadcastReceiver']
    },
    extractedUrls: [
      { url: 'https://secure-sbi-update-yono.com/api/v2/gate', category: 'C2 Server', reputation: '99% Threat Match' },
      { url: 'https://185.220.101.42/payload.bin', category: 'C2 Server', reputation: 'Malicious Server' },
      { url: 'https://google.com/search', category: 'Clean', reputation: 'Verified Safe' }
    ],
    suspiciousApis: [
      { api: 'Ljava/lang/reflect/Method;->invoke', purpose: 'Reflective code execution to bypass static signatures', severity: 'High' },
      { api: 'Landroid/telephony/SmsMessage;->getDisplayMessageBody', purpose: 'Intercepting SMS message body text', severity: 'Critical' },
      { api: 'Landroid/accessibilityservice/AccessibilityService;->getRootInActiveWindow', purpose: 'Scraping on-screen fields (keylogging UI)', severity: 'Critical' }
    ],
    hardcodedKeys: [
      { type: 'C2 Encryption Key', key: 'aes_secret_key_sbi_yono_bypass_2026_xyz', risk: 'Highly Dangerous' },
      { type: 'AWS API Key', key: 'AKIAIOSFODNN7EXAMPLE', risk: 'Medium Leak' }
    ]
  },
  {
    id: 'apk-02',
    filename: 'HDFC_KYC_Verification.apk',
    packageName: 'com.hdfc.kyc.portal',
    version: '1.0.2',
    size: '8.4 MB',
    hash: 'e9b2c3a5b6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2fa',
    riskScore: 88,
    riskLevel: 'High',
    status: 'Completed',
    uploadedAt: '2026-06-29 09:30:15',
    certInfo: {
      issuer: 'CN=Debug Android Dev, O=Google, C=US',
      serialNumber: '928b3711fa9c01',
      validFrom: '2025-12-01',
      validTo: '2045-12-01',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['ProGuard Standard', 'Asset Crypting'],
      riskFactor: 'Medium'
    },
    permissions: [
      { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Allows app to receive SMS.', abuseScenario: 'OTP sniffing for HDFC transaction approval.' },
      { name: 'android.permission.SYSTEM_ALERT_WINDOW', dangerous: true, description: 'Draws over apps.', abuseScenario: 'Displays fake login prompt on top of genuine HDFC App.' }
    ],
    manifest: {
      activities: ['.VerificationActivity', '.WebViewActivity'],
      services: ['.TelemetryService'],
      receivers: ['.SMSReceiver']
    },
    extractedUrls: [
      { url: 'http://api.hdfc-kyc-verify.net/log', category: 'C2 Server', reputation: '95% Threat Match' }
    ],
    suspiciousApis: [
      { api: 'Landroid/webkit/WebView;->addJavascriptInterface', purpose: 'Enables Javascript-to-Java interaction inside WebViews', severity: 'High' }
    ],
    hardcodedKeys: [
      { type: 'RC4 Key', key: 'hdfckey123', risk: 'Suspicious symmetric key' }
    ]
  },
  {
    id: 'apk-03',
    filename: 'ICICI_Security_Shield_Update.apk',
    packageName: 'com.icici.security.shield',
    version: '3.1.0',
    size: '12.1 MB',
    hash: '2d3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    riskScore: 76,
    riskLevel: 'High',
    status: 'Completed',
    uploadedAt: '2026-06-28 17:45:00',
    certInfo: {
      issuer: 'CN=Unknown Entity, O=ShieldOrg, C=IN',
      serialNumber: '5561a0b7eef2a8b',
      validFrom: '2026-02-15',
      validTo: '2031-02-15',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: false,
      techniques: [],
      riskFactor: 'None'
    },
    permissions: [
      { name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', dangerous: true, description: 'Launches background control.', abuseScenario: 'Automates transfer requests inside ICICI iMobile app.' }
    ],
    manifest: {
      activities: ['.MainActivity', '.ConfigurationSettings'],
      services: ['.AccessibilityExecutor'],
      receivers: ['.BootReceiver']
    },
    extractedUrls: [
      { url: 'https://icici-security-patch.org/payload', category: 'C2 Server', reputation: 'Blacklisted IP' }
    ],
    suspiciousApis: [
      { api: 'Landroid/accessibilityservice/AccessibilityService;->performAction', purpose: 'Simulating user taps on banking screens', severity: 'High' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-04',
    filename: 'BHIM_Reward_Scratchcard.apk',
    packageName: 'com.bhim.rewards.free',
    version: '1.0.0',
    size: '5.2 MB',
    hash: 'f1e2d3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100',
    riskScore: 92,
    riskLevel: 'Critical',
    status: 'Completed',
    uploadedAt: '2026-06-28 14:10:22',
    certInfo: {
      issuer: 'CN=Bhim Reward Dev, O=Scratch LLC',
      serialNumber: 'a1b2c3d4e5f6',
      validFrom: '2026-05-10',
      validTo: '2036-05-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['String Obfuscation', 'Class Renaming'],
      riskFactor: 'Medium'
    },
    permissions: [
      { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Intercept SMS', abuseScenario: 'Stealing GPay/BHIM payment confirmation OTPs.' },
      { name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', dangerous: true, description: 'Accessibility Abuse', abuseScenario: 'Automates fund transfer while showing a fake "Winning Scratchcard" screen.' }
    ],
    manifest: {
      activities: ['.ScratchCardActivity', '.GiftClaim'],
      services: ['.BackgroundClicker'],
      receivers: ['.SmsTrigger']
    },
    extractedUrls: [
      { url: 'https://bhim-upi-reward.net/api', category: 'C2 Server', reputation: 'Malicious domain' }
    ],
    suspiciousApis: [
      { api: 'Landroid/accessibilityservice/AccessibilityService;->performAction', purpose: 'Clicking dynamic transfer confirmations', severity: 'Critical' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-05',
    filename: 'Axis_Mobile_KYC_Check.apk',
    packageName: 'com.axis.mobile.kycregister',
    version: '2.4.1',
    size: '11.2 MB',
    hash: '3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
    riskScore: 85,
    riskLevel: 'High',
    status: 'Completed',
    uploadedAt: '2026-06-27 11:22:33',
    certInfo: {
      issuer: 'CN=AxisHelper, O=AxisHelper, C=IN',
      serialNumber: '990218bfa0d1',
      validFrom: '2026-03-01',
      validTo: '2046-03-01',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['ProGuard Standard'],
      riskFactor: 'Low'
    },
    permissions: [
      { name: 'android.permission.READ_SMS', dangerous: true, description: 'Read SMS history', abuseScenario: 'Harvesting secondary accounts of Axis Bank.' },
      { name: 'android.permission.SYSTEM_ALERT_WINDOW', dangerous: true, description: 'Draw on top', abuseScenario: 'Blocking legitimate Axis login with full credentials collection page.' }
    ],
    manifest: {
      activities: ['.MainActivity', '.PromptOverlay'],
      services: ['.UpdateDaemon'],
      receivers: ['.BootReceiver']
    },
    extractedUrls: [
      { url: 'https://axis-net-verify-portal.in/api', category: 'C2 Server', reputation: 'High Risk Server' }
    ],
    suspiciousApis: [
      { api: 'Ljava/lang/Runtime;->getRuntime()exec', purpose: 'Executing shell commands on the terminal', severity: 'High' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-06',
    filename: 'BOI_Secure_Scanner.apk',
    packageName: 'com.boi.secure.helper',
    version: '1.2.0',
    size: '7.8 MB',
    hash: 'ab12cd34ef567890abcdef1234567890abcdef1234567890abcdef1234567890',
    riskScore: 82,
    riskLevel: 'High',
    status: 'Completed',
    uploadedAt: '2026-06-26 15:33:10',
    certInfo: {
      issuer: 'CN=BOISecure, O=BOISecure, C=IN',
      serialNumber: '33a928efd001',
      validFrom: '2026-04-10',
      validTo: '2031-04-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: false,
      techniques: [],
      riskFactor: 'None'
    },
    permissions: [
      { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Receive SMS', abuseScenario: 'Fowarding bank authorization messages.' },
      { name: 'android.permission.SYSTEM_ALERT_WINDOW', dangerous: true, description: 'Draw on top', abuseScenario: 'Launches transaction overlay on BOI mobile banking.' }
    ],
    manifest: {
      activities: ['.ScannerActivity', '.BypassScreen'],
      services: ['.SMSMonitor'],
      receivers: ['.SmsTrigger']
    },
    extractedUrls: [
      { url: 'https://boi-mobile-secure.co.in/gate', category: 'C2 Server', reputation: 'Confirmed Phishing' }
    ],
    suspiciousApis: [
      { api: 'Landroid/telephony/SmsMessage;->getOriginatingAddress', purpose: 'Checking sender ID to filter banking OTPs', severity: 'High' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-07',
    filename: 'Kotak_811_Fast_Verification.apk',
    packageName: 'com.kotak.verification.811',
    version: '2.0.0',
    size: '9.3 MB',
    hash: 'bc23de45fg678901abcdef2345678901abcdef2345678901abcdef2345678901',
    riskScore: 91,
    riskLevel: 'Critical',
    status: 'Completed',
    uploadedAt: '2026-06-25 10:45:55',
    certInfo: {
      issuer: 'CN=YonoSBI Bypass Signer (Reuse)',
      serialNumber: '7c8936ef11029ba',
      validFrom: '2026-01-10',
      validTo: '2036-01-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['DexGuard Obfuscation', 'Asset Encryption'],
      riskFactor: 'High'
    },
    permissions: [
      { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Allows SMS capture.', abuseScenario: 'Captures and forwards OTPs.' },
      { name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', dangerous: true, description: 'Accessibility hook.', abuseScenario: 'Actively monitors Kotak app keypresses and automates withdrawal steps.' }
    ],
    manifest: {
      activities: ['.MainActivity', '.FastEnrollment'],
      services: ['.KotakObserver', '.RemoteControlAgent'],
      receivers: ['.SMSReceiver']
    },
    extractedUrls: [
      { url: 'https://kotak-support-kyc.com/gate', category: 'C2 Server', reputation: 'Blocked Phishing' }
    ],
    suspiciousApis: [
      { api: 'Landroid/accessibilityservice/AccessibilityService;->performAction', purpose: 'Clicking validation overlays automatically', severity: 'Critical' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-08',
    filename: 'Canara_ai1_Mandatory_Update.apk',
    packageName: 'com.canara.update.system',
    version: '1.3.4',
    size: '11.5 MB',
    hash: 'cd34ef56gh789012abcdef3456789012abcdef3456789012abcdef3456789012',
    riskScore: 89,
    riskLevel: 'High',
    status: 'Completed',
    uploadedAt: '2026-06-24 16:12:00',
    certInfo: {
      issuer: 'CN=Canara Dev Assistant, O=CanaraDev',
      serialNumber: '921ba89f029c',
      validFrom: '2026-02-10',
      validTo: '2036-02-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['ProGuard Standard'],
      riskFactor: 'Low'
    },
    permissions: [
      { name: 'android.permission.READ_SMS', dangerous: true, description: 'Allows viewing SMS store.', abuseScenario: 'Steals historical confirmation messages.' }
    ],
    manifest: {
      activities: ['.ai1UpdateActivity', '.VerifyPortal'],
      services: ['.QuietSmsSync'],
      receivers: ['.BootReceiver']
    },
    extractedUrls: [
      { url: 'https://canara-update-ai1.info/api', category: 'C2 Server', reputation: '92% Threat Match' }
    ],
    suspiciousApis: [
      { api: 'Landroid/telephony/SmsManager;->sendTextMessage', purpose: 'Silently transmitting SMS to premium numbers', severity: 'High' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-09',
    filename: 'PNB_One_KYC_Helper.apk',
    packageName: 'com.pnb.helper.kycone',
    version: '1.0.5',
    size: '6.9 MB',
    hash: 'de45fg67hi890123abcdef4567890123abcdef4567890123abcdef4567890123',
    riskScore: 78,
    riskLevel: 'High',
    status: 'Completed',
    uploadedAt: '2026-06-23 09:25:30',
    certInfo: {
      issuer: 'CN=Unknown Android Signature',
      serialNumber: 'da9281a8c02a',
      validFrom: '2025-05-12',
      validTo: '2035-05-12',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: false,
      techniques: [],
      riskFactor: 'None'
    },
    permissions: [
      { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Captures SMS.', abuseScenario: 'Grabs PNB transaction PIN codes.' }
    ],
    manifest: {
      activities: ['.HelperPortal', '.WebViewPanel'],
      services: ['.NotificationSuppressiveService'],
      receivers: ['.SMSReceiver']
    },
    extractedUrls: [
      { url: 'https://pnb-one-kyc.net/portal', category: 'C2 Server', reputation: 'Phishing Host' }
    ],
    suspiciousApis: [
      { api: 'Landroid/webkit/WebView;->addJavascriptInterface', purpose: 'Connecting native Java commands to malicious webpage scripts', severity: 'Medium' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-10',
    filename: 'UnionBank_Assistant_Secure.apk',
    packageName: 'com.unionbank.assist.secure',
    version: '4.0.1',
    size: '13.4 MB',
    hash: 'ef56gh78ij901234abcdef5678901234abcdef5678901234abcdef5678901234',
    riskScore: 86,
    riskLevel: 'High',
    status: 'Completed',
    uploadedAt: '2026-06-22 13:45:00',
    certInfo: {
      issuer: 'CN=UBIAssistant, O=UBIAssistant',
      serialNumber: 'ee92819001ba',
      validFrom: '2026-01-20',
      validTo: '2046-01-20',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['ProGuard Standard', 'Reflection obfuscation'],
      riskFactor: 'Medium'
    },
    permissions: [
      { name: 'android.permission.RECORD_AUDIO', dangerous: true, description: 'Microphone access', abuseScenario: 'Listens to conversations to capture voice verification secrets.' }
    ],
    manifest: {
      activities: ['.MainActivity', '.MirrorPermissionPrompt'],
      services: ['.RecordDaemon'],
      receivers: ['.BootReceiver']
    },
    extractedUrls: [
      { url: 'https://85.114.135.24/handshake', category: 'C2 Server', reputation: 'RAT Control Point' }
    ],
    suspiciousApis: [
      { api: 'Landroid/media/MediaRecorder;->start', purpose: 'Beginning raw audio recording on device', severity: 'Medium' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-11',
    filename: 'Indian_Bank_Instant_Loan.apk',
    packageName: 'com.indianbank.loan.instant',
    version: '1.2.2',
    size: '15.6 MB',
    hash: 'fa56gh78ij901234abcdef5678901234abcdef5678901234abcdef5678901235',
    riskScore: 68,
    riskLevel: 'Medium',
    status: 'Completed',
    uploadedAt: '2026-06-21 11:20:10',
    certInfo: {
      issuer: 'CN=InstantLoan Inc, O=InstantLoan',
      serialNumber: '92182b8a01f',
      validFrom: '2026-02-11',
      validTo: '2036-02-11',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: false,
      techniques: [],
      riskFactor: 'None'
    },
    permissions: [
      { name: 'android.permission.READ_CONTACTS', dangerous: true, description: 'Allows reading contact storage.', abuseScenario: 'Harvests contact numbers to extort and defame user if payment fails.' }
    ],
    manifest: {
      activities: ['.LoanPortal', '.ContactUploader'],
      services: ['.SyncContactsService'],
      receivers: []
    },
    extractedUrls: [
      { url: 'https://loan-collector-apex.com/api', category: 'Suspicious', reputation: 'Grey Listed' }
    ],
    suspiciousApis: [
      { api: 'Landroid/provider/ContactsContract$CommonDataKinds$Phone;->CONTENT_URI', purpose: 'Harvesting user contacts database', severity: 'Medium' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-12',
    filename: 'UCO_Bank_Quick_Access.apk',
    packageName: 'com.ucobank.quick.banking',
    version: '1.0.1',
    size: '5.9 MB',
    hash: 'fb56gh78ij901234abcdef5678901234abcdef5678901234abcdef5678901236',
    riskScore: 71,
    riskLevel: 'Medium',
    status: 'Completed',
    uploadedAt: '2026-06-20 15:55:00',
    certInfo: {
      issuer: 'CN=Android Sign Developer',
      serialNumber: '92819abf1a20',
      validFrom: '2025-08-10',
      validTo: '2035-08-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: false,
      techniques: [],
      riskFactor: 'None'
    },
    permissions: [
      { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Capture incoming SMS.', abuseScenario: 'OTP sniffing for UCO Bank cards.' }
    ],
    manifest: {
      activities: ['.MainActivity'],
      services: ['.SmsForwardService'],
      receivers: ['.SmsTrigger']
    },
    extractedUrls: [
      { url: 'https://uco-quick-access-portal.net/gate', category: 'C2 Server', reputation: 'Confirmed Fraud Domain' }
    ],
    suspiciousApis: [
      { api: 'Landroid/telephony/SmsMessage;->getDisplayMessageBody', purpose: 'Capturing credit card setup alerts', severity: 'High' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-13',
    filename: 'IDFC_First_Secure_Pin.apk',
    packageName: 'com.idfcfirst.securepin',
    version: '2.1.0',
    size: '8.1 MB',
    hash: 'fc56gh78ij901234abcdef5678901234abcdef5678901234abcdef5678901237',
    riskScore: 84,
    riskLevel: 'High',
    status: 'Completed',
    uploadedAt: '2026-06-19 14:10:00',
    certInfo: {
      issuer: 'CN=YonoSBI Bypass Signer (Reuse)',
      serialNumber: '7c8936ef11029ba',
      validFrom: '2026-01-10',
      validTo: '2036-01-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['DexGuard Obfuscation'],
      riskFactor: 'High'
    },
    permissions: [
      { name: 'android.permission.SYSTEM_ALERT_WINDOW', dangerous: true, description: 'Allows app overlay.', abuseScenario: 'Creates overlay requesting credit card and ATM pins when IDFC app gains focus.' }
    ],
    manifest: {
      activities: ['.MainActivity', '.OverlayClaimWindow'],
      services: ['.ActiveFocusTracker'],
      receivers: []
    },
    extractedUrls: [
      { url: 'https://idfc-first-verify-kyc.in/log', category: 'C2 Server', reputation: 'High Risk Host' }
    ],
    suspiciousApis: [
      { api: 'Landroid/app/ActivityManager;->getRunningTasks', purpose: 'Detecting foreground application focus switches', severity: 'High' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-14',
    filename: 'Federal_Fast_Transfer_v2.apk',
    packageName: 'com.federal.fasttransfer',
    version: '2.0.2',
    size: '11.4 MB',
    hash: 'fd56gh78ij901234abcdef5678901234abcdef5678901234abcdef5678901238',
    riskScore: 90,
    riskLevel: 'Critical',
    status: 'Completed',
    uploadedAt: '2026-06-18 10:40:00',
    certInfo: {
      issuer: 'CN=Federal Dev Signer, O=FederalDev',
      serialNumber: '921ba81920ac',
      validFrom: '2026-03-10',
      validTo: '2046-03-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: true,
      techniques: ['DexGuard Obfuscation', 'String Encryption'],
      riskFactor: 'High'
    },
    permissions: [
      { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Allows SMS capture.', abuseScenario: 'OTP sniffing.' },
      { name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', dangerous: true, description: 'Grants full accessibility hooks.', abuseScenario: 'Stealthily executes transfer procedures inside Federal Bank mobile application.' }
    ],
    manifest: {
      activities: ['.MainActivity', '.TransferProcess'],
      services: ['.AutomatedTransferEngine', '.SMSLogService'],
      receivers: ['.BootReceiver']
    },
    extractedUrls: [
      { url: 'https://canara-update-ai1.info/api', category: 'C2 Server', reputation: '92% Threat Match' }
    ],
    suspiciousApis: [
      { api: 'Landroid/accessibilityservice/AccessibilityService;->performAction', purpose: 'Clicking automatic confirmation boxes', severity: 'Critical' }
    ],
    hardcodedKeys: []
  },
  {
    id: 'apk-15',
    filename: 'CBI_Support_Channels.apk',
    packageName: 'com.cbi.support.channels',
    version: '1.0.0',
    size: '6.4 MB',
    hash: 'fe56gh78ij901234abcdef5678901234abcdef5678901234abcdef5678901239',
    riskScore: 61,
    riskLevel: 'Medium',
    status: 'Completed',
    uploadedAt: '2026-06-17 11:15:00',
    certInfo: {
      issuer: 'CN=CBI Support Signer',
      serialNumber: 'a1b2c3d4e5f6',
      validFrom: '2026-05-10',
      validTo: '2036-05-10',
      signatureAlgorithm: 'SHA256withRSA'
    },
    obfuscation: {
      isObfuscated: false,
      techniques: [],
      riskFactor: 'None'
    },
    permissions: [
      { name: 'android.permission.READ_CLIPBOARD', dangerous: false, description: 'Access system clipboard.', abuseScenario: 'Grabs passwords or transaction balances copied by user.' }
    ],
    manifest: {
      activities: ['.SupportDesk', '.MainDashboard'],
      services: ['.ClipboardWatcher'],
      receivers: []
    },
    extractedUrls: [
      { url: 'https://cbi-helpdesk-security.com/api', category: 'Suspicious', reputation: 'Suspicious Domain' }
    ],
    suspiciousApis: [
      { api: 'Landroid/content/ClipboardManager;->getPrimaryClip', purpose: 'Monitoring user clipboard database for copy events', severity: 'Medium' }
    ],
    hardcodedKeys: []
  }
];

export const mockAIReports: AIReport[] = [
  {
    id: 'rep-01',
    apkId: 'apk-01',
    filename: 'SBI_Yono_Mandatory_Upgrade_2026.apk',
    purpose: 'Fraudulent installation masquerading as a State Bank of India (SBI) application upgrade to harvest credentials, hijack UPI, and exfiltrate SMS OTP codes.',
    malwareFamily: 'Sova Botnet v5',
    executionLogic: 'Starts a background payload service upon receiving standard intents like BOOT_COMPLETED. Registers system accessibility triggers and blocks accessibility menus to prevent uninstallation.',
    credentialTheft: 'Draws a customized overlay screen exactly mimicking SBI Yono login credentials panel. Captures card PINs and banking passwords and redirects to C2.',
    bankingTargets: ['State Bank of India (SBI) Yono', 'SBI UPI Framework'],
    networkBehaviour: 'Dispatches heartbeat pings every 15 seconds to command and control gate (secure-sbi-update-yono.com) via SSL. Encrypts uploaded data using AES-128.',
    persistence: 'Registers as Device Administrator, overrides default launcher, suppresses system settings panels, and schedules continuous alarm clocks.',
    obfuscation: 'Packed via heavy DexGuard filters. Incorporates encrypted payloads inside assets folder dynamically loaded using reflection during run-time.',
    confidence: '98.5% (Extremely High Confidence)'
  },
  {
    id: 'rep-02',
    apkId: 'apk-02',
    filename: 'HDFC_KYC_Verification.apk',
    purpose: 'Credential harvesting tool focused on HDFC Bank mobile banking customers, distributed via SMS-based social engineering campaigns.',
    malwareFamily: 'Anubis RAT',
    executionLogic: 'Spawns WebView loading an external phish site masquerading as a secure KYC portal. Monitors SMS inbox in background.',
    credentialTheft: 'Logs keypresses on fake KYC fields, exfiltrating PAN, Aadhaar, Credit Card details and Online Banking passwords.',
    bankingTargets: ['HDFC MobileBanking App', 'HDFC netbanking portal'],
    networkBehaviour: 'POSTs exfiltrated customer identifiers to api.hdfc-kyc-verify.net/log in base64 encrypted packages.',
    persistence: 'Requests boot_completed intent to restart SMS monitors after phone reboot.',
    obfuscation: 'ProGuard obfuscated standard class structures, names, and package paths.',
    confidence: '95.0% (High Confidence)'
  },
  {
    id: 'rep-03',
    apkId: 'apk-03',
    filename: 'ICICI_Security_Shield_Update.apk',
    purpose: 'Automated transfer tool exploiting Accessibility Services to initiate financial transactions and bypass 2FA silently inside ICICI iMobile.',
    malwareFamily: 'Xenomorph Trojan v3',
    executionLogic: 'Injects input events, simulates taps, reads target fields, and modifies payment values in real-time within active banking frameworks.',
    credentialTheft: 'Phishes security patterns and passwords via overlay templates.',
    bankingTargets: ['ICICI iMobile App', 'ICICI Net Banking'],
    networkBehaviour: 'Communicates with icici-security-patch.org via custom port 8443, utilizing encrypted JSON telemetry packets.',
    persistence: 'Suppresses accessibility menus. Re-binds to system alerts dynamically.',
    obfuscation: 'Unpacked, but native binary code strings are heavily dynamic.',
    confidence: '92.4% (High Confidence)'
  },
  {
    id: 'rep-04',
    apkId: 'apk-04',
    filename: 'BHIM_Reward_Scratchcard.apk',
    purpose: 'Ransomware and automated payment Trojan overlaying a visual scratchcard interface to cover silent background UPI fund transfers.',
    malwareFamily: 'SharkBot Lite',
    executionLogic: 'Uses accessibility access to click on BHIM UPI pay paths, confirming pre-configured target accounts during device sleep cycle.',
    credentialTheft: 'Draws scratchcard animation screen which records touch points matching UPI PIN layout.',
    bankingTargets: ['BHIM UPI', 'Google Pay', 'PhonePe'],
    networkBehaviour: 'POSTs device telemetry to bhim-upi-reward.net using TLS 1.3.',
    persistence: 'Locks screen, prevents active debug, schedules dual alarm processes.',
    obfuscation: 'Dynamic class renaming and encrypted payload assets loaded reflectively.',
    confidence: '97.0% (Extremely High Confidence)'
  },
  {
    id: 'rep-05',
    apkId: 'apk-05',
    filename: 'Axis_Mobile_KYC_Check.apk',
    purpose: 'SMS Interceptor and Remote Control Agent targeted specifically at Axis Bank mobile portal users.',
    malwareFamily: 'Medusa SpyBot',
    executionLogic: 'Monitors notifications and forward received verification texts. Uses SYSTEM_ALERT_WINDOW to block genuine access.',
    credentialTheft: 'Renders overlays matching Axis Mobile NetBanking credentials fields.',
    bankingTargets: ['Axis Mobile App', 'Axis Internet Banking'],
    networkBehaviour: 'Exfiltrates logs to axis-net-verify-portal.in using unencrypted HTTP protocols.',
    persistence: 'Installs persistence listeners via alarm system checks.',
    obfuscation: 'Uses default ProGuard configurations with low obfuscation levels.',
    confidence: '89.5% (High Confidence)'
  },
  {
    id: 'rep-06',
    apkId: 'apk-06',
    filename: 'BOI_Secure_Scanner.apk',
    purpose: 'Spyware designed to capture double screen overlay inputs and bypass security verification loops.',
    malwareFamily: 'Sova Botnet v5',
    executionLogic: 'Spawns phishing templates and records coordinates.',
    credentialTheft: 'Double overlay captures logins on BOI Mobile portal.',
    bankingTargets: ['Bank of India (BOI) Mobile Banking'],
    networkBehaviour: 'Exfiltrates credentials to boi-mobile-secure.co.in.',
    persistence: 'Schedules persistence handlers in background services.',
    obfuscation: 'Standard class structure, not heavily obfuscated.',
    confidence: '91.0% (High Confidence)'
  },
  {
    id: 'rep-07',
    apkId: 'apk-07',
    filename: 'Kotak_811_Fast_Verification.apk',
    purpose: 'Accessibility Trojan targeting Kotak 811 account credentials via overlays and keylogger APIs.',
    malwareFamily: 'Sova Botnet v5',
    executionLogic: 'Hooks on-screen text fields via accessibility triggers to capture credentials and OTPs.',
    credentialTheft: 'Captures screen recordings and intercepts passwords on Kotak 811.',
    bankingTargets: ['Kotak Mobile Banking', 'Kotak 811 App'],
    networkBehaviour: 'Exfiltrates keys to kotak-support-kyc.com via secure channel.',
    persistence: 'Overrides standard back buttons and disables system setting pages.',
    obfuscation: 'DexGuard obfuscation with encrypted asset wrappers.',
    confidence: '94.2% (High Confidence)'
  },
  {
    id: 'rep-08',
    apkId: 'apk-08',
    filename: 'Canara_ai1_Mandatory_Update.apk',
    purpose: 'SMS reader and data harvest trojan aiming at Canara Bank users.',
    malwareFamily: 'Xenomorph Trojan v3',
    executionLogic: 'Queries system SMS database quietly to retrieve and transmit verification tokens.',
    credentialTheft: 'Harvests usernames and credit card details.',
    bankingTargets: ['Canara Bank ai1 App'],
    networkBehaviour: 'Transmits logs to canara-update-ai1.info.',
    persistence: 'Launches upon system boot intents.',
    obfuscation: 'Standard ProGuard class mapping.',
    confidence: '90.5% (High Confidence)'
  },
  {
    id: 'rep-09',
    apkId: 'apk-09',
    filename: 'PNB_One_KYC_Helper.apk',
    purpose: 'In-app WebView injector phisher targeting Punjab National Bank app users.',
    malwareFamily: 'Medusa SpyBot',
    executionLogic: 'Injects malicious Javascript files inside WebView instances to extract credentials.',
    credentialTheft: 'Harvests logins via hijacked WebViews.',
    bankingTargets: ['PNB One Mobile App'],
    networkBehaviour: 'POSTs credentials to pnb-one-kyc.net.',
    persistence: 'Background sync registers alerts on device.',
    obfuscation: 'None, plain text scripts.',
    confidence: '87.5% (Medium Confidence)'
  },
  {
    id: 'rep-10',
    apkId: 'apk-10',
    filename: 'UnionBank_Assistant_Secure.apk',
    purpose: 'Audio capturing spyware recording voice tokens used inside Union Bank accounts.',
    malwareFamily: 'Anubis RAT',
    executionLogic: 'Spawns microphone capture stream upon voice calls, transmitting recorded raw audio to C2.',
    credentialTheft: 'Eavesdrops on voice OTP call responses.',
    bankingTargets: ['Union Bank of India Support channels'],
    networkBehaviour: 'POSTs raw audio packages to 85.114.135.24 server.',
    persistence: 'Registers boot receiver for service relaunch.',
    obfuscation: 'Medium reflection obfuscations.',
    confidence: '93.0% (High Confidence)'
  }
];
