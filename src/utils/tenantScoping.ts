import {
  AppUser,
  CoffeeFarm,
  FarmerHarvestLot,
  ProcessedGreenBeanLot,
  SupplyChainTransaction,
  VerificationStamp,
} from '../types/coffee';
import { ProcessingBatch } from '../types/processorErp';

export interface ScopedTenantData {
  isSuperAdmin: boolean;
  scopedFarmers: AppUser[];
  scopedFarms: CoffeeFarm[];
  scopedLots: FarmerHarvestLot[];
  scopedProcessors: AppUser[];
  scopedBatches: ProcessingBatch[];
  scopedProcessedLots: ProcessedGreenBeanLot[];
  scopedIctOfficers: AppUser[];
  scopedTransactions: SupplyChainTransaction[];
  scopedStamps: VerificationStamp[];
}

export function getScopedTenantData(
  currentUser: AppUser | null,
  data: {
    users?: AppUser[];
    coffeeFarms?: CoffeeFarm[];
    farmerLots?: FarmerHarvestLot[];
    processingBatches?: ProcessingBatch[];
    processedLots?: ProcessedGreenBeanLot[];
    transactions?: SupplyChainTransaction[];
    verificationStamps?: VerificationStamp[];
  }
): ScopedTenantData {
  const users = data.users || [];
  const coffeeFarms = data.coffeeFarms || [];
  const farmerLots = data.farmerLots || [];
  const processingBatches = data.processingBatches || [];
  const processedLots = data.processedLots || [];
  const transactions = data.transactions || [];
  const verificationStamps = data.verificationStamps || [];

  const isSuperAdmin = currentUser?.role === 'super_admin';

  if (!currentUser) {
    return {
      isSuperAdmin: false,
      scopedFarmers: [],
      scopedFarms: [],
      scopedLots: [],
      scopedProcessors: [],
      scopedBatches: [],
      scopedProcessedLots: [],
      scopedIctOfficers: [],
      scopedTransactions: [],
      scopedStamps: [],
    };
  }

  if (isSuperAdmin) {
    return {
      isSuperAdmin: true,
      scopedFarmers: users.filter((u) => u.role === 'petani' || u.assignedService === 'petani'),
      scopedFarms: coffeeFarms,
      scopedLots: farmerLots,
      scopedProcessors: users.filter((u) => u.role === 'pengolah' || u.assignedService === 'pengolah'),
      scopedBatches: processingBatches,
      scopedProcessedLots: processedLots,
      scopedIctOfficers: users.filter((u) => u.role === 'ict' || (u.assignedService as unknown) === 'ict'),
      scopedTransactions: transactions,
      scopedStamps: verificationStamps,
    };
  }

  const userKtId = (currentUser.kelompokTaniId || currentUser.id || '').trim().toLowerCase();
  const userOrg = (currentUser.organization || currentUser.kelompokTaniName || '').trim().toLowerCase();

  // 1. Scoped Farmers
  const scopedFarmers = users.filter((u) => {
    const isFarmer = u.role === 'petani' || u.assignedService === 'petani';
    if (!isFarmer) return false;

    if (currentUser.role === 'petani') {
      return u.id === currentUser.id;
    }

    const farmerKtId = (u.kelompokTaniId || '').trim().toLowerCase();
    const farmerOrg = (u.organization || u.kelompokTaniName || '').trim().toLowerCase();

    const isSameKtId = Boolean(
      (userKtId && farmerKtId && (userKtId === farmerKtId || userKtId === u.id?.toLowerCase() || farmerKtId === currentUser.id?.toLowerCase())) ||
      (currentUser.kelompokTaniId && u.kelompokTaniId === currentUser.kelompokTaniId)
    );

    const isSameOrg = Boolean(
      userOrg && farmerOrg && (
        farmerOrg === userOrg ||
        (userOrg.length > 5 && farmerOrg.includes(userOrg)) ||
        (farmerOrg.length > 5 && userOrg.includes(farmerOrg))
      )
    );

    return isSameKtId || isSameOrg;
  });

  // 2. Scoped Farms
  const scopedFarms = coffeeFarms.filter((farm) => {
    if (currentUser.role === 'petani') {
      return farm.farmerId === currentUser.id;
    }
    const matchesFarmer = scopedFarmers.some((farmer) => farmer.id === farm.farmerId);
    const matchesUser = farm.farmerId === currentUser.id;
    return matchesFarmer || matchesUser;
  });

  // 3. Scoped Harvest Lots
  const scopedLots = farmerLots.filter((lot) => {
    if (currentUser.role === 'petani') {
      return lot.farmerId === currentUser.id;
    }
    const matchesFarmer = scopedFarmers.some((farmer) => farmer.id === lot.farmerId);
    const matchesUser = lot.farmerId === currentUser.id;
    const lotKtId = (lot.kelompokTaniId || '').trim().toLowerCase();
    const matchesKtId = Boolean(userKtId && lotKtId && userKtId === lotKtId);
    return matchesFarmer || matchesUser || matchesKtId;
  });

  // 4. Scoped Processors
  const scopedProcessors = users.filter((u) => {
    const isProc = u.role === 'pengolah' || u.assignedService === 'pengolah';
    if (!isProc) return false;

    if (currentUser.role === 'pengolah') {
      return u.id === currentUser.id;
    }

    const procKtId = (u.kelompokTaniId || '').trim().toLowerCase();
    const procOrg = (u.organization || u.kelompokTaniName || '').trim().toLowerCase();

    const isSameKtId = Boolean(
      (userKtId && procKtId && (userKtId === procKtId || userKtId === u.id?.toLowerCase() || procKtId === currentUser.id?.toLowerCase())) ||
      (currentUser.kelompokTaniId && u.kelompokTaniId === currentUser.kelompokTaniId)
    );

    const isSameOrg = Boolean(
      userOrg && procOrg && (
        procOrg === userOrg ||
        (userOrg.length > 5 && procOrg.includes(userOrg)) ||
        (procOrg.length > 5 && userOrg.includes(procOrg))
      )
    );

    return isSameKtId || isSameOrg || u.id === currentUser.id;
  });

  // 5. Scoped Batches
  const scopedBatches = processingBatches.filter((batch) => {
    if (currentUser.role === 'pengolah') {
      return batch.processorId === currentUser.id || (currentUser.kelompokTaniId && batch.processorId === currentUser.kelompokTaniId);
    }
    const isOwner = batch.processorId === currentUser.id;
    const isScopedProcessor = scopedProcessors.some((p) => p.id === batch.processorId);
    const matchesSourceLot = scopedLots.some((lot) => lot.id === batch.sourceFarmerLotId);
    return isOwner || isScopedProcessor || matchesSourceLot;
  });

  // 6. Scoped Processed Green Bean Lots
  const scopedProcessedLots = processedLots.filter((lot) => {
    if (currentUser.role === 'pengolah') {
      return lot.processorId === currentUser.id || (currentUser.kelompokTaniId && lot.processorId === currentUser.kelompokTaniId);
    }
    const isOwner = lot.processorId === currentUser.id;
    const isScopedProcessor = scopedProcessors.some((p) => p.id === lot.processorId);
    const matchesSourceLot = scopedLots.some((l) => l.id === lot.sourceFarmerLotId);
    return isOwner || isScopedProcessor || matchesSourceLot;
  });

  // 7. Scoped ICT Officers
  const scopedIctOfficers = users.filter((u) => {
    const isIct = u.role === 'ict' || (u.assignedService as unknown) === 'ict';
    if (!isIct) return false;

    if (currentUser.role === 'ict') {
      return u.id === currentUser.id;
    }

    const ictKtId = (u.kelompokTaniId || '').trim().toLowerCase();
    const ictOrg = (u.organization || u.kelompokTaniName || '').trim().toLowerCase();

    const isSameKtId = Boolean(
      (userKtId && ictKtId && (userKtId === ictKtId || userKtId === u.id?.toLowerCase() || ictKtId === currentUser.id?.toLowerCase())) ||
      (currentUser.kelompokTaniId && u.kelompokTaniId === currentUser.kelompokTaniId)
    );

    const isSameOrg = Boolean(
      userOrg && ictOrg && (
        ictOrg === userOrg ||
        (userOrg.length > 5 && ictOrg.includes(userOrg)) ||
        (ictOrg.length > 5 && userOrg.includes(ictOrg))
      )
    );

    return isSameKtId || isSameOrg || u.id === currentUser.id;
  });

  // 8. Scoped Transactions
  const scopedTransactions = transactions.filter((t) => {
    const userName = (currentUser.name || '').toLowerCase();
    const isDirect =
      (t.fromName && (t.fromName.toLowerCase() === userName || (userOrg && t.fromName.toLowerCase() === userOrg))) ||
      (t.toName && (t.toName.toLowerCase() === userName || (userOrg && t.toName.toLowerCase() === userOrg)));

    const isFarmerTx = scopedFarmers.some(
      (f) =>
        (t.fromName && t.fromName.toLowerCase() === f.name.toLowerCase()) ||
        (t.toName && t.toName.toLowerCase() === f.name.toLowerCase())
    );

    const isProcessorTx = scopedProcessors.some(
      (p) =>
        (t.fromName && t.fromName.toLowerCase() === p.name.toLowerCase()) ||
        (t.toName && t.toName.toLowerCase() === p.name.toLowerCase())
    );

    return isDirect || isFarmerTx || isProcessorTx;
  });

  // 9. Scoped Stamps
  const scopedStamps = verificationStamps.filter((stamp) => {
    return (
      stamp.verifierId === currentUser.id ||
      scopedFarmers.some((f) => f.id === stamp.targetId) ||
      scopedFarms.some((f) => f.id === stamp.targetId) ||
      scopedLots.some((l) => l.id === stamp.targetId) ||
      scopedProcessedLots.some((p) => p.id === stamp.targetId)
    );
  });

  return {
    isSuperAdmin: false,
    scopedFarmers,
    scopedFarms,
    scopedLots,
    scopedProcessors,
    scopedBatches,
    scopedProcessedLots,
    scopedIctOfficers,
    scopedTransactions,
    scopedStamps,
  };
}
