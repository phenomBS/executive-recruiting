import React, { useMemo, useState } from 'react';
import { RoleSuccessionItem, initialRolesSuccessionData } from '../../data/rolesSuccessionData';
import { getSearchIntelligenceForRole, getSearchIntelligenceForProject, SearchIntelligenceData } from '../../data/projectSearchIntelligenceData';
import type { Project } from '../../types';
import { downloadBlob } from '../../lib/simplePdf';
import { buildCalibrationBriefPdf } from '../../lib/calibrationBriefPdf';
import { DownloadBriefModal, type BriefExportChoices } from './DownloadBriefModal';
import { buildBriefModel } from '../../lib/calibrationBrief';
import {
  Clock,
  Sparkles,
  TrendingUp,
  CalendarPlus,
  Info,
  Download,
  Check,
} from 'lucide-react';
import { IntakeMeetingModal } from '../IntakeMeetingModal';
import { CalibrationScenario, computeDifficulty, getCompetitionSnapshot, initialScenario } from '../../lib/hireDifficulty';
import { ExecutiveScorecard, ScarcityCalculator, CompensationEquity, HuntingGrounds } from './CalibrationSections';

/** Provide either a role (Roles tab) or a project (Projects tab); both render the same calibration screen. */
interface RoleMarketCalibrationTabProps {
  role?: RoleSuccessionItem;
  project?: Project;
}

export function RoleMarketCalibrationTab({ role, project }: RoleMarketCalibrationTabProps) {
  // Projects created from a tracked role reuse that role's calibration benchmarks
  const sourceRole = project?.sourceRoleId
    ? initialRolesSuccessionData.find(r => r.id === project.sourceRoleId)
    : undefined;
  const data: SearchIntelligenceData = sourceRole
    ? { ...getSearchIntelligenceForRole(sourceRole), projectId: project!.id }
    : project
      ? getSearchIntelligenceForProject(project.id, project.title, project.company)
      : getSearchIntelligenceForRole(role as RoleSuccessionItem);

  // One scenario drives the scorecard, scarcity calculator, compensation check and the PDF brief.
  const baseline = useMemo(() => initialScenario(data), [data.projectId, data.roleTitle]);
  const competition = useMemo(() => getCompetitionSnapshot(data), [data.projectId, data.roleTitle]);
  const [scenario, setScenario] = useState<CalibrationScenario>(baseline);
  const [equityMultiple, setEquityMultiple] = useState<number>(3);
  const result = useMemo(() => computeDifficulty(data, scenario, competition), [data, scenario, competition]);
  const baselineResult = useMemo(() => computeDifficulty(data, baseline, competition), [data, baseline, competition]);
  const model = useMemo(
    () => buildBriefModel(data, scenario, competition, result, equityMultiple, s => computeDifficulty(data, s, competition)),
    [data, scenario, competition, result, equityMultiple]
  );

  const [showIntakeModal, setShowIntakeModal] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const defaultBriefName = `Executive Search Calibration Brief: ${data.roleTitle}`;

  const handleDownloadReport = ({ name, clientLogo, companyLogo }: BriefExportChoices) => {
    const slug = name.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Calibration-Brief';
    downloadBlob(buildCalibrationBriefPdf(model, { title: name, clientLogo, companyLogo }), `${slug}.pdf`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const sectionProps = { data, scenario, baseline, competition, result, baselineResult, setScenario, model, equityMultiple, setEquityMultiple };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20">

      <DownloadBriefModal
        isOpen={showDownloadModal}
        onOpenChange={setShowDownloadModal}
        defaultName={defaultBriefName}
        onDownload={handleDownloadReport}
      />

      {showIntakeModal && (
        <IntakeMeetingModal onClose={() => setShowIntakeModal(false)} />
      )}

      {/* Top Banner: Intake Preparation Intelligence Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 lg:p-8 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Pre-Intake Market Calibration
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-300 font-medium">
              Calibrated: {data.lastCalibratedDate}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-400">
              {data.benchmarkSource}
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Market Calibration: {data.roleTitle}
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Four steps to a defensible intake: read the reality check, simulate the requirements, test compensation and equity, then pick where to hunt. Download the one-page brief to share with the hiring manager.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setShowDownloadModal(true)}
            className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-slate-400" />}
            Download Calibration Brief (PDF)
          </button>

          <button
            onClick={() => setShowIntakeModal(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
            Schedule Intake Meeting
          </button>
        </div>
      </div>

      <ExecutiveScorecard {...sectionProps} />
      <ScarcityCalculator {...sectionProps} />
      <CompensationEquity {...sectionProps} />
      <HuntingGrounds {...sectionProps} />

      <div className="space-y-8">
        {/* ========================================================================= */}
        {/* 5. MACRO TENURE & FLIGHT RISK (BASELINE PTM) WIDGET */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Supporting Insight: Macro Tenure & Flight Risk (Baseline PTM)</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                    Propensity to Move (PTM)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cohort tenure velocity, equity vesting cliff milestones, and prime outbound sourcing windows.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Role Tenure</span>
                <span className="text-xl font-black text-slate-900">
                  {data.macroTenure.averageTenureYears} <span className="text-xs font-normal text-slate-500">years</span>
                </span>
              </div>
              <div className="text-right border-l border-slate-200 pl-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vesting Cliff Exits</span>
                <span className="text-xl font-black text-rose-700">
                  {data.macroTenure.historicalCliffExitPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Timeline Horizon Visualization */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tenure Horizon & Propensity to Move Distribution
                </h4>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Peak Mobility Window: {data.macroTenure.vestingCliffWindowMonths}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.macroTenure.flightRiskDistribution.map((item, idx) => {
                  const isPeak = item.riskLevel === 'Peak Opportunity';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isPeak
                          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40 shadow-sm'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800">{item.tenureRange}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isPeak
                              ? 'bg-amber-200 text-amber-950 font-black'
                              : item.riskLevel === 'Low'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.riskLevel}
                          </span>
                        </div>
                        <span className="text-2xl font-black text-slate-900 block mb-2">
                          {item.percentage}%
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {isPeak && (
                        <div className="mt-3 pt-2 border-t border-amber-200/80 text-[10px] font-bold text-amber-900 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-700" /> Sourcing Focus Window
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* The Intake Value Callout */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    The Intake Value & Recruiter Reality Check
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-normal">
                    {data.macroTenure.intakeTakeaway}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
