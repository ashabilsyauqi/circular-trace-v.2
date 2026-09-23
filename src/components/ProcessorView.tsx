import React from 'react';
import { useCoffee } from '../context/CoffeeContext';

// Processing Mill pipeline: thin shell that renders one module at a time according to
// processorActiveTab (state lives in CoffeeContext, driven by the header's tab strip — same
// pattern as RoasterView).
import { DashboardModule } from './processor/DashboardModule';
import { SourcingModule } from './processor/SourcingModule';
import { BatchesModule } from './processor/BatchesModule';
import { InventoryModule } from './processor/InventoryModule';
import { SellingModule } from './processor/SellingModule';
import { HistoryModule } from './processor/HistoryModule';

export const ProcessorView: React.FC = () => {
  const { processorActiveTab, setProcessorActiveTab } = useCoffee();

  return (
    <div className="space-y-5">
      {processorActiveTab === 'dashboard' && (
        <DashboardModule onNavigate={(tab) => setProcessorActiveTab(tab)} />
      )}
      {processorActiveTab === 'sourcing' && <SourcingModule />}
      {processorActiveTab === 'batches' && <BatchesModule />}
      {processorActiveTab === 'inventory' && <InventoryModule />}
      {processorActiveTab === 'selling' && <SellingModule />}
      {processorActiveTab === 'history' && <HistoryModule />}
    </div>
  );
};
