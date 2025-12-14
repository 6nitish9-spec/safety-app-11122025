export interface EngineStatus {
  id: number;
  working: boolean;
}

export type RakeStatus = 'Placed' | 'Unloading' | 'Unloading Completed' | 'Removed' | 'None';

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

  // Step 4 (Power)
  power33kv: boolean;
  // New Generator Logic Fields
  runningGG: string;          // Name of the first running GG
  runningGGStartTime: string;
  runningGGDuration: string;  // Duration in hours
  changeoverPerformed: boolean;
  newGG: string;             // Name of new GG after changeover
  newGGStartTime: string;

  // Step 5
  pipelineReceiving: boolean;
  pipelineProduct: string;
  pipelineTankNo: string;
  rakeStatus: RakeStatus;
  rakeTime: string;           // Placement or Unloading Start Time
  rakeUnloadingTime: string;  // Completion time
  rakeRemovalTime: string;    // Removal time if cleared

  // Step 6
  officeACLight: boolean; 
  cbacsFunctional: boolean;
  cbacsIssue: string;
  cctvTotal: number;
  cctvRunning: string; 
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
  runningGG: '',
  runningGGStartTime: '',
  runningGGDuration: '',
  changeoverPerformed: false,
  newGG: '',
  newGGStartTime: '',

  pipelineReceiving: false,
  pipelineProduct: 'MS',
  pipelineTankNo: '',
  rakeStatus: 'None',
  rakeTime: '',
  rakeUnloadingTime: '',
  rakeRemovalTime: '',

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