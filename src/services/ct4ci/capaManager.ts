/**
 * CIRCULARTRACE - CAPA (Corrective and Preventive Action) Manager (TypeScript)
 * Manages the lifecycle of continuous improvement findings, corrective actions, and verifier closure.
 */

import { CapaItem, CapaStatus, CapaIssueType } from './types';

export class CapaManager {
  private capas: Map<string, CapaItem> = new Map();

  constructor(initialCapas: CapaItem[] = []) {
    initialCapas.forEach(c => this.capas.set(c.id, c));
  }

  getAll(): CapaItem[] {
    return Array.from(this.capas.values());
  }

  getForScope(scopeId: string): CapaItem[] {
    return Array.from(this.capas.values()).filter(c => c.scopeId === scopeId);
  }

  getOpen(scopeId?: string): CapaItem[] {
    return this.getAll().filter(c => c.status !== CapaStatus.CLOSED && (!scopeId || c.scopeId === scopeId));
  }

  createCapa(
    data: {
      findingTitle: string;
      checkpointId: string;
      checkpointCode?: string;
      issueType?: CapaIssueType;
      severity?: 'MAJOR' | 'MINOR' | 'OBSERVATION';
      scopeId?: string;
      actionPlan?: string;
      responsiblePerson?: string;
      deadlineDate?: string;
      estimatedCostIdr?: number;
    },
    actor: { userId?: string; role?: string } = {}
  ): CapaItem {
    const id = `CAPA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const capaCode = `CAPA-${data.checkpointCode || data.checkpointId}-${Date.now().toString().slice(-4)}`;

    const capa: CapaItem = {
      id,
      capaCode,
      checkpointId: data.checkpointId,
      checkpointCode: data.checkpointCode || data.checkpointId,
      findingTitle: data.findingTitle,
      issueType: data.issueType || CapaIssueType.MINOR_GAP,
      severity: data.severity || (data.issueType?.includes('MAJOR') ? 'MAJOR' : 'MINOR'),
      scopeId: data.scopeId || 'UNKNOWN',
      actionPlan: data.actionPlan || 'Menyusun langkah perbaikan sesuai rekomendasi verifikator.',
      responsiblePerson: data.responsiblePerson || 'Petani & Pendamping Lapangan ICS',
      deadlineDate: data.deadlineDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      estimatedCostIdr: data.estimatedCostIdr || 500000,
      status: CapaStatus.OPEN,
      createdAt: new Date().toISOString()
    };

    this.capas.set(id, capa);
    return capa;
  }

  submitCompletionProof(capaId: string, proofRef: string, actualCostIdr?: number): CapaItem {
    const capa = this.capas.get(capaId);
    if (!capa) throw new Error(`CAPA dengan ID ${capaId} tidak ditemukan.`);

    capa.status = CapaStatus.PENDING_VERIFICATION;
    capa.completionProofRef = proofRef;
    if (actualCostIdr !== undefined) capa.actualCostIdr = actualCostIdr;

    return capa;
  }

  verifyClosure(
    capaId: string,
    options: {
      accepted: boolean;
      verifierId: string;
      notes?: string;
    }
  ): CapaItem {
    const capa = this.capas.get(capaId);
    if (!capa) throw new Error(`CAPA dengan ID ${capaId} tidak ditemukan.`);

    if (!capa.completionProofRef) {
      throw new Error('CAPA tidak dapat diverifikasi/ditutup sebelum bukti perbaikan diunggah.');
    }

    if (options.accepted) {
      capa.status = CapaStatus.CLOSED;
      capa.verifierUserId = options.verifierId;
      capa.closureNotes = options.notes || 'Bukti perbaikan fisik/dokumen telah diverifikasi dan diterima.';
      capa.closedAt = new Date().toISOString();
    } else {
      capa.status = CapaStatus.REJECTED;
      capa.verifierUserId = options.verifierId;
      capa.closureNotes = options.notes || 'Bukti perbaikan belum memadai. Diperlukan tindakan perbaikan ulang.';
    }

    return capa;
  }
}

export const globalCapaManager = new CapaManager();
