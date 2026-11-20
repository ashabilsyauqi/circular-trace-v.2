/**
 * BlankoFormulirModal.tsx
 * Re-export wrapper for StakeholderFormsModal to provide physical A4 blanko worksheet printing.
 * Conforms to RENCANA_PENGEMBANGAN_4_FITUR.md specification for Paket 4.
 */

export {
  StakeholderFormsModal as BlankoFormulirModal,
  StakeholderFormsModal,
} from '../forms/StakeholderFormsModal';

export type {
  StakeholderFormType as BlankoFormType,
  StakeholderFormType,
} from '../forms/StakeholderFormsModal';

import { StakeholderFormsModal } from '../forms/StakeholderFormsModal';
export default StakeholderFormsModal;
