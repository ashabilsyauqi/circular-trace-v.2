import React from 'react';
import { Check } from 'lucide-react';

export interface PipelineStage {
  id: string;
  label: string;
}

interface StatusPipelineProps {
  stages: PipelineStage[];
  currentStageId: string;
  onSelectStage?: (stageId: string) => void;
  isClickable?: boolean;
}

// "Statusbar" widget: a row of chevron/arrow-shaped stage tabs, current stage
// highlighted solid, passed stages checked, upcoming stages muted.
export const StatusPipeline: React.FC<StatusPipelineProps> = ({
  stages,
  currentStageId,
  onSelectStage,
  isClickable = false,
}) => {
  const currentIndex = stages.findIndex((s) => s.id === currentStageId);

  return (
    <div className="flex items-stretch text-xs font-bold overflow-x-auto max-w-full">
      {stages.map((stage, idx) => {
        const isCurrent = stage.id === currentStageId;
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
            className={`relative px-4 py-1.5 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              isCurrent
                ? 'bg-amber-600 text-white z-10'
                : isPassed
                  ? 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  : 'bg-stone-100 text-stone-400'
            } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {isPassed && <Check className="w-3 h-3" />}
            <span className={isFirst ? '' : 'pl-1.5'}>{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
};
