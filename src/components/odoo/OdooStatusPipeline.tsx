import React from 'react';
import { Check } from 'lucide-react';

export interface OdooPipelineStage {
  id: string;
  label: string;
}

interface OdooStatusPipelineProps {
  stages: OdooPipelineStage[];
  currentStageId: string;
  onSelectStage?: (stageId: string) => void;
  isClickable?: boolean;
}

export const OdooStatusPipeline: React.FC<OdooStatusPipelineProps> = ({
  stages,
  currentStageId,
  onSelectStage,
  isClickable = false,
}) => {
  const currentIndex = stages.findIndex((s) => s.id === currentStageId);

  return (
    <div className="inline-flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200/80 text-xs font-semibold overflow-x-auto max-w-full">
      {stages.map((stage, idx) => {
        const isCurrent = stage.id === currentStageId;
        const isPassed = currentIndex > -1 && idx < currentIndex;

        return (
          <button
            key={stage.id}
            type="button"
            disabled={!isClickable}
            onClick={() => onSelectStage && onSelectStage(stage.id)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              isCurrent
                ? 'bg-[#714B67] text-white font-bold shadow-xs'
                : isPassed
                ? 'text-stone-700 hover:bg-stone-200/70 font-medium'
                : 'text-stone-400 hover:text-stone-600'
            } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {isPassed && <Check className="w-3 h-3 text-[#714B67]" />}
            <span>{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
};
