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

/**
 * Public address of the site: base for absolute URLs in link previews (Open Graph).
 * Change it together with a custom domain.
 */
export const siteUrl = 'https://vetcare-clinic-pi.vercel.app';

// Prices shown in the "Prices" section on the home page (§5.3.1 in docs/SPEC.md).
// Item names live in the dictionaries (`dict.prices.groups`); the amounts live here,
// in one place, so the client edits a single file to update prices for all four
// languages. Demo amounts only — not a real clinic's price list.

export const priceCurrency = 'RON';

export interface PriceItem {
  amount: number;
}

/**
 * Exactly six groups, same fixed order as `services.items` in the dictionaries:
 * checkup, vaccination, tests, dentistry, ultrasound, consultation. Each group has
 * exactly two amounts, matching the two item names in `dict.prices.groups[i].items`.
 */
export const priceList: PriceItem[][] = [
  // checkup: primary exam, repeat exam
  [{ amount: 180 }, { amount: 120 }],
  // vaccination: combined vaccine (cat/dog), rabies vaccine
  [{ amount: 250 }, { amount: 180 }],
  // tests: complete blood count, biochemistry panel
  [{ amount: 200 }, { amount: 320 }],
  // dentistry: ultrasonic scaling, tooth extraction (from)
  [{ amount: 350 }, { amount: 280 }],
  // ultrasound: abdominal ultrasound, cardiac ultrasound
  [{ amount: 300 }, { amount: 380 }],
  // consultation: nutrition & care consultation, online consultation (demo)
  [{ amount: 150 }, { amount: 120 }],
];
