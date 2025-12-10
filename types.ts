export interface EngineStatus {
  id: number;
  working: boolean;
}

export interface GeneratorStatus {
  id: number;
  running: boolean;
  startTime: string;
  endTime: string;
}

export type RakeStatus = 'Placed' | 'Unloading' | 'Removed' | 'None';

export interface ReportData {
  // Step 1
  guardName: string;
  patrolStart: string;
  patrolEnd: string;

  // Step 2
  engines: boolean[]; // [eng1, eng2, eng3, eng4, eng5]
  hydrantPressure: string;
  jockeyRuntime: string; // Minutes

  // Step 3
  tk13Level: string;
  tk29Level: string;
  leakAir: boolean;
  leakAirLoc: string;
  leakHydrant: boolean;
  leakHydrantLoc: string;
  leakProduct: boolean;
  leakProductLoc: string;
  leakProductType: string;

  // Step 4
  power33kv: boolean;
  generators: GeneratorStatus[];
  changeoverStatus: string;

  // Step 5
  pipelineReceiving: boolean;
  pipelineProduct: string;
  pipelineTankNo: string;
  rakeStatus: RakeStatus;
  rakeTime: string; // Generic time based on status

  // Step 6
  officeACLight: boolean; // true = OK, false = Issue? Description says Single Toggle implies ON/OFF usually means OK/Not OK or Running/Not
  cbacsFunctional: boolean;
  cbacsIssue: string;
  cctvTotal: number;
  cctvRunning: string; // Input string, convert to number for validation
  cctvIssues: string;
  observationTower: string;
  observationNightVision: string;
  remarks: string;
}

export const INITIAL_DATA: ReportData = {
  guardName: '',
  patrolStart: '',
  patrolEnd: '',
  engines: [true, true, true, true, true],
  hydrantPressure: '',
  jockeyRuntime: '',
  tk13Level: '',
  tk29Level: '',
  leakAir: false,
  leakAirLoc: '',
  leakHydrant: false,
  leakHydrantLoc: '',
  leakProduct: false,
  leakProductLoc: '',
  leakProductType: 'MS',
  power33kv: true,
  generators: [
    { id: 1, running: false, startTime: '', endTime: '' },
    { id: 2, running: false, startTime: '', endTime: '' },
    { id: 3, running: false, startTime: '', endTime: '' },
  ],
  changeoverStatus: 'Manual',
  pipelineReceiving: false,
  pipelineProduct: '',
  pipelineTankNo: '',
  rakeStatus: 'None',
  rakeTime: '',
  officeACLight: true,
  cbacsFunctional: true,
  cbacsIssue: '',
  cctvTotal: 71,
  cctvRunning: '71',
  cctvIssues: '',
  observationTower: 'Normal',
  observationNightVision: 'Clear',
  remarks: '',
};
