'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { DotsIcon } from '../icons';

export interface MenuItem {
  id: string;
  label: string;
  onSelect: (opener: HTMLElement) => void;
}

interface Props {
  label: string;
  items: MenuItem[];
}

// "⋯" menu for a table row: a disclosure button with a list of actions.
// Arrow keys / Home / End move focus, Escape and outside clicks close it,
// focus returns to the button.
export default function ActionMenu({ label, items }: Props) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    itemRefs.current[0]?.focus();
    function onPointer(event: PointerEvent) {
      if (rootRef.current && event.target instanceof Node && !rootRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  if (items.length === 0) return null;

  function onListKey(event: ReactKeyboardEvent<HTMLUListElement>) {
    const index = itemRefs.current.findIndex((el) => el === document.activeElement);
    const last = items.length - 1;
    const go = (i: number) => itemRefs.current[(i + items.length) % items.length]?.focus();
    if (event.key === 'ArrowDown') go(index + 1);
    else if (event.key === 'ArrowUp') go(index - 1);
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(last);
    else if (event.key === 'Escape') {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === 'Tab') {
      setOpen(false);
      return;
    } else return;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div className="action-menu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="icon-btn"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <DotsIcon width={22} height={22} />
      </button>
      {open && (
        <ul id={listId} className="action-menu__list" onKeyDown={onListKey}>
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                className="action-menu__item"
                onClick={() => {
                  setOpen(false);
                  // The menu button stays in the DOM, so dialogs return focus to it.
                  item.onSelect(buttonRef.current as HTMLElement);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
