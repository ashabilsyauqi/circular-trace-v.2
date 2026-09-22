import React from 'react';
import { Check } from 'lucide-react';

export interface PipelineStage {
  id: string;
  label: string;
}

interface StatusPipelineProps {
  stages: PipelineStage[];
  currentStageId: string;
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
  isClickable?: boolean;
}

// Skripsi ERP Statusbar Widget: Chevron stage steps
export const StatusPipeline: React.FC<StatusPipelineProps> = ({
  stages,
  currentStageId,
  selectedStageId,
  onSelectStage,
  isClickable = false,
}) => {
  const currentIndex = stages.findIndex((s) => s.id === currentStageId);
  const activeViewId = selectedStageId || currentStageId;

  return (
    <div className="o_statusbar_status flex items-stretch text-xs font-bold overflow-x-auto max-w-full py-0.5 no-scrollbar">
      {stages.map((stage, idx) => {
        const isSelected = stage.id === activeViewId;
        const isBatchMilestone = stage.id === currentStageId;
        const isPassed = currentIndex > -1 && idx < currentIndex;
        const isFirst = idx === 0;

        return (
          <button
            key={stage.id}
            type="button"
            disabled={!isClickable}
            onClick={() => onSelectStage && onSelectStage(stage.id)}
            style={{
              clipPath: isFirst
                ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
              marginLeft: isFirst ? 0 : -8,
            }}
            className={`o_arrow_button relative px-4 py-2 whitespace-nowrap flex items-center gap-1.5 transition-all select-none ${
              isSelected
                ? 'active bg-blue-600 text-white z-20 shadow-xs font-black'
                : isBatchMilestone
                  ? 'bg-blue-100 text-blue-950 z-10 hover:bg-blue-200 font-bold border-y border-blue-300'
                  : isPassed
                    ? 'completed bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 font-medium'
            } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {isPassed && (
              <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'} shrink-0`} />
            )}
            <span className={isFirst ? '' : 'pl-1.5'}>{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
};

