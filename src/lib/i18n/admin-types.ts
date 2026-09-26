// Translation contract for the demo admin panel (/[locale]/admin).
// Demo records (pet names, owners, reasons, statuses, doctors) are shared with the
// pet account and live in AccountDictionary.records. Placeholders like {n} are
// filled in by `fill()`.

export interface AdminDictionary {
  metaTitle: string;
  /** "Демо адміністратора" under the brand. */
  brandSubtitle: string;
  /** Breadcrumb root: "Адміністрування". */
  breadcrumbRoot: string;
  /** "Демонстраційна адмінпанель · Усі дані вигадані" */
  demoBanner: string;
  loading: string;
  close: string;
  cancel: string;
  save: string;
  done: string;

  nav: { label: string; overview: string; appointments: string; schedule: string; pets: string };
  links: { site: string; account: string; reset: string };

  reset: { title: string; text: string; confirm: string; done: string };

  overview: {
    title: string;
    statsLabel: string;
    today: string;
    pending: string;
    freeSlots: string;
    /** "слоти по {min} хв" */
    freeSlotsHint: string;
    tableTitle: string;
    allAppointments: string;
    addAppointment: string;
    doctorsTitle: string;
    /** "{name}: зараз — {state}" (accessible summary of a doctor's row) */
    doctorNow: string;
    doctorStates: { appointment: string; break: string; free: string; off: string };
    openSchedule: string;
    quickTitle: string;
    addPet: string;
    setHours: string;
  };

  table: {
    date: string;
    time: string;
    pet: string;
    owner: string;
    doctorReason: string;
    status: string;
    actions: string;
    empty: string;
    /** "Знайдено: {n}" */
    found: string;
    showMore: string;
    siteRequest: string;
    fromAccount: string;
  };

  filters: {
    search: string;
    searchPlaceholder: string;
    doctor: string;
    allDoctors: string;
    status: string;
    allStatuses: string;
    date: string;
    period: string;
    periods: { upcoming: string; past: string; all: string };
    today: string;
    clear: string;
  };

  actions: {
    confirm: string;
    reschedule: string;
    complete: string;
    cancel: string;
    details: string;
    /** Accessible label of the "⋯" button: "Інші дії: {pet}, {when}" */
    more: string;
  };

  details: {
    title: string;
    when: string;
    pet: string;
    species: string;
    owner: string;
    doctor: string;
    reason: string;
    status: string;
    source: string;
    sources: { seed: string; site: string; account: string; admin: string };
    history: string;
    historyActions: { created: string; confirmed: string; rescheduled: string; completed: string; cancelled: string };
    /** "з {when}, {doctor}" */
    movedFrom: string;
    noActions: string;
    guestNote: string;
  };

  form: {
    createTitle: string;
    rescheduleTitle: string;
    /** "Зараз: {when}, {doctor}" */
    current: string;
    pet: string;
    petPlaceholder: string;
    date: string;
    doctor: string;
    time: string;
    timePlaceholder: string;
    noTimes: string;
    reason: string;
    reasonPlaceholder: string;
    create: string;
    reschedule: string;
    adminNote: string;
  };

  cancelDialog: { title: string; text: string; confirm: string; keep: string };

  errors: {
    required: string;
    invalid: string;
    unknownPet: string;
    unknownDoctor: string;
    noDoctor: string;
    past: string;
    offHours: string;
    closed: string;
    taken: string;
    notFound: string;
    notAllowed: string;
    sameSlot: string;
  };

  notices: {
    created: string;
    confirmed: string;
    rescheduled: string;
    completed: string;
    cancelled: string;
    petAdded: string;
    petSaved: string;
    hoursSaved: string;
    slotClosed: string;
    slotReopened: string;
  };

  schedule: {
    title: string;
    doctor: string;
    view: string;
    day: string;
    week: string;
    prev: string;
    next: string;
    today: string;
    date: string;
    /** "Тривалість прийому — {min} хв для всіх (обмеження демо)." */
    slotLength: string;
    hoursButton: string;
    /** "Робочі години: {name}" */
    hoursTitle: string;
    hoursIntro: string;
    works: string;
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
    noBreak: string;
    dayOff: string;
    /** "{start}–{end}" */
    hoursRange: string;
    /** "перерва {start}–{end}" */
    breakRange: string;
    states: { free: string; booked: string; closed: string; break: string; past: string };
    close: string;
    reopen: string;
    openDay: string;
    /** Week grid: table caption "{name}: тиждень {range}". */
    gridCaption: string;
    /** Short hint above the grid. */
    gridHint: string;
    time: string;
    /** Grid cell outside the doctor's hours. */
    offHours: string;
    legend: string;
    /** "{booked} записів · {free} вільно · {closed} закрито" */
    summary: string;
    outsideTitle: string;
    conflictTitle: string;
    conflictText: string;
    /** "На {time} є запис ({pet}). Спершу перенесіть або скасуйте його." */
    slotConflict: string;
    hoursErrors: { order: string; grid: string; breakPartial: string; breakOrder: string; breakOutside: string };
    closeErrors: { past: string; offHours: string; alreadyClosed: string; notClosed: string };
  };

  pets: {
    title: string;
    searchPlaceholder: string;
    add: string;
    edit: string;
    empty: string;
    /** "Відкрити картку: {name}" */
    open: string;
    birthDate: string;
    weight: string;
    /** "{value} кг" */
    weightValue: string;
    owner: string;
    ownerRequired: string;
    history: string;
    noHistory: string;
    inAccount: string;
    nextVisit: string;
    none: string;
    scopeNote: string;
  };
}
