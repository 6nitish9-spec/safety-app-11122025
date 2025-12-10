import React from 'react';
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
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">
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
              options={['MS', 'HSD', 'Ethanol', 'Bio-Diesel']}
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
  const updateGen = (id: number, field: string, val: any) => {
    const newGens = data.generators.map((g) =>
      g.id === id ? { ...g, [field]: val } : g
    );
    update({ generators: newGens });
  };

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
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700">Generators</h3>
          {data.generators.map((gen) => (
            <div key={gen.id} className="border-b pb-3 last:border-0">
              <Toggle
                label={`Generator ${gen.id}`}
                checked={gen.running}
                onChange={(v) => updateGen(gen.id, 'running', v)}
                trueLabel="RUNNING"
                falseLabel="STOPPED"
              />
              {gen.running && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    label="Start Time"
                    type="time"
                    value={gen.startTime}
                    onChange={(e) =>
                      updateGen(gen.id, 'startTime', e.target.value)
                    }
                  />
                  <Input
                    label="End Time"
                    type="time"
                    value={gen.endTime}
                    onChange={(e) =>
                      updateGen(gen.id, 'endTime', e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          ))}
          <Select
            label="Changeover Status"
            options={['Manual', 'Auto']}
            value={data.changeoverStatus}
            onChange={(e) => update({ changeoverStatus: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};

export const Step5: React.FC<StepProps> = ({ data, update }) => (
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
            options={['MS', 'HSD', 'Ethanol']}
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
        options={['None', 'Placed', 'Unloading', 'Removed']}
        value={data.rakeStatus}
        onChange={(e) => update({ rakeStatus: e.target.value as RakeStatus })}
      />
      {data.rakeStatus !== 'None' && (
        <Input
          label={
            data.rakeStatus === 'Placed'
              ? 'Placement Time'
              : data.rakeStatus === 'Unloading'
              ? 'Unloading Start Time'
              : 'Release Time'
          }
          type="time"
          value={data.rakeTime}
          onChange={(e) => update({ rakeTime: e.target.value })}
        />
      )}
    </div>
  </div>
);

export const Step6: React.FC<StepProps> = ({ data, update }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
      Step 6: Security & Misc
    </h2>

    <Toggle
      label="Office AC & Lights"
      checked={data.officeACLight}
      onChange={(v) => update({ officeACLight: v })}
      trueLabel="OK"
      falseLabel="ISSUE"
    />

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
