'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import { siteContacts, telLink } from '@/lib/site-config';
import { PhoneIcon, CloseIcon } from './icons';

export default function EmergencyFab({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const phone = telLink(siteContacts.emergencyPhone ?? siteContacts.phone);
  const e = dict.emergency;

  // Focus the close button on open; restore focus to the trigger on close.
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Escape to close + a minimal focus trap while the dialog is open.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="btn btn--danger emergency-fab"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <PhoneIcon width={20} height={20} />
        <span className="fab-label">{e.floatingLabel}</span>
      </button>

      {open && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            className="modal"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="emergency-modal-title"
          >
            <div className="modal__head">
              <h2 className="modal__title" id="emergency-modal-title">
                {e.modalTitle}
              </h2>
              <button
                type="button"
                ref={closeRef}
                className="modal__close"
                onClick={() => setOpen(false)}
                aria-label={e.close}
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            <p>{e.modalText}</p>

            <dl>
              <dt>{e.contactLabel}</dt>
              {phone ? (
                <dd>
                  <a className="btn btn--danger" href={phone}>
                    <PhoneIcon width={18} height={18} /> {e.call}
                  </a>
                </dd>
              ) : (
                <dd style={{ color: 'var(--color-red-dark)' }}>{e.demoNote}</dd>
              )}
              <dt>{e.hoursLabel}</dt>
              <dd>{e.hoursValue}</dd>
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
