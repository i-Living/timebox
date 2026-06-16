
import { useState, useEffect } from 'preact/hooks';
import { OrganizerView } from './components/OrganizerView';
import { ClientView } from './components/ClientView';
import { ConfirmView } from './components/ConfirmView';
import { decodeSharePayload, decodeBookPayload } from './utils/url';
import { load, save, confirmBooking } from './store';
import type { Slot } from './types';

type Mode = 'organizer' | 'client' | 'confirm' | 'error';

export function App() {
  const [mode, setMode] = useState<Mode>('organizer');
  const [sharePayload, setSharePayload] = useState<any>(null);
  const [bookPayload, setBookPayload] = useState<any>(null);
  const [targetSlot, setTargetSlot] = useState<Slot | undefined>();
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  const detectMode = () => {
    const hash = window.location.hash;

    // Share link
    if (hash.startsWith('#s=')) {
      const decoded = decodeSharePayload(hash);
      if (decoded) {
        setSharePayload(decoded);
        setMode('client');
        return;
      }
    }

    // Booking confirmation link
    if (hash.startsWith('#b=')) {
      const decoded = decodeBookPayload(hash);
      if (decoded) {
        setBookPayload(decoded);
        // Find the slot in organizer data
        const data = load();
        const slot = data.slots.find(s => s.id === decoded.slotId);
        setTargetSlot(slot);

        // Check if already fully booked
        if (slot) {
          const confirmed = slot.bookings.filter(b => b.status === 'confirmed').length;
          setAlreadyBooked(confirmed >= slot.capacity);
        }

        setMode('confirm');
        return;
      }
    }

    // Default: organizer mode
    setMode('organizer');
  };

  useEffect(() => {
    detectMode();
    const handler = () => detectMode();
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const handleConfirm = () => {
    if (!bookPayload || !targetSlot) return;
    const data = load();
    const bookingIdx = targetSlot.bookings.length;
    const newBooking = {
      name: bookPayload.name,
      contact: bookPayload.contact,
      status: 'pending' as const,
      bookedAt: bookPayload.at,
    };
    const slots = [...data.slots];
    const idx = slots.findIndex(s => s.id === targetSlot.id);
    if (idx >= 0) {
      slots[idx] = { ...slots[idx], bookings: [...slots[idx].bookings, newBooking] };
      // Confirm the booking
      const finalSlots = confirmBooking(slots, targetSlot.id, bookingIdx);
      save({ ...data, slots: finalSlots });
    }
    // Clear hash and go to organizer
    window.location.hash = '';
    setMode('organizer');
  };

  const handleDecline = () => {
    if (!bookPayload || !targetSlot) return;
    const data = load();
    const newBooking = {
      name: bookPayload.name,
      contact: bookPayload.contact,
      status: 'cancelled' as const,
      bookedAt: bookPayload.at,
    };
    const slots = data.slots.map(s =>
      s.id === targetSlot.id ? { ...s, bookings: [...s.bookings, newBooking] } : s
    );
    save({ ...data, slots });
    window.location.hash = '';
    setMode('organizer');
  };

  if (mode === 'client' && sharePayload) {
    return <ClientView payload={sharePayload} />;
  }

  if (mode === 'confirm' && bookPayload) {
    return (
      <ConfirmView
        booking={bookPayload}
        slot={targetSlot}
        onConfirm={handleConfirm}
        onDecline={handleDecline}
        alreadyBooked={alreadyBooked}
      />
    );
  }

  return <OrganizerView />;
}
