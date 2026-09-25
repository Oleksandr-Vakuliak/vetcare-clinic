import type { Dictionary } from '../types';

const dict: Dictionary = {
  meta: {
    title: "VetClinic — îngrijire pentru pisici și câini",
    description:
      "Site demonstrativ al unei clinici veterinare: servicii, echipa medicilor și programare online convenabilă. Ajutor pentru pisici și câini.",
  },
  langName: "Română",
  nav: {
    services: "Servicii",
    doctors: "Medici",
    booking: "Programare",
    contacts: "Contact",
    emergency: "Urgențe",
  },
  header: {
    clinicName: "VetClinic",
    openMenu: "Deschide meniul",
    closeMenu: "Închide meniul",
    languageLabel: "Limba site-ului",
  },
  hero: {
    title: "Grijă pentru cei pe care îi iubești",
    subtitle: "Ajutor pentru pisici și câini. Programare fără apeluri inutile.",
    ctaBooking: "Alege ora",
    ctaContact: "Contactează-ne",
    imageAlt: "Medic veterinar ținând o pisică în brațe",
    note: "Mai multe zile fericite împreună",
  },
  services: {
    title: "Serviciile noastre",
    items: [
      {
        title: "Consultație generală",
        description: "Examinare inițială și evaluarea stării de sănătate a animalului tău.",
      },
      {
        title: "Vaccinare",
        description: "Vaccinuri preventive pentru protecție împotriva bolilor frecvente.",
      },
      {
        title: "Analize",
        description: "Diagnostic de laborator și interpretarea rezultatelor.",
      },
      {
        title: "Stomatologie",
        description: "Îngrijirea dinților, curățare și tratamentul cavității bucale.",
      },
      {
        title: "Ecografie",
        description: "Examinare ecografică a organelor interne.",
      },
      {
        title: "Consultanță",
        description: "Sfaturi privind îngrijirea, alimentația și prevenția.",
      },
    ],
  },
  about: {
    title: "Cunoaște echipa noastră",
    text: "Suntem o clinică veterinară mică, unde fiecare pacient este tratat cu atenție și grijă. Ajutăm pisicile și câinii să se simtă sănătoși și fericiți.",
    demoNote: "Profilurile sunt create în scop demonstrativ.",
    team: [
      {
        name: "Medic Veterinar",
        role: "Medic generalist",
        bio: "Profil demonstrativ al unui medic veterinar de medicină generală.",
        imageAlt: "Portret medic veterinar",
      },
      {
        name: "Medic Veterinar",
        role: "Chirurg",
        bio: "Profil demonstrativ al unui medic veterinar chirurg.",
        imageAlt: "Portret medic veterinar",
      },
    ],
  },
  booking: {
    title: "Alege un moment convenabil",
    note: "Grija începe aici",
    demoNote: "Calendar demonstrativ — orele sunt orientative.",
    calendar: {
      prevMonth: "Luna anterioară",
      nextMonth: "Luna următoare",
      selectDatePrompt: "Selectează o dată pentru a vedea orele disponibile.",
      legendFree: "Disponibil",
      legendBusy: "Ocupat",
      noSlots: "Nu există ore disponibile pentru această dată.",
      chooseDay: "Alege",
      pastDay: "indisponibil",
      availableOn: "Ore disponibile pe",
      legendOtherMonth: "Altă lună",
    },
    form: {
      selectedLabel: "Data și ora selectată",
      noSelection: "Data și ora nu au fost selectate încă.",
      nameLabel: "Nume",
      namePlaceholder: "Numele dvs.",
      phoneLabel: "Telefon",
      phonePlaceholder: "+40 700 000 000",
      animalLabel: "Animal",
      animalOptions: { cat: "Pisică", dog: "Câine", other: "Altul" },
      reasonLabel: "Motivul vizitei",
      commLangLabel: "Limba preferată de comunicare",
      submit: "Programează-te",
      errors: {
        nameRequired: "Vă rugăm să introduceți numele.",
        phoneRequired: "Vă rugăm să introduceți numărul de telefon.",
        phoneInvalid: "Introduceți un număr de telefon valid.",
        dateRequired: "Selectați data și ora din calendar.",
      },
      demoSuccess: "Aceasta este o demonstrație. Programarea nu a fost creată, datele nu au fost trimise.",
      demoHint: "Demo: programarea nu va fi creată.",
    },
  },
  messengers: {
    title: "Preferi să scrii?",
    text: "Trimite-ne un mesaj — îți răspundem cât mai repede.",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    note: "Scrie-ne cum îți e comod",
    demoNote: "Mod demonstrativ: contactele de mesagerie nu sunt încă configurate.",
  },
  emergency: {
    sectionTitle: "Ai nevoie de asistență de urgență?",
    sectionText: "Sună-ne pentru a verifica disponibilitatea.",
    call: "Sună acum",
    floatingLabel: "Urgențe",
    modalTitle: "Asistență de urgență",
    modalText: "Sună-ne pentru a verifica disponibilitatea.",
    hoursLabel: "Program de lucru",
    hoursValue: "Lun–Dum, 09:00–19:00",
    contactLabel: "Contact",
    close: "Închide",
    demoNote: "Mod demonstrativ: numărul de telefon nu este încă configurat.",
  },
  contacts: {
    title: "Contact",
    addressLabel: "Adresă",
    address: "România (adresă demonstrativă).",
    hoursLabel: "Program de lucru",
    hours: "Lun–Dum, 09:00–19:00",
    mapPlaceholder: "Harta va apărea când va fi disponibilă adresa reală.",
    demoBadge: "Proiect demonstrativ",
  },
  footer: {
    demoBadge: "Proiect demonstrativ",
    rights: "Site fictiv creat pentru portofoliu.",
    tagline: "Grijă azi — sănătate mâine",
  },
};

export default dict;
