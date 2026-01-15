import { useState, useEffect } from 'react';
import { ElectionState } from '../types';
import { votingService } from '../../core/services/voting.service';
import { socket } from '../../core/services/socket.service';
import { SOCKET_EVENTS } from '../constants';

export const useElection = () => {
  const [electionState, setElectionState] = useState<ElectionState>({
    status: 'not_started',
    isActive: false,
    isPaused: false
  });

  const fetchElectionStatus = async () => {
    try {
      const state = await votingService.getElectionStatus();
      // Convert endTime string to Date object if it exists
      if (state.endTime) {
        state.endTime = new Date(state.endTime);
      }
      setElectionState(state);
    } catch (error) {
      // If endpoint doesn't exist, use default state
      console.warn('Election status endpoint not available yet');
      setElectionState({
        status: 'not_started',
        isActive: false,
        isPaused: false
      });
    }
  };

  useEffect(() => {
    // Fetch initial state
    fetchElectionStatus();

    // Set up polling to refresh state every 5 seconds
    const pollInterval = setInterval(fetchElectionStatus, 5000);

    // Listen for election events
    const handleElectionEnded = () => {
      setElectionState(prev => ({ ...prev, status: 'ended', isActive: false, isPaused: false }));
    };

    const handleElectionStarted = (data: { endTime: string }) => {
      setElectionState({
        status: 'active',
        endTime: new Date(data.endTime),
        isActive: true,
        isPaused: false
      });
    };

    const handleElectionPaused = (data: { endTime: string }) => {
      setElectionState(prev => ({
        ...prev,
        status: 'paused',
        endTime: new Date(data.endTime),
        isActive: false,
        isPaused: true
      }));
    };

    const handleElectionResumed = (data: { endTime: string }) => {
      setElectionState(prev => ({
        ...prev,
        status: 'active',
        endTime: new Date(data.endTime),
        isActive: true,
        isPaused: false
      }));
    };

    socket.on(SOCKET_EVENTS.ELECTION_ENDED, handleElectionEnded);
    socket.on(SOCKET_EVENTS.ELECTION_STARTED, handleElectionStarted);
    socket.on(SOCKET_EVENTS.ELECTION_PAUSED, handleElectionPaused);
    socket.on(SOCKET_EVENTS.ELECTION_RESUMED, handleElectionResumed);

    return () => {
      clearInterval(pollInterval);
      socket.off(SOCKET_EVENTS.ELECTION_ENDED, handleElectionEnded);
      socket.off(SOCKET_EVENTS.ELECTION_STARTED, handleElectionStarted);
      socket.off(SOCKET_EVENTS.ELECTION_PAUSED, handleElectionPaused);
      socket.off(SOCKET_EVENTS.ELECTION_RESUMED, handleElectionResumed);
    };
  }, []);

  return electionState;
};