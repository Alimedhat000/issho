import { useCallback, useEffect, useState } from 'react';

import { User } from '@/types';

type Participant = {
  id: string;
  username: string;
  userId?: string;
};

export function useParticipant(shortcode: string, user?: User | null) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Key per event in localStorage
  const storageKey = `event_${shortcode}_participant`;

  // Register participant
  const registerParticipant = useCallback(
    async (username?: string) => {
      if (!user && !username) {
        // No user and no username → need modal
        setShowModal(true);
        return;
      }

      const payload = {
        userId: user?.id ?? null,
        name: user?.name ?? username,
      };

      // console.log(payload);

      try {
        const response = await fetch(`/api/event/${shortcode}/participant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        // console.log(response);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create event');
        }
        const particpant = await response.json();

        setParticipant(particpant);
        setShowModal(false);
        return particpant;
      } catch (err) {
        console.error('Failed to register participant', err);
      }
    },
    [shortcode, user],
  );

  // Load participant from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setParticipant(JSON.parse(saved));
    }
  }, [shortcode, storageKey]);

  // Save participant to localStorage
  useEffect(() => {
    if (participant) {
      localStorage.setItem(storageKey, JSON.stringify(participant));
    }
  }, [participant, shortcode, storageKey]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setParticipant(JSON.parse(saved));
    }
  }, [shortcode, storageKey]);

  return {
    participant,
    showModal,
    setShowModal,
    registerParticipant,
  };
}
