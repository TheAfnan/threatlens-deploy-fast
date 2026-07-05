export interface APKReport {
  id: string;
  filename: string;
  packageName: string;
  version: string;
  size: string;
  hash: string;
  riskScore: number; // 0 to 100
  riskLevel: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Completed' | 'Analyzing' | 'Failed';
  uploadedAt: string;
  certInfo: {
    issuer: string;
    serialNumber: string;
    validFrom: string;
    validTo: string;
    signatureAlgorithm: string;
  };
  obfuscation: {
    isObfuscated: boolean;
    techniques: string[];
    riskFactor: 'None' | 'Low' | 'Medium' | 'High';
  };
  permissions: {
    name: string;
    dangerous: boolean;
    description: string;
    abuseScenario: string;
  }[];
  manifest: {
    activities: string[];
    services: string[];
    receivers: string[];
  };
  extractedUrls: {
    url: string;
    category: 'C2 Server' | 'Adware' | 'Clean' | 'Suspicious';
    reputation: string;
  }[];
  suspiciousApis: {
    api: string;
    purpose: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }[];
  hardcodedKeys: {
    type: string;
    key: string;
    risk: string;
  }[];
  aiReport?: AIReport;
}

export interface MalwareFamily {
  id: string;
  name: string;
  type: string;
  firstSeen: string;
  primaryTargets: string[];
  severity: 'Medium' | 'High' | 'Critical';
  description: string;
  detectionRate: string;
}

export interface ThreatIndicator {
  id: string;
  type: 'IP' | 'Domain' | 'Hash' | 'Registry' | 'Certificate';
  value: string;
  threatActor: string;
  associatedMalware: string;
  source: string;
  confidence: number; // percentage
  status: 'Active' | 'Mitigated' | 'Under Observation';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'SMS' | 'Network' | 'File' | 'Accessibility' | 'Overlay' | 'System';
  action: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Alert' | 'Critical';
}

export interface BankingThreatScenario {
  id: string;
  name: string;
  description: string;
  targetBanks: string[];
  threatVector: string;
  mitigation: string;
}

export interface AIReport {
  id: string;
  apkId: string;
  filename: string;
  purpose: string;
  malwareFamily: string;
  executionLogic: string;
  credentialTheft: string;
  bankingTargets: string[];
  networkBehaviour: string;
  persistence: string;
  obfuscation: string;
  confidence: string;
}

export interface AIReverseEngineeringReport {
  executiveSummary: string;
  malwareBehaviour: {
    item: string;
    explanation: string;
  }[];
  bankingThreatAssessment: {
    threat: string;
    likelihood: 'Low' | 'Medium' | 'High' | 'Critical';
    confidence: string;
  }[];
  riskJustification: {
    score: number;
    reasons: string[];
  };
  indicatorsOfCompromise: {
    type: string;
    value: string;
  }[];
  mitreAttackMapping: {
    technique: string;
    description: string;
  }[];
  analystRecommendations: string[];
  executiveConclusion: string;
  aiConfidence: {
    score: number; // 0-100
    explanation: string;
  };
}
