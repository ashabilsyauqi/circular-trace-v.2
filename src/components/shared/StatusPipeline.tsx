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

// "Statusbar" widget: a row of chevron/arrow-shaped stage tabs, current stage
// highlighted solid, passed stages checked, upcoming stages muted.
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
    <div className="flex items-stretch text-xs font-bold overflow-x-auto max-w-full py-0.5 scrollbar-none">
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
                ? 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)'
                : 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)',
              marginLeft: isFirst ? 0 : -10,
            }}
            className={`relative px-4 py-2 whitespace-nowrap flex items-center gap-1.5 transition-all select-none ${
              isSelected
                ? 'bg-amber-600 text-white z-20 shadow-xs font-black ring-2 ring-amber-600/40'
                : isBatchMilestone
                  ? 'bg-amber-100 text-amber-900 z-10 hover:bg-amber-200 border-y border-amber-300/80 font-bold'
                  : isPassed
                    ? 'bg-stone-200 text-stone-700 hover:bg-stone-300 font-semibold'
                    : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600 font-medium'
            } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {isPassed && <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-700'} font-black`} />}
            <span className={isFirst ? '' : 'pl-1.5'}>{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
};
