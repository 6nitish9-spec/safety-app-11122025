import { ReportData } from '../types';

export const generateAlerts = (data: ReportData): string[] => {
  const alerts: string[] = [];

  // Jockey Pump Warning
  const jockeyTime = parseInt(data.jockeyRuntime) || 0;
  if (jockeyTime < 45) {
    alerts.push(`⚠️ ALERT: Jockey Runtime < 45mins (${jockeyTime}m)`);
  }

  // Water Levels
  const tk13 = parseFloat(data.tk13Level) || 0;
  const tk29 = parseFloat(data.tk29Level) || 0;
  if (tk13 < 14) alerts.push(`⚠️ ALERT: TK13 Level Low (${tk13}m)`);
  if (tk29 < 14) alerts.push(`⚠️ ALERT: TK29 Level Low (${tk29}m)`);

  // Leaks
  if (data.leakProduct) alerts.push('🚨 CRITICAL: Product Leak Detected');
  if (data.leakHydrant) alerts.push('⚠️ ALERT: Hydrant Leak Detected');
  if (data.leakAir) alerts.push('⚠️ ALERT: Air Leak Detected');

  // Generator Alert (Specific Logic)
  if (!data.power33kv) {
    const hours = parseFloat(data.runningGGDuration) || 0;
    if (hours > 3) {
      alerts.push(`⚠️ ALERT: Generator ${data.runningGG} running > 3hrs! Changeover needed.`);
    }
  }

  return alerts;
};

export const checkNotifications = () => {
  const lastReport = localStorage.getItem('lastReportTime');
  const now = new Date();
  const currentHour = now.getHours();
  const isSunday = now.getDay() === 0;
  const isNightShift = currentHour >= 17 || currentHour <= 6;

  // Browser notification request
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  if (lastReport) {
    const lastTime = new Date(parseInt(lastReport));
    const diffHours = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);

    if (diffHours > 2 && (isSunday || isNightShift)) {
      if (Notification.permission === 'granted') {
        new Notification('Safety Report Due', {
          body: 'It has been over 2 hours since the last report.',
        });
      }
    }
  }
};

export const saveReportTimestamp = () => {
  localStorage.setItem('lastReportTime', Date.now().toString());
};

export const formatWhatsAppReport = (data: ReportData): string => {
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  
  const alerts = generateAlerts(data);
  const alertSection = alerts.length > 0 ? `*ALERTS:*\n${alerts.join('\n')}\n` : '';

  // Engines
  const failedEngines = data.engines
    .map((w, i) => (w ? null : i + 1))
    .filter((id) => id !== null);
  const engineStatus =
    failedEngines.length > 0 ? `Issue (${failedEngines.join(', ')})` : 'All OK';

  // Power & Generators
  let powerDetails = '';
  if (data.power33kv) {
    powerDetails = '*Power:* 33KV ON (Grid Available)';
  } else {
    powerDetails = '*Power:* 33KV OFF\n*Running GGs:*';
    if (data.runningGG) {
      powerDetails += `\n1. ${data.runningGG} (Started: ${data.runningGGStartTime})`;
      if (data.runningGGDuration) powerDetails += ` - Ran ${data.runningGGDuration}hrs`;
    }
    if (data.changeoverPerformed && data.newGG) {
      powerDetails += `\n2. ${data.newGG} (Started: ${data.newGGStartTime}) [Active]`;
    }
  }

  // Leaks
  const airStr = `Air: ${data.leakAir ? `YES (${data.leakAirLoc})` : 'NO'}`;
  const hydStr = `Hydr: ${data.leakHydrant ? `YES (${data.leakHydrantLoc})` : 'NO'}`;
  const prodStr = data.leakProduct
    ? `Prod: YES (${data.leakProductType}/${data.leakProductLoc})`
    : '';
  const leakLine = [airStr, hydStr, prodStr].filter(Boolean).join(' | ');

  // Logistics
  const pipelineStr = data.pipelineReceiving
    ? `Receiving (${data.pipelineProduct} -> ${data.pipelineTankNo})`
    : 'Stopped';
    
  let rakeStr = 'No Activity';
  if (data.rakeStatus !== 'None') {
    if (data.rakeStatus === 'Placed') rakeStr = `Placed @ ${data.rakeTime}`;
    else if (data.rakeStatus === 'Unloading') rakeStr = `Unloading Started @ ${data.rakeTime}`;
    else if (data.rakeStatus === 'Unloading Completed') {
      rakeStr = `Unloading Completed @ ${data.rakeUnloadingTime}`;
      // Logic: Only show removed time if status is explicitly Removed. 
      // If user is in Unloading Completed, we assume it's not removed or they haven't updated it yet.
    } else if (data.rakeStatus === 'Removed') {
      rakeStr = `Removed @ ${data.rakeRemovalTime}`;
    }
  }

  // Security
  const cbacsStr = data.cbacsFunctional
    ? 'Functional'
    : `Issue: ${data.cbacsIssue}`;
  const cctvStr =
    parseInt(data.cctvRunning) === data.cctvTotal
      ? 'All 71 Working'
      : `${data.cctvRunning}/${data.cctvTotal} Running. Issue: ${data.cctvIssues}`;

  return `*Safety Status Report - ${dateStr}*

${alertSection}*Guard:* ${data.guardName} (${data.patrolStart}-${data.patrolEnd})

*Engines:* ${engineStatus}
*Hydrant Pressure:* ${data.hydrantPressure} kg/cm2
*Jockey Running:* ${data.jockeyRuntime} mins
*Storage:* TK13: ${data.tk13Level}m | TK29: ${data.tk29Level}m
*Leakages:* ${leakLine}

${powerDetails}

*Logistics:*
Pipeline: ${pipelineStr}
Rake: ${rakeStr}

*Security:*
Office AC & Light: ${data.officeACLight ? 'OK' : 'Issue'}
C-BACS: ${cbacsStr}
CCTV: ${cctvStr}
Obs: Tower (${data.observationTower}) | NV (${data.observationNightVision})

*Remarks:* ${data.remarks || 'Nil'}`;
};