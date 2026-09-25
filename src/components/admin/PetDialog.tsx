'use client';

import type { Pet } from '@/lib/clinic/types';
import { addPet, updatePet } from '@/lib/account/state';
import Dialog from '../account/Dialog';
import PetForm, { petToInput } from '../account/PetForm';
import { ownerName, petBreed, petName } from '../account/format';
import { newId, updateDemo } from '../demo-store';
import { useAdmin } from './AdminContext';

interface Props {
  /** Edit this pet; add a new one when omitted. */
  pet?: Pet;
  returnFocus?: HTMLElement;
  onClose: () => void;
  onAdded?: (id: string) => void;
}

// Reuses the pet account's form and model; the admin also sets the fictional owner.
// Pets added here belong to other clients, so they don't appear in the pet account.
export default function PetDialog({ pet, returnFocus, onClose, onAdded }: Props) {
  const { a, d, notify } = useAdmin();
  const currentOwner = pet ? ownerName(pet, d) : '';

  return (
    <Dialog title={pet ? d.form.editTitle : a.pets.add} closeLabel={a.close} returnFocus={returnFocus} onClose={onClose}>
      <PetForm
        d={d}
        initial={pet ? { input: petToInput(pet, petName(pet, d), petBreed(pet, d)) } : undefined}
        owner={{ label: a.pets.owner, required: a.pets.ownerRequired, initial: currentOwner }}
        onCancel={onClose}
        onSubmit={(value, owner) => {
          if (pet) {
            // Keep the translated demo owner unless the name was actually changed.
            updateDemo((s) => updatePet(s, pet.id, value, owner === currentOwner ? undefined : { text: owner }));
            notify(a.notices.petSaved);
          } else {
            const id = newId('pet');
            updateDemo((s) => addPet(s, value, id, { owner: { text: owner }, inAccount: false }));
            notify(a.notices.petAdded);
            onAdded?.(id);
          }
          onClose();
        }}
      />
    </Dialog>
  );
}
