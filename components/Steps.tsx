import React, { useEffect } from 'react';
import { Input, Select, Toggle, TextArea } from './ui/FormElements';
import { ReportData, RakeStatus } from '../types';

interface StepProps {
  data: ReportData;
  update: (fields: Partial<ReportData>) => void;
}

export const Step1: React.FC<StepProps> = ({ data, update }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
      Step 1: Guard Details
    </h2>
    <Input
      label="Guard Name"
      value={data.guardName}
      onChange={(e) => update({ guardName: e.target.value })}
      placeholder="Enter name"
      autoFocus
    />
    <div className="grid grid-cols-2 gap-4">
      <Input
        label="Patrol Start Time"
        type="time"
        value={data.patrolStart}
        onChange={(e) => update({ patrolStart: e.target.value })}
      />
      <Input
        label="Patrol End Time"
        type="time"
        value={data.patrolEnd}
        onChange={(e) => update({ patrolEnd: e.target.value })}
      />
    </div>
  </div>
);

export const Step2: React.FC<StepProps> = ({ data, update }) => {
  const toggleEngine = (index: number, val: boolean) => {
    const newEngines = [...data.engines];
    newEngines[index] = val;
    update({ engines: newEngines });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Step 2: Engines & Pumps
      </h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
          Engine Status
        </label>
        {data.engines.map((status, idx) => (
          <Toggle
            key={idx}
            label={`Engine ${idx + 1}`}
            checked={status}
            onChange={(val) => toggleEngine(idx, val)}
            trueLabel="OK"
            falseLabel="ISSUE"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hydrant Pressure (kg/cm2)"
          type="number"
          step="0.1"
          value={data.hydrantPressure}
          onChange={(e) => update({ hydrantPressure: e.target.value })}
        />
        <Input
          label="Jockey Runtime (mins)"
          type="number"
          value={data.jockeyRuntime}
          onChange={(e) => update({ jockeyRuntime: e.target.value })}
        />
      </div>
    </div>
  );
};

export const Step3: React.FC<StepProps> = ({ data, update }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
      Step 3: Storage & Leaks
    </h2>
    <div className="grid grid-cols-2 gap-4">
      <Input
        label="TK13 Level (m)"
        type="number"
        step="0.01"
        value={data.tk13Level}
        onChange={(e) => update({ tk13Level: e.target.value })}
      />
      <Input
        label="TK29 Level (m)"
        type="number"
        step="0.01"
        value={data.tk29Level}
        onChange={(e) => update({ tk29Level: e.target.value })}
      />
    </div>

    <div className="space-y-4 border-t pt-4">
      <div>
        <Toggle
          label="Air Leak?"
          checked={data.leakAir}
          onChange={(v) => update({ leakAir: v })}
          trueLabel="YES"
          falseLabel="NO"
        />
        {data.leakAir && (
          <Input
            label="Air Leak Location"
            value={data.leakAirLoc}
            onChange={(e) => update({ leakAirLoc: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      <div>
        <Toggle
          label="Hydrant Leak?"
          checked={data.leakHydrant}
          onChange={(v) => update({ leakHydrant: v })}
          trueLabel="YES"
          falseLabel="NO"
        />
        {data.leakHydrant && (
          <Input
            label="Hydrant Leak Location"
            value={data.leakHydrantLoc}
            onChange={(e) => update({ leakHydrantLoc: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      <div>
        <Toggle
          label="Product Leak?"
          checked={data.leakProduct}
          onChange={(v) => update({ leakProduct: v })}
          trueLabel="YES"
          falseLabel="NO"
        />
        {data.leakProduct && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Select
              label="Type"
              options={['MS', 'HSD', 'Ethanol', 'Bio-Diesel', 'LDO', 'LSHSP']}
              value={data.leakProductType}
              onChange={(e) => update({ leakProductType: e.target.value })}
            />
            <Input
              label="Location"
              value={data.leakProductLoc}
              onChange={(e) => update({ leakProductLoc: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

export const Step4: React.FC<StepProps> = ({ data, update }) => {
  // Effect to check generator duration and alert
  useEffect(() => {
    const hours = parseFloat(data.runningGGDuration);
    if (!isNaN(hours) && hours > 3) {
      alert(
        `⚠️ WARNING: Gas Generator (${data.runningGG}) has run for more than 3 hours!\n\nPlease ask the electrician to change the GG immediately to avoid overheating.`
      );
    }
  }, [data.runningGGDuration]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Step 4: Power
      </h2>
      <Toggle
        label="33KV Grid Power"
        checked={data.power33kv}
        onChange={(v) => update({ power33kv: v })}
        trueLabel="ON"
        falseLabel="OFF"
      />

      {!data.power33kv && (
        <div className="space-y-5 bg-orange-50 p-5 rounded-lg border border-orange-200">
          <h3 className="font-bold text-orange-800 flex items-center gap-2">
            ⚠️ Power Failure - Generator Log
          </h3>

          {/* Initial GG Questions */}
          <div className="space-y-3">
            <Input
              label="Which Gas Generator is running?"
              placeholder="e.g., GG-1"
              value={data.runningGG}
              onChange={(e) => update({ runningGG: e.target.value })}
            />
            <Input
              label="Start Time of GG"
              type="time"
              value={data.runningGGStartTime}
              onChange={(e) => update({ runningGGStartTime: e.target.value })}
            />
            
            <div className="bg-white p-3 rounded border border-orange-100">
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                 Is this GG still running?
               </label>
               <div className="flex items-center gap-2">
                  <Input 
                    label="Run Duration (Hours since power cut)"
                    type="number"
                    step="0.5"
                    value={data.runningGGDuration}
                    onChange={(e) => update({ runningGGDuration: e.target.value })}
                  />
               </div>
               <p className="text-xs text-gray-500 mt-1">If {'>'} 3 hours, please change GG.</p>
            </div>
          </div>

          <div className="border-t border-orange-200 pt-3">
             <Toggle
                label="Has Changeover been done?"
                checked={data.changeoverPerformed}
                onChange={(v) => update({ changeoverPerformed: v })}
                trueLabel="YES"
                falseLabel="NO"
             />
             
             {data.changeoverPerformed && (
                <div className="mt-4 pl-4 border-l-4 border-blue-500 space-y-3">
                   <h4 className="font-semibold text-blue-800 text-sm">New Generator Details</h4>
                   <Input
                      label="Which GG is running NOW?"
                      placeholder="e.g., GG-2"
                      value={data.newGG}
                      onChange={(e) => update({ newGG: e.target.value })}
                   />
                   <Input
                      label="Start Time of New GG"
                      type="time"
                      value={data.newGGStartTime}
                      onChange={(e) => update({ newGGStartTime: e.target.value })}
                   />
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Step5: React.FC<StepProps> = ({ data, update }) => {
  
  // Rake Logic Handler
  const handleRakeStatusChange = (status: string) => {
    update({ rakeStatus: status as RakeStatus });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Step 5: Logistics
      </h2>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Pipeline</h3>
        <Toggle
          label="Pipeline Status"
          checked={data.pipelineReceiving}
          onChange={(v) => update({ pipelineReceiving: v })}
          trueLabel="RECEIVING"
          falseLabel="STOPPED"
        />
        {data.pipelineReceiving && (
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Product"
              options={['MS', 'HSD']}
              value={data.pipelineProduct}
              onChange={(e) => update({ pipelineProduct: e.target.value })}
            />
            <Input
              label="Tank No"
              value={data.pipelineTankNo}
              onChange={(e) => update({ pipelineTankNo: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-gray-700">Rake Management</h3>
        <Select
          label="Rake Status"
          options={['None', 'Placed', 'Unloading', 'Unloading Completed', 'Removed']}
          value={data.rakeStatus}
          onChange={(e) => handleRakeStatusChange(e.target.value)}
        />
        
        {data.rakeStatus === 'Placed' && (
          <Input
            label="Placement Time"
            type="time"
            value={data.rakeTime}
            onChange={(e) => update({ rakeTime: e.target.value })}
          />
        )}

        {data.rakeStatus === 'Unloading' && (
          <Input
            label="Unloading Start Time"
            type="time"
            value={data.rakeTime}
            onChange={(e) => update({ rakeTime: e.target.value })}
          />
        )}

        {data.rakeStatus === 'Unloading Completed' && (
          <div className="space-y-3 bg-blue-50 p-3 rounded">
            <Input
              label="Unloading Completion Time"
              type="time"
              value={data.rakeUnloadingTime}
              onChange={(e) => update({ rakeUnloadingTime: e.target.value })}
            />
             {/* Removal Time is deliberately hidden here as per instructions */}
          </div>
        )}

        {data.rakeStatus === 'Removed' && (
           <Input
           label="Removal Time"
           type="time"
           value={data.rakeRemovalTime}
           onChange={(e) => update({ rakeRemovalTime: e.target.value })}
         />
        )}
      </div>
    </div>
  );
};

export const Step6: React.FC<StepProps> = ({ data, update }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
      Step 6: Security & Misc
    </h2>

    <div className="bg-white p-2 rounded border border-gray-100">
      <Toggle
        label="Office AC & Lights"
        checked={data.officeACLight}
        onChange={(v) => update({ officeACLight: v })}
        trueLabel="ON"
        falseLabel="OFF"
      />
    </div>

    <div className="border-t pt-2">
      <Toggle
        label="C-BACS System"
        checked={data.cbacsFunctional}
        onChange={(v) => update({ cbacsFunctional: v })}
        trueLabel="FUNCTIONAL"
        falseLabel="ISSUE"
      />
      {!data.cbacsFunctional && (
        <Input
          label="C-BACS Issue Details"
          value={data.cbacsIssue}
          onChange={(e) => update({ cbacsIssue: e.target.value })}
          className="mt-2"
        />
      )}
    </div>

    <div className="border-t pt-2">
      <Input
        label="CCTV Running Count (Total 71)"
        type="number"
        value={data.cctvRunning}
        onChange={(e) => update({ cctvRunning: e.target.value })}
      />
      {parseInt(data.cctvRunning || '0') < 71 && (
        <Input
          label="CCTV Issue Details"
          value={data.cctvIssues}
          onChange={(e) => update({ cctvIssues: e.target.value })}
          className="mt-2"
        />
      )}
    </div>

    <div className="grid grid-cols-2 gap-4 border-t pt-2">
      <Input
        label="Watch Tower Obs"
        value={data.observationTower}
        onChange={(e) => update({ observationTower: e.target.value })}
      />
      <Input
        label="Night Vision Obs"
        value={data.observationNightVision}
        onChange={(e) => update({ observationNightVision: e.target.value })}
      />
    </div>

    <TextArea
      label="Final Remarks"
      rows={3}
      value={data.remarks}
      onChange={(e) => update({ remarks: e.target.value })}
    />
  </div>
);