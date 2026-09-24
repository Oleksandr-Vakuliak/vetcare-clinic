// Single place to configure real contact details.
// Everything is null by default so the site runs in a clear "demo mode":
// messenger and call buttons explain that contacts are not configured yet,
// instead of pointing to random or fake numbers.
//
// To go live, fill in the values below (and nothing else needs to change):
//   phone:     '+40 21 000 0000'   -> used by "Call" buttons
//   whatsapp:  '+40700000000'      -> opens https://wa.me/40700000000
//   telegram:  'vetcareclinic'     -> opens https://t.me/vetcareclinic
//   mapEmbed:  '<google maps embed src>' -> shown in the Contacts map slot

export interface SiteContacts {
  phone: string | null;
  emergencyPhone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  mapEmbedUrl: string | null;
}

export const siteContacts: SiteContacts = {
  phone: null,
  emergencyPhone: null,
  whatsapp: null,
  telegram: null,
  mapEmbedUrl: null,
};

export function telLink(value: string | null): string | null {
  return value ? `tel:${value.replace(/[^\d+]/g, '')}` : null;
}

export function whatsappLink(value: string | null): string | null {
  return value ? `https://wa.me/${value.replace(/[^\d]/g, '')}` : null;
}

export function telegramLink(value: string | null): string | null {
  return value ? `https://t.me/${value.replace(/^@/, '')}` : null;
}
