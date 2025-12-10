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

  // Generator Runtime
  data.generators.forEach((gen) => {
    if (gen.running && gen.startTime && gen.endTime) {
      const start = new Date(`1970-01-01T${gen.startTime}`);
      const end = new Date(`1970-01-01T${gen.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      if (diffHrs > 3) {
        alerts.push(`⚠️ ALERT: Generator ${gen.id} ran > 3hrs`);
      }
    }
  });

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

  // Generators
  const genDetails = data.power33kv
    ? 'Grid ON'
    : data.generators
        .filter((g) => g.running)
        .map((g) => `DG${g.id}: ${g.startTime}-${g.endTime}`)
        .join(', ') || 'None Running';

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
  const rakeStr =
    data.rakeStatus !== 'None'
      ? `${data.rakeStatus} @ ${data.rakeTime}`
      : 'No Activity';

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

*Power:* ${data.power33kv ? '33KV ON' : '33KV OFF'}
*Generators:* ${genDetails}
*Changeover:* ${data.changeoverStatus}

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
