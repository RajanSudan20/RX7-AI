export type ProgrammingLanguage = 
  | 'python' 
  | 'typescript' 
  | 'javascript' 
  | 'go' 
  | 'rust' 
  | 'cpp' 
  | 'sql' 
  | 'java';

export interface CodeSession {
  id: string;
  filename: string;
  language: ProgrammingLanguage;
  code: string;
  errorLog: string;
  errorLine?: number;
  status: 'error_detected' | 'analyzing' | 'fixed' | 'idle' | 'failed';
  diagnosis?: string;
  fixedCode?: string;
  latencyMs?: number;
  tokensUsed?: number;
  modelUsed?: string;
  createdAt: number;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WARNING';
  errorCategory?: string;
}

export interface PresetSample {
  id: string;
  filename: string;
  language: ProgrammingLanguage;
  title: string;
  errorCategory: string;
  errorLine: number;
  code: string;
  errorLog: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WARNING';
  precomputedDiagnosis?: string;
  precomputedFix?: string;
}

export interface EngineSettings {
  autoFormatOnFix: boolean;
  inlineComments: boolean;
  strictEngineerMode: boolean;
  showDiffByDefault: boolean;
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro';
}
