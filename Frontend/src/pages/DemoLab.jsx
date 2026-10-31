import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Activity, AlertTriangle, CheckCircle2, Database, Download, FileJson,
  FileSpreadsheet, Image, LoaderCircle, Play, ShieldAlert, Upload, Video,
} from 'lucide-react';
import ErrorState from '../components/common/ErrorState';
import LoadingState from '../components/common/LoadingState';
import StatusBadge from '../components/common/StatusBadge';
import { getSensorDefinitions } from '../services/sensorService';
import { getRiskAssessment } from '../services/riskService';
import {
  createDemoVisionEvent, getMlStatus, importDemoSensorFile,
  importModelFeatureFile, ingestDemoSensorReadings, predictVisionMedia,
} from '../services/demoService';

const SCENARIOS = {
  safe: {
    label: 'Safe shift',
    description: 'Normal operating conditions',
    readings: { temperature: 27, humidity: 44, gas: 18, smoke: 4 },
  },
  warning: {
    label: 'Elevated conditions',
    description: 'Test warning alerts and risk scoring',
    readings: { temperature: 38, humidity: 66, gas: 62, smoke: 12 },
  },
  critical: {
    label: 'Critical incident',
    description: 'Test critical alerts and dashboard response',
    readings: { temperature: 48, humidity: 82, gas: 95, smoke: 36 },
  },
};

const MODEL_FEATURES = [
  'Temperature[C]', 'Humidity[%]', 'TVOC[ppb]', 'eCO2[ppm]',
  'Raw H2', 'Raw Ethanol', 'Pressure[hPa]', 'PM1.0',
  'PM2.5', 'NC0.5', 'NC1.0', 'NC2.5',
];

const MODEL_EXAMPLE = {
  'Temperature[C]': 25,
  'Humidity[%]': 50,
  'TVOC[ppb]': 200,
  'eCO2[ppm]': 400,
  'Raw H2': 13000,
  'Raw Ethanol': 19000,
  'Pressure[hPa]': 939,
  'PM1.0': 1.2,
  'PM2.5': 2.4,
  'NC0.5': 8.2,
  'NC1.0': 1.5,
  'NC2.5': 0.3,
};

function downloadTemplate(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Panel({ title, description, icon: Icon, children, className = '' }) {
  return (
    <section className={`demo-panel rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6 ${className}`}>
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-primary-light p-2.5 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-text sm:text-lg">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ResultNotice({ notice, error }) {
  if (!notice && !error) return null;
  return (
    <div
      role={error ? 'alert' : 'status'}
      className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
        error
          ? 'border-critical-border bg-critical-bg text-critical'
          : 'border-safe-border bg-safe-bg text-safe'
      }`}
    >
      {error ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{error || notice}</span>
    </div>
  );
}

export default function DemoLab() {
  const { selectedSite, sites } = useOutletContext();
  const selectedSiteName = sites.find((site) => site.id === selectedSite)?.name || selectedSite;
  const [definitions, setDefinitions] = useState([]);
  const [mlStatus, setMlStatus] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [manualReadings, setManualReadings] = useState({
    temperature: '27',
    humidity: '44',
    gas: '18',
    smoke: '4',
  });
  const [zone, setZone] = useState('Zone A — Assembly Line');
  const [cameraId, setCameraId] = useState('CAM-DEMO-01');
  const [visionFile, setVisionFile] = useState(null);
  const [visionPreview, setVisionPreview] = useState('');
  const [visionResult, setVisionResult] = useState(null);
  const [modelResult, setModelResult] = useState(null);
  const [sensorFile, setSensorFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [busy, setBusy] = useState('');
  const [notices, setNotices] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    setLoadError('');
    setModelResult(null);
    setVisionResult(null);
    setSensorFile(null);
    setModelFile(null);
    setVisionFile(null);
    setNotices({});
    setErrors({});
    Promise.all([getSensorDefinitions(selectedSite), getMlStatus(), getRiskAssessment(selectedSite)])
      .then(([sensorDefinitions, status, currentRisk]) => {
        if (!active) return;
        setDefinitions(sensorDefinitions);
        setMlStatus(status);
        setRisk(currentRisk);
        const initial = sensorDefinitions.find((definition) => definition.type === 'temperature');
        if (initial) setZone(initial.zone);
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      });

    return () => {
      active = false;
    };
  }, [selectedSite]);

  useEffect(() => {
    if (!visionFile) {
      setVisionPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(visionFile);
    setVisionPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [visionFile]);

  const clearFeedback = (key) => {
    setNotices((current) => ({ ...current, [key]: '' }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const runAction = async (key, action, successMessage) => {
    setBusy(key);
    clearFeedback(key);
    try {
      const result = await action();
      if (successMessage) setNotices((current) => ({ ...current, [key]: successMessage(result) }));
      return result;
    } catch (error) {
      setErrors((current) => ({ ...current, [key]: error.message }));
      return null;
    } finally {
      setBusy('');
    }
  };

  const scenarioRequests = (scenario) => Object.entries(scenario.readings).map(([type, value]) => {
    const definition = definitions.find((item) => item.type === type);
    return {
      type,
      value,
      siteId: selectedSite,
      zone: definition?.zone || 'Demo floor',
    };
  });

  const refreshRisk = async () => {
    try {
      setRisk(await getRiskAssessment(selectedSite));
    } catch (error) {
      setErrors((current) => ({ ...current, dashboard: error.message }));
    }
  };

  const runScenario = async (scenario) => {
    const result = await runAction(
      'scenario',
      () => ingestDemoSensorReadings(scenarioRequests(scenario)),
      (response) => `${response.imported} ${response.dataSource.toLowerCase()} readings ingested. Dashboard alerts and rule-based risk have been recalculated.`,
    );
    if (result) await refreshRisk();
  };

  const submitManualReading = async (event) => {
    event.preventDefault();
    const invalidReading = Object.entries(manualReadings).find(([, value]) => !Number.isFinite(Number(value)));
    if (invalidReading) {
      setErrors((current) => ({ ...current, manual: `Enter a finite ${invalidReading[0]} reading.` }));
      return;
    }
    const readings = definitions.map((definition) => ({
      type: definition.type,
      value: Number(manualReadings[definition.type]),
      siteId: selectedSite,
      zone: definition.zone,
    }));
    const result = await runAction(
      'manual',
      () => ingestDemoSensorReadings(readings),
      (response) => `All ${response.imported} sensor readings were submitted to this site. Risk and alerts were recalculated together.`,
    );
    if (result) await refreshRisk();
  };

  const submitSensorFile = async (event) => {
    event.preventDefault();
    if (!sensorFile) {
      setErrors((current) => ({ ...current, sensorFile: 'Choose a CSV or JSON sensor data file.' }));
      return;
    }
    const result = await runAction(
      'sensorFile',
      () => importDemoSensorFile(sensorFile, selectedSite),
      (response) => `Imported ${response.imported} demo sensor readings. Dashboard, alerts, charts, and risk now use the imported records.`,
    );
    if (result) {
      setSensorFile(null);
      event.target.reset();
      await refreshRisk();
    }
  };

  const submitModelFile = async (event) => {
    event.preventDefault();
    if (!modelFile) {
      setErrors((current) => ({ ...current, modelFile: 'Choose a CSV or JSON model feature file.' }));
      return;
    }
    const result = await runAction(
      'modelFile',
      () => importModelFeatureFile(modelFile, selectedSite),
      (response) => `${response.predictions.length} rows predicted using the trained sensor model.`,
    );
    if (result) {
      setModelResult(result);
      setModelFile(null);
      event.target.reset();
    }
  };

  const submitVision = async (event) => {
    event.preventDefault();
    if (!visionFile) {
      setErrors((current) => ({ ...current, vision: 'Choose an image or video file to run PPE inference.' }));
      return;
    }
    const result = await runAction(
      'vision',
      () => predictVisionMedia(visionFile, cameraId.trim(), zone.trim() || 'Demo floor', selectedSite),
      (response) => `${response.detectionCount} detections from ${response.sampledFrames} ${response.mediaType === 'video' ? 'sampled video frames' : 'image'}. Events were added to the vision, alerts, and risk workflows.`,
    );
    if (result) {
      setVisionResult(result);
      setVisionFile(null);
      event.target.reset();
      await refreshRisk();
    }
  };

  const addPpeDemoEvent = async (className) => {
    const result = await runAction(
      'ppeDemo',
      () => createDemoVisionEvent({
        eventType: 'ppe_detection',
        className,
        confidence: 0.92,
        violation: ['no-helmet', 'no-vest'].includes(className),
        cameraId: cameraId.trim() || 'CAM-DEMO-01',
        zone: zone.trim() || 'Demo floor',
        siteId: selectedSite,
      }),
      (event) => `Recorded a simulated ${event.className} event (${Math.round(event.confidence * 100)}% demo confidence) in the normal vision and risk workflow.`,
    );
    if (result) await refreshRisk();
  };

  if (loadError && !definitions.length) return <ErrorState message={loadError} onRetry={() => window.location.reload()} />;
  if (!definitions.length) return <LoadingState message="Preparing the demo workspace…" />;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <header className="demo-page-header overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold tracking-wide text-primary">
              <Database className="h-3.5 w-3.5" /> LIVE + DEMO DATA
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">Demo &amp; Data Lab</h1>
            <p className="mt-1 text-sm font-medium text-primary">Selected site: {selectedSiteName}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
              Explore the real monitoring workflow without physical sensors. Demo readings are labeled, stored separately by source, and processed by the same dashboard, alerts, and risk rules as live sensor readings.
            </p>
          </div>
          <div className="min-w-52 rounded-xl border border-border bg-surface-alt p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Current risk</p>
            {risk ? (
              <div className="mt-2 flex items-center gap-3">
                <StatusBadge status={risk.state.toLowerCase()} />
                <span className="text-2xl font-bold text-text">{risk.score}<span className="ml-1 text-sm font-medium text-text-muted">/100</span></span>
              </div>
            ) : <p className="mt-2 text-sm text-text-muted">Add a reading to create an assessment</p>}
            <p className="mt-2 text-xs text-text-muted">Rule-based from the latest sensor observations</p>
          </div>
        </div>
        {loadError && <p role="status" className="mt-4 text-sm text-warning">Model status is temporarily unavailable: {loadError}</p>}
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Run a sensor scenario"
          description="One click submits four timestamped demo readings together. This does not replace or modify physical sensor input."
          icon={Activity}
        >
          <p className="mb-4 rounded-lg bg-surface-alt px-3 py-2 text-sm text-text-muted">
            These readings will be stored under the site selected in the top navigation.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(SCENARIOS).map(([key, scenario]) => (
              <button
                key={key}
                type="button"
                disabled={Boolean(busy)}
                onClick={() => runScenario(scenario)}
                className={`demo-scenario demo-scenario--${key} rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-wait disabled:opacity-60`}
              >
                <span className="text-sm font-semibold text-text">{scenario.label}</span>
                <span className="mt-1 block min-h-10 text-xs leading-relaxed text-text-muted">{scenario.description}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  {busy === 'scenario' ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  Run scenario
                </span>
              </button>
            ))}
          </div>
          <ResultNotice notice={notices.scenario} error={errors.scenario} />
        </Panel>

        <Panel
          title="Enter all sensor readings together"
          description="Submit temperature, humidity, gas, and smoke in one atomic demo batch. The full site risk assessment and related alerts are recalculated together."
          icon={FileSpreadsheet}
        >
          <form onSubmit={submitManualReading} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {definitions.map((definition) => (
                <label key={definition.type} className="block text-sm font-medium capitalize text-text">
                  {definition.label} <span className="text-text-muted">({definition.unit})</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={manualReadings[definition.type]}
                  onChange={(event) => setManualReadings((current) => ({
                    ...current,
                    [definition.type]: event.target.value,
                  }))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary"
                />
                  <span className="mt-1 block text-xs font-normal text-text-muted">{definition.zone}</span>
                </label>
              ))}
            </div>
            <button type="submit" disabled={Boolean(busy)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60">
              {busy === 'manual' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Submit all 4 demo readings
            </button>
          </form>
          <ResultNotice notice={notices.manual} error={errors.manual} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Import sensor history"
          description="Upload CSV or JSON rows of temperature, humidity, gas, and smoke readings. Each row is validated and ingested into normal monitoring, charts, alert, and risk workflows."
          icon={Upload}
        >
          <form onSubmit={submitSensorFile} className="space-y-4">
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-alt px-4 py-5 text-center transition hover:border-primary/50">
              <input
                type="file"
                accept=".csv,.json,text/csv,application/json"
                className="sr-only"
                onChange={(event) => { setSensorFile(event.target.files?.[0] || null); clearFeedback('sensorFile'); }}
              />
              {sensorFile ? <FileSpreadsheet className="mb-2 h-7 w-7 text-primary" /> : <Upload className="mb-2 h-7 w-7 text-text-muted" />}
              <span className="text-sm font-semibold text-text">{sensorFile?.name || 'Choose a CSV or JSON file'}</span>
              <span className="mt-1 text-xs text-text-muted">Up to 500 records · 2 MB maximum</span>
            </label>
            <div className="rounded-xl bg-surface-alt p-3 text-xs leading-relaxed text-text-muted">
              CSV columns: <code>type,value,siteId,zone,recordedAt</code>. JSON: an array of the same fields, or <code>{'{ "readings": [...] }'}</code>. Site, zone, and timestamp are optional.
            </div>
            <button type="submit" disabled={Boolean(busy)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60">
              {busy === 'sensorFile' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Import demo readings
            </button>
          </form>
          <ResultNotice notice={notices.sensorFile} error={errors.sensorFile} />
        </Panel>

        <Panel
          title="Run the trained sensor model"
          description="Upload rows with all 12 features expected by the trained joblib classifier. This runs the actual model; it does not invent fallback predictions."
          icon={ShieldAlert}
        >
          <div className={`mb-4 flex items-center gap-2 rounded-xl border p-3 text-sm ${mlStatus?.enabled ? 'border-safe-border bg-safe-bg text-safe' : 'border-warning-border bg-warning-bg text-warning'}`}>
            {mlStatus?.enabled ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            <span>{mlStatus?.enabled ? 'Sensor model is ready.' : 'Sensor model is unavailable. Configure ML_ENABLED and its Python dependencies to run predictions.'}</span>
          </div>
          <form onSubmit={submitModelFile} className="space-y-4">
            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-alt px-4 py-5 text-center transition hover:border-primary/50">
              <input
                type="file"
                accept=".csv,.json,text/csv,application/json"
                className="sr-only"
                onChange={(event) => { setModelFile(event.target.files?.[0] || null); clearFeedback('modelFile'); }}
              />
              <FileJson className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-semibold text-text">{modelFile?.name || 'Choose a model-feature CSV or JSON file'}</span>
              <span className="mt-1 text-xs text-text-muted">Up to 100 prediction rows</span>
            </label>
            <details className="rounded-xl bg-surface-alt p-3 text-xs text-text-muted">
              <summary className="cursor-pointer font-medium text-text">Required feature columns</summary>
              <p className="mt-2 leading-relaxed">{MODEL_FEATURES.join(', ')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => downloadTemplate('industrialguard-model-template.csv', `${MODEL_FEATURES.join(',')}\n${MODEL_FEATURES.map((feature) => MODEL_EXAMPLE[feature]).join(',')}\n`, 'text/csv')}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 font-medium text-text hover:border-primary"
                >
                  <Download className="h-3.5 w-3.5" /> CSV template
                </button>
                <button
                  type="button"
                  onClick={() => downloadTemplate('industrialguard-model-template.json', JSON.stringify([{ features: MODEL_EXAMPLE }], null, 2), 'application/json')}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 font-medium text-text hover:border-primary"
                >
                  <Download className="h-3.5 w-3.5" /> JSON template
                </button>
              </div>
            </details>
            <button type="submit" disabled={Boolean(busy) || !mlStatus?.enabled} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
              {busy === 'modelFile' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
              Predict uploaded rows
            </button>
          </form>
          <ResultNotice notice={notices.modelFile} error={errors.modelFile} />
          {modelResult && (
            <div className="mt-4 max-h-72 space-y-2 overflow-auto rounded-xl border border-border p-3">
              {modelResult.predictions.map((prediction) => (
                <div key={prediction.row} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-text-muted">Row {prediction.row}{prediction.targetName ? ` · ${prediction.targetName}` : ''}</span>
                  <span className="font-semibold text-text">{String(prediction.prediction)}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Computer-vision image & video"
          description="Run PPE detection on a JPEG, PNG, WebP, BMP image or a video up to 60 seconds. Video is sampled every two seconds, with every detection saved as a vision event."
          icon={Image}
        >
          <div className={`mb-4 flex items-center gap-2 rounded-xl border p-3 text-sm ${mlStatus?.visionEnabled ? 'border-safe-border bg-safe-bg text-safe' : 'border-warning-border bg-warning-bg text-warning'}`}>
            {mlStatus?.visionEnabled ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            <span>{mlStatus?.visionEnabled ? 'YOLO vision model is ready.' : 'Image/video inference requires the configured YOLO model and ML Python dependencies.'}</span>
          </div>
          <form onSubmit={submitVision} className="space-y-4">
            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-alt px-4 py-5 text-center transition hover:border-primary/50">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/bmp,video/mp4,video/quicktime,video/x-msvideo,video/webm,.mkv"
                className="sr-only"
                onChange={(event) => {
                  setVisionFile(event.target.files?.[0] || null);
                  setVisionResult(null);
                  clearFeedback('vision');
                }}
              />
              {visionFile?.type.startsWith('video/') ? <Video className="mb-2 h-6 w-6 text-primary" /> : <Image className="mb-2 h-6 w-6 text-primary" />}
              <span className="text-sm font-semibold text-text">{visionFile?.name || 'Choose an image or video'}</span>
              <span className="mt-1 text-xs text-text-muted">Images up to 10 MB · Videos up to 100 MB and 60 seconds</span>
            </label>

            {visionPreview && visionFile?.type.startsWith('image/') && (
              <img src={visionPreview} alt="Selected image preview" className="max-h-64 w-full rounded-xl border border-border bg-surface-alt object-contain" />
            )}
            {visionPreview && visionFile?.type.startsWith('video/') && (
              <video src={visionPreview} controls className="max-h-64 w-full rounded-xl border border-border bg-black" />
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-text">
                Camera
                <input value={cameraId} onChange={(event) => setCameraId(event.target.value)} required className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary" />
              </label>
              <label className="text-sm font-medium text-text">
                Zone
                <input value={zone} onChange={(event) => setZone(event.target.value)} required className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary" />
              </label>
            </div>
            <button type="submit" disabled={Boolean(busy) || !mlStatus?.visionEnabled} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
              {busy === 'vision' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
              Run actual PPE inference
            </button>
          </form>
          <ResultNotice notice={notices.vision} error={errors.vision} />
          {visionResult && (
            <div className="mt-4 rounded-xl border border-border bg-surface-alt p-4">
              <p className="text-sm font-semibold text-text">
                {visionResult.detectionCount} detections
                {visionResult.mediaType === 'video' ? ` · ${visionResult.sampledFrames} frames · ${visionResult.durationSeconds}s` : ' · image'}
              </p>
              {visionResult.detections.length === 0 ? (
                <p className="mt-2 text-sm text-text-muted">No objects were detected in this input.</p>
              ) : (
                <ul className="mt-3 max-h-56 space-y-2 overflow-auto">
                  {visionResult.detections.map((detection, index) => (
                    <li key={`${detection.eventId}-${index}`} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-text">
                        {detection.className}
                        {visionResult.mediaType === 'video' ? ` · ${detection.timestampSeconds.toFixed(1)}s` : ''}
                      </span>
                      <span className="text-text-muted">{Math.round(detection.confidence * 100)}% confidence{detection.violation ? ' · violation' : ''}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Panel>

        <Panel
          title="Simulate a PPE event"
          description="When optional camera inference dependencies are unavailable, record a clearly labeled synthetic PPE event to exercise the existing vision alert and risk pipeline."
          icon={Video}
        >
          <p className="mb-4 rounded-xl border border-warning-border bg-warning-bg p-3 text-sm leading-relaxed text-warning">
            Simulated detections are test inputs, not computer-vision predictions. Actual image and video predictions are available in the panel next to this one when YOLO is configured.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" disabled={Boolean(busy)} onClick={() => addPpeDemoEvent('no-helmet')} className="rounded-xl border border-critical-border bg-critical-bg p-4 text-left transition hover:shadow-md disabled:opacity-60">
              <span className="block text-sm font-semibold text-critical">Simulate no helmet</span>
              <span className="mt-1 block text-xs text-text-muted">Creates a synthetic safety violation</span>
            </button>
            <button type="button" disabled={Boolean(busy)} onClick={() => addPpeDemoEvent('helmet')} className="rounded-xl border border-safe-border bg-safe-bg p-4 text-left transition hover:shadow-md disabled:opacity-60">
              <span className="block text-sm font-semibold text-safe">Simulate PPE compliant</span>
              <span className="mt-1 block text-xs text-text-muted">Creates a synthetic helmet detection</span>
            </button>
          </div>
          <ResultNotice notice={notices.ppeDemo} error={errors.ppeDemo} />
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-semibold text-text">A note on prediction quality</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              The dashboard risk score is based on the configured sensor threshold and PPE event rules. The separately trained sensor model and YOLO detector produce their own outputs when their model files and Python dependencies are enabled. Results depend on input quality and model coverage; no system can guarantee perfect predictions.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
