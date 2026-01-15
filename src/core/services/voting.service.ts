import { apiClient } from '../api/client';
import { Candidate, VoteResult, ElectionState } from '../../shared/types';

export class VotingService {
  async getCandidates(): Promise<Candidate[]> {
    return apiClient.get<Candidate[]>('/candidates');
  }

  async castVote(userId: string, candidateId: string): Promise<VoteResult> {
    return apiClient.post<VoteResult>('/vote', { userId, candidateId });
  }

  async getElectionStatus(): Promise<ElectionState> {
    return apiClient.get<ElectionState>('/admin/election-status');
  }

  async toggleElection(action: string, durationMinutes?: number): Promise<any> {
    return apiClient.post('/admin/toggle-election', { action, durationMinutes });
  }
}

export const votingService = new VotingService();