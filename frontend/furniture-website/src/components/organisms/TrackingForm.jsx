import { useState } from 'react';
import { Button, Input } from '@components';
import { ordersAPI } from '@services';

const TrackingForm = ({ setOrder, setError }) => {
  const [trackingId, setTrackingId] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    if (!trackingId.trim()) {
      setError('Please enter a tracking ID.');
      return;
    }

    try {
      const res = await ordersAPI.trackOrderById(trackingId);
      if (!res) throw new Error('Tracking info not found.');
      setOrder(res);
      setTrackingId('');
    } catch (err) {
      setError(err.message || 'Failed to fetch tracking info.');
    }
  };

  return (
    <form onSubmit={handleTrack} className="flex gap-4">
      <Input
        type="text"
        placeholder="Enter your tracking ID"
        value={trackingId}
        onChange={(val) => setTrackingId(val)}
        className=""
      />
      <Button type="submit" className="min-h-10!">
        Track
      </Button>
    </form>
  );
};

export default TrackingForm;
