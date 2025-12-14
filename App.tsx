import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, CheckCircle, AlertTriangle, MessageCircle } from 'lucide-react';
import { Step1, Step2, Step3, Step4, Step5, Step6 } from './components/Steps';
import { ReportData, INITIAL_DATA } from './types';
import { checkNotifications, formatWhatsAppReport, saveReportTimestamp } from './utils/helpers';
import { clsx } from 'clsx';

function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [showJockeyModal, setShowJockeyModal] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [finalReport, setFinalReport] = useState('');

  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const updateData = (fields: Partial<ReportData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!data.guardName && !!data.patrolStart && !!data.patrolEnd;
      case 2:
        return !!data.hydrantPressure && !!data.jockeyRuntime;
      case 3:
        if (!data.tk13Level || !data.tk29Level) return false;
        if (data.leakAir && !data.leakAirLoc) return false;
        if (data.leakHydrant && !data.leakHydrantLoc) return false;
        if (data.leakProduct && (!data.leakProductLoc || !data.leakProductType)) return false;
        return true;
      case 4:
        if (!data.power33kv) {
          // If power is OFF, we need at least the running GG details
          if (!data.runningGG || !data.runningGGStartTime) return false;
          // If changeover is done, we need new GG details
          if (data.changeoverPerformed && (!data.newGG || !data.newGGStartTime)) return false;
        }
        return true;
      case 5:
        if (data.pipelineReceiving && (!data.pipelineProduct || !data.pipelineTankNo)) return false;
        // Rake validation based on status
        if (data.rakeStatus === 'Placed' || data.rakeStatus === 'Unloading') {
          if (!data.rakeTime) return false;
        }
        if (data.rakeStatus === 'Unloading Completed') {
           if (!data.rakeUnloadingTime) return false;
        }
        if (data.rakeStatus === 'Removed' && !data.rakeRemovalTime) return false;
        return true;
      case 6:
        if (!data.cctvRunning) return false;
        if (!data.cbacsFunctional && !data.cbacsIssue) return false;
        if (parseInt(data.cctvRunning) < data.cctvTotal && !data.cctvIssues) return false;
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      alert('Please fill in all required fields before proceeding.');
      return;
    }

    // Jockey Warning Logic between Step 2 and 3
    if (step === 2) {
      const runtime = parseInt(data.jockeyRuntime);
      if (runtime < 45 && !data.leakHydrant) {
        setShowJockeyModal(true);
        return; // Pause navigation
      }
    }

    if (step < 6) {
      setStep(step + 1);
    } else {
      generateReport();
    }
  };

  const confirmJockey = () => {
    setShowJockeyModal(false);
    setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateReport = () => {
    const report = formatWhatsAppReport(data);
    setFinalReport(report);
    setReportGenerated(true);
    saveReportTimestamp();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalReport);
    alert('Report copied to clipboard! Open WhatsApp and paste.');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(finalReport)}`;
    window.open(url, '_blank');
  };

  if (reportGenerated) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 space-y-6">
          <div className="text-center space-y-2">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Report Ready</h2>
            <p className="text-gray-500">Review and share</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border whitespace-pre-wrap text-sm font-mono text-gray-700 max-h-96 overflow-y-auto">
            {finalReport}
          </div>
          
          <div className="space-y-3">
             <button
               onClick={shareToWhatsApp}
               className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
             >
               <MessageCircle size={20} />
               Send to WhatsApp
             </button>
             
             <button
               onClick={copyToClipboard}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
             >
               <Copy size={20} />
               Copy to Clipboard
             </button>
             
             <button
               onClick={() => window.location.reload()}
               className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
             >
               Start New Report
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-8 pb-20 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden relative min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-900 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Safety Report-1</h1>
            <span className="text-blue-200 font-mono text-sm">
              Step {step}/6
            </span>
          </div>
          <div className="w-full bg-blue-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {step === 1 && <Step1 data={data} update={updateData} />}
          {step === 2 && <Step2 data={data} update={updateData} />}
          {step === 3 && <Step3 data={data} update={updateData} />}
          {step === 4 && <Step4 data={data} update={updateData} />}
          {step === 5 && <Step5 data={data} update={updateData} />}
          {step === 6 && <Step6 data={data} update={updateData} />}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={clsx(
              'flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors',
              step === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200'
            )}
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md"
          >
            {step === 6 ? 'Finish' : 'Next'}
            {step < 6 && <ChevronRight size={20} />}
          </button>
        </div>

        {/* Jockey Warning Modal */}
        {showJockeyModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl transform scale-100">
              <div className="flex items-center gap-3 text-amber-500">
                <AlertTriangle size={32} />
                <h3 className="text-lg font-bold text-gray-800">Warning</h3>
              </div>
              <p className="text-gray-600">
                Jockey runtime is less than 45 minutes and no hydrant leak is reported.
                <br />
                <br />
                <strong>Did you check the sprinklers?</strong>
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowJockeyModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmJockey}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold shadow-sm"
                >
                  Yes, Checked
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;