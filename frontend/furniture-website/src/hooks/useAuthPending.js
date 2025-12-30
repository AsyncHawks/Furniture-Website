import { useState } from 'react';

export const useAuthPending = () => {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const start = () => {
    setPending(true);
    setMessage('');
  };

  const stop = () => {
    setPending(false);
  };

  return {
    pending,
    message,
    setMessage,
    start,
    stop,
  };
};
