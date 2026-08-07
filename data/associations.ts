import { sampleLabels } from "@/lib/brand";
import { prospectConcepts } from "./prospect-concepts";
import type { Association, AssociationDocument } from "@/lib/types";

/* -------------------------------------------------------------------------- *
 *  PLACEHOLDER DATA — READ THIS FIRST
 *
 *  Every association below is fictional. Names, management companies, phone
 *  numbers, and email addresses are invented placeholders:
 *
 *    · management companies are prefixed "Example ..."
 *    · phone numbers use the 555-01xx range reserved for fictional use
 *    · email addresses use the reserved example.com / example.org domains
 *
 *  Replace these records with a real association only after reading
 *  `docs/REPLACING-DATA.md`. The sample-design label and the
 *  unofficial-concept disclaimer stay visible either way.
 * -------------------------------------------------------------------------- */

/**
 * The six document cards every demo shows. Demo links point at "#" — swap in
 * real file URLs when an association supplies them.
 */
function sampleDocuments(prefix: string): AssociationDocument[] {
  return [
    {
      id: `${prefix}-architectural-request`,
      title: "Architectural Request Form",
      description: "Submit exterior changes for committee review before work begins.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: `${prefix}-rules`,
      title: "Rules and Regulations",
      description: "Community standards covering shared areas and residences.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: `${prefix}-minutes`,
      title: "Meeting Minutes",
      description: "Approved minutes from recent association meetings.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: `${prefix}-resident-information`,
      title: "Resident Information Form",
      description: "Keep contact, vehicle, and emergency details current.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: `${prefix}-insurance`,
      title: "Insurance Information",
      description: "Coverage summary and certificate request instructions.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: `${prefix}-frequently-requested`,
      title: "Frequently Requested Documents",
      description: "Governing documents, budgets, and disclosure packets.",
      fileType: "ZIP",
      href: "#",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*  Demo 1 — Coastal Classic                                                   */
/* -------------------------------------------------------------------------- */

const harborlightPoint: Association = {
  slug: "coastal-classic",
  name: "Harborlight Point Condominium Association",
  shortName: "Harborlight Point",
  monogram: "HP",
  city: "Marisol Bay",
  state: "FL",
  shortDescription:
    "A waterfront condominium community where neighbours share a shoreline, a boardwalk, and a quiet stretch of the bay.",
  communityType: "Waterfront Condominium",
  residenceCount: 184,
  establishedYear: 1998,
  managementCompany: "Example Coastal Property Management",
  phone: "(555) 010-0142",
  email: "office@example.com",
  officeHours: "Monday – Friday, 9:00 AM – 4:00 PM",
  emergencyContact: "(555) 010-0199 — after-hours line",
  officeAddress: "100 Placeholder Way, Suite 200",
  heroImage: {
    src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/harborlight-point-hero.png",
    alt: "A low-rise waterfront condominium community at golden hour, seen across calm bay water.",
    placeholder: "waterfront",
  },
  galleryImages: [
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/harborlight-gallery-1.png",
      alt: "A pool deck overlooking calm bay water, with loungers and clipped hedges.",
      placeholder: "pool",
      caption: "Pool deck",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/harborlight-gallery-2.png",
      alt: "A timber boardwalk curving along the shoreline through sea grasses.",
      placeholder: "waterfront",
      caption: "Boardwalk",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/harborlight-gallery-3.png",
      alt: "The clubhouse entrance, cream stucco with a columned portico.",
      placeholder: "clubhouse",
      caption: "Clubhouse",
    },
  ],
  amenities: ["pool", "clubhouse", "fitness", "waterfront", "dock", "parking", "security", "elevator"],
  announcements: [
    {
      id: "hp-a1",
      kind: "general",
      sampleLabel: sampleLabels.announcement,
      title: "Welcome to the new community website concept",
      dateLabel: "Sample date",
      body: "This placeholder announcement shows how the association would share news with residents — seasonal reminders, community updates, and notices from the board.",
    },
    {
      id: "hp-a2",
      kind: "meeting",
      sampleLabel: sampleLabels.meetingNotice,
      title: "Regular board meeting notice",
      dateLabel: "Sample date",
      body: "Meeting notices appear here with the date, time, and location, plus a link to the agenda once it is published by the association.",
    },
    {
      id: "hp-a3",
      kind: "maintenance",
      sampleLabel: sampleLabels.maintenance,
      title: "Seawall and boardwalk inspection",
      dateLabel: "Sample date",
      body: "Maintenance updates explain what work is planned, which areas are affected, and who to contact with questions. This entry is sample content only.",
    },
  ],
  meetings: [
    {
      id: "hp-m1",
      kind: "board",
      title: "Board of Directors Meeting",
      dateLabel: "Sample date — second Tuesday",
      timeLabel: "6:30 PM",
      locationLabel: "Clubhouse — Bayside Room",
      note: "Open to all owners.",
    },
    {
      id: "hp-m2",
      kind: "annual",
      title: "Annual Meeting of Members",
      dateLabel: "Sample date — first quarter",
      timeLabel: "6:00 PM",
      locationLabel: "Clubhouse — Main Hall",
      note: "Election and budget presentation.",
    },
    {
      id: "hp-m3",
      kind: "committee",
      title: "Architectural Review Committee",
      dateLabel: "Sample date — monthly",
      timeLabel: "5:30 PM",
      locationLabel: "Management Office",
      note: "Submitted requests reviewed in order received.",
    },
  ],
  documents: sampleDocuments("hp"),
  accentTheme: "coastal",
  designStyle: "coastal-classic",
  designName: "Coastal Classic",
  designTagline:
    "Soft blues, deep navy, and sand with elegant serif headings — built for waterfront condominium associations.",
};

/* -------------------------------------------------------------------------- */
/*  Demo 2 — Modern Resort                                                     */
/* -------------------------------------------------------------------------- */

const velaRidge: Association = {
  slug: "modern-resort",
  name: "Vela Ridge Resort Community Association",
  shortName: "Vela Ridge",
  monogram: "VR",
  city: "Vela Ridge",
  state: "AZ",
  shortDescription:
    "A resort-style community organised around its shared amenities, with wide walking paths and a calendar of neighbourhood events.",
  communityType: "Resort-Style Master Association",
  residenceCount: 412,
  establishedYear: 2006,
  managementCompany: "Example Resort Property Group",
  phone: "(555) 010-0177",
  email: "management@example.com",
  officeHours: "Monday – Friday, 8:30 AM – 5:00 PM",
  emergencyContact: "(555) 010-0188 — 24-hour emergency line",
  heroImage: {
    src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/vela-ridge-hero.png",
    alt: "A resort-style residential community with a wide pool courtyard, palms, and desert mountains beyond.",
    placeholder: "resort",
  },
  galleryImages: [
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/vela-ridge-gallery-1.png",
      alt: "A long pool courtyard with cabanas and desert planting in late-afternoon light.",
      placeholder: "pool",
      caption: "Pool courtyard",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/vela-ridge-gallery-2.png",
      alt: "A fitness studio with floor-to-ceiling windows and pale oak flooring.",
      placeholder: "interior",
      caption: "Fitness studio",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/vela-ridge-gallery-3.png",
      alt: "An open event lawn at golden hour, ringed by palms and desert planting.",
      placeholder: "garden",
      caption: "Event lawn",
    },
  ],
  amenities: ["pool", "clubhouse", "fitness", "tennis", "pickleball", "eventLawn", "grounds", "security", "guestSuites"],
  announcements: [
    {
      id: "vr-a1",
      kind: "general",
      sampleLabel: sampleLabels.announcement,
      title: "Amenity season schedule published",
      dateLabel: "Sample date",
      body: "A placeholder announcement showing how seasonal amenity hours and reservation changes would be shared with residents.",
    },
    {
      id: "vr-a2",
      kind: "meeting",
      sampleLabel: sampleLabels.meetingNotice,
      title: "Budget workshop notice",
      dateLabel: "Sample date",
      body: "Notices for workshops and special sessions appear alongside regular meetings so residents see the full schedule in one place.",
    },
    {
      id: "vr-a3",
      kind: "maintenance",
      sampleLabel: sampleLabels.maintenance,
      title: "Pool resurfacing project",
      dateLabel: "Sample date",
      body: "Maintenance updates cover the work window, affected amenities, and alternate arrangements. This entry is sample content only.",
    },
  ],
  meetings: [
    {
      id: "vr-m1",
      kind: "board",
      title: "Board of Directors Meeting",
      dateLabel: "Sample date — monthly",
      timeLabel: "5:30 PM",
      locationLabel: "Clubhouse — Conference Room",
      note: "Owner comment period at the start of each meeting.",
    },
    {
      id: "vr-m2",
      kind: "annual",
      title: "Annual Membership Meeting",
      dateLabel: "Sample date — autumn",
      timeLabel: "6:00 PM",
      locationLabel: "Clubhouse — Grand Room",
      note: "Quorum and proxy information provided in advance.",
    },
    {
      id: "vr-m3",
      kind: "committee",
      title: "Lifestyle & Events Committee",
      dateLabel: "Sample date — monthly",
      timeLabel: "10:00 AM",
      locationLabel: "Clubhouse — Studio",
      note: "Residents welcome to attend.",
    },
  ],
  documents: sampleDocuments("vr"),
  accentTheme: "resort",
  designStyle: "modern-resort",
  designName: "Modern Resort",
  designTagline:
    "Charcoal, muted teal, and warm beige with a full-bleed hero — an upscale look for amenity-rich communities.",
};

/* -------------------------------------------------------------------------- */
/*  Demo 3 — Friendly Community                                                */
/* -------------------------------------------------------------------------- */

const cedarHollow: Association = {
  slug: "friendly-community",
  name: "Cedar Hollow Homeowners Association",
  shortName: "Cedar Hollow",
  monogram: "CH",
  city: "Cedar Hollow",
  state: "NC",
  shortDescription:
    "A single-family neighbourhood of tree-lined streets, shared green space, and a clubhouse that stays busy year round.",
  communityType: "Single-Family Homeowners Association",
  residenceCount: 236,
  establishedYear: 1987,
  managementCompany: "Example Community Management Co.",
  officeHours: "Monday – Thursday, 9:00 AM – 3:00 PM",
  // Phone and email intentionally omitted — the contact section falls back to
  // "Contact information available upon official site setup."
  heroImage: {
    src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/cedar-hollow-hero.png",
    alt: "A quiet tree-lined neighbourhood street of single-family homes on an overcast morning.",
    placeholder: "village",
  },
  galleryImages: [
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/cedar-hollow-gallery-1.png",
      alt: "A neighbourhood green framed by mature oaks, with a bench beside a gravel path.",
      placeholder: "garden",
      caption: "Neighbourhood green",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/cedar-hollow-gallery-2.png",
      alt: "The clubhouse with a wide covered porch and flower beds along the walkway.",
      placeholder: "clubhouse",
      caption: "Clubhouse",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/cedar-hollow-gallery-3.png",
      alt: "The community pool with loungers under green umbrellas.",
      placeholder: "pool",
      caption: "Community pool",
    },
  ],
  amenities: ["pool", "clubhouse", "grounds", "tennis", "petArea", "eventLawn", "parking"],
  announcements: [
    {
      id: "ch-a1",
      kind: "general",
      sampleLabel: sampleLabels.announcement,
      title: "Resident resource centre now easier to find",
      dateLabel: "Sample date",
      body: "This placeholder announcement shows how the association would point residents to forms, rules, and everyday resources.",
    },
    {
      id: "ch-a2",
      kind: "meeting",
      sampleLabel: sampleLabels.meetingNotice,
      title: "Board meeting and neighbourhood forum",
      dateLabel: "Sample date",
      body: "Meeting notices include the agenda link and how to submit a topic for discussion ahead of time.",
    },
    {
      id: "ch-a3",
      kind: "maintenance",
      sampleLabel: sampleLabels.maintenance,
      title: "Common area tree trimming",
      dateLabel: "Sample date",
      body: "Grounds and landscaping updates note the schedule and which streets are affected. This entry is sample content only.",
    },
  ],
  meetings: [
    {
      id: "ch-m1",
      kind: "board",
      title: "Board of Directors Meeting",
      dateLabel: "Sample date — third Thursday",
      timeLabel: "7:00 PM",
      locationLabel: "Clubhouse — Community Room",
      note: "All homeowners invited.",
    },
    {
      id: "ch-m2",
      kind: "annual",
      title: "Annual Homeowners Meeting",
      dateLabel: "Sample date — spring",
      timeLabel: "6:30 PM",
      locationLabel: "Clubhouse — Community Room",
      note: "Annual report and board election.",
    },
    {
      id: "ch-m3",
      kind: "committee",
      title: "Landscape Committee",
      dateLabel: "Sample date — quarterly",
      timeLabel: "6:00 PM",
      locationLabel: "Clubhouse — Meeting Room",
      note: "Volunteers welcome.",
    },
  ],
  documents: sampleDocuments("ch"),
  accentTheme: "sage",
  designStyle: "friendly-community",
  designName: "Friendly Community",
  designTagline:
    "Sage green, cream, and muted gold with rounded cards — warm and approachable, with resident resources up front.",
};

/* -------------------------------------------------------------------------- */
/*  Demo 4 — Urban Condominium                                                 */
/* -------------------------------------------------------------------------- */

const marquetteNinth: Association = {
  slug: "urban-condominium",
  name: "The Marquette on Ninth Condominium Association",
  shortName: "The Marquette",
  monogram: "M9",
  city: "Northbank",
  state: "IL",
  shortDescription:
    "A mid-rise condominium building downtown, with secured entry, structured parking, and shared spaces on the top floor.",
  communityType: "Mid-Rise Condominium",
  residenceCount: 96,
  establishedYear: 2014,
  managementCompany: "Example Urban Residential Services",
  phone: "(555) 010-0121",
  email: "concierge@example.org",
  officeHours: "Monday – Friday, 9:00 AM – 6:00 PM",
  emergencyContact: "(555) 010-0133 — building emergency line",
  officeAddress: "900 Placeholder Avenue, Lobby Level",
  heroImage: {
    src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/marquette-hero.png",
    alt: "A contemporary mid-rise condominium building on a city corner at blue hour, lobby lit at street level.",
    placeholder: "skyline",
  },
  galleryImages: [
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/marquette-gallery-1.png",
      alt: "The lobby, with polished concrete, a navy feature wall and low seating.",
      placeholder: "interior",
      caption: "Lobby",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/marquette-gallery-2.png",
      alt: "The rooftop terrace at dusk, with planters and a communal table above the city.",
      placeholder: "courtyard",
      caption: "Rooftop terrace",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/marquette-gallery-3.png",
      alt: "The fitness room, with a mirrored wall and tall windows onto street trees.",
      placeholder: "interior",
      caption: "Fitness room",
    },
  ],
  amenities: ["fitness", "parking", "security", "elevator", "evCharging", "clubhouse", "petArea"],
  announcements: [
    {
      id: "m9-a1",
      kind: "general",
      sampleLabel: sampleLabels.announcement,
      title: "Package room access update",
      dateLabel: "Sample date",
      body: "A placeholder announcement showing how building-wide operational notices would be published to residents.",
    },
    {
      id: "m9-a2",
      kind: "meeting",
      sampleLabel: sampleLabels.meetingNotice,
      title: "Board meeting — hybrid attendance",
      dateLabel: "Sample date",
      body: "Notices can include in-person and virtual attendance details so owners can join either way.",
    },
    {
      id: "m9-a3",
      kind: "maintenance",
      sampleLabel: sampleLabels.maintenance,
      title: "Elevator modernisation schedule",
      dateLabel: "Sample date",
      body: "Building maintenance updates describe the phases of work and expected service interruptions. This entry is sample content only.",
    },
  ],
  meetings: [
    {
      id: "m9-m1",
      kind: "board",
      title: "Board of Directors Meeting",
      dateLabel: "Sample date — monthly",
      timeLabel: "6:00 PM",
      locationLabel: "Ninth Floor Lounge",
      note: "Hybrid attendance available.",
    },
    {
      id: "m9-m2",
      kind: "annual",
      title: "Annual Meeting of Unit Owners",
      dateLabel: "Sample date — year end",
      timeLabel: "6:30 PM",
      locationLabel: "Ninth Floor Lounge",
      note: "Budget ratification and board election.",
    },
    {
      id: "m9-m3",
      kind: "committee",
      title: "Building & Finance Committee",
      dateLabel: "Sample date — bi-monthly",
      timeLabel: "5:30 PM",
      locationLabel: "Management Office",
      note: "Reserve study review.",
    },
  ],
  documents: sampleDocuments("m9"),
  accentTheme: "urban",
  designStyle: "urban-condominium",
  designName: "Urban Condominium",
  designTagline:
    "Slate, deep navy, and light gray in a structured grid — a clean, city-appropriate look for mid-rise buildings.",
};

/* -------------------------------------------------------------------------- */
/*  Demo 5 — Active Adult Community                                            */
/* -------------------------------------------------------------------------- */

const sunfieldVillage: Association = {
  slug: "active-adult-community",
  name: "Sunfield Village Community Association",
  shortName: "Sunfield Village",
  monogram: "SV",
  city: "Sunfield",
  state: "SC",
  shortDescription:
    "An active adult community built around its clubhouse calendar, walking paths, and neighbours who look out for one another.",
  communityType: "Active Adult Community (55+)",
  residenceCount: 318,
  establishedYear: 2001,
  managementCompany: "Example Lifestyle Management",
  phone: "(555) 010-0155",
  email: "office@example.org",
  officeHours: "Monday – Friday, 9:00 AM – 4:00 PM",
  // Emergency contact intentionally omitted for this record.
  heroImage: {
    src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/sunfield-village-hero.png",
    alt: "A single-storey community clubhouse with a covered porch, accessible walkway, and flowering beds.",
    placeholder: "clubhouse",
  },
  galleryImages: [
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/sunfield-gallery-1.png",
      alt: "The clubhouse gathering room, with armchairs around a low table and a coffee station.",
      placeholder: "interior",
      caption: "Gathering room",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/sunfield-gallery-2.png",
      alt: "A wide level walking path curving through the gardens, with benches at intervals.",
      placeholder: "garden",
      caption: "Walking paths",
    },
    {
      src: "https://whlrbqdqxrpipthxmcbs.supabase.co/storage/v1/object/public/hoa-engine-media/designs/sunfield-gallery-3.png",
      alt: "Two pickleball courts with fresh line markings and a shaded bench.",
      placeholder: "courtyard",
      caption: "Courts",
    },
  ],
  amenities: ["clubhouse", "pool", "fitness", "pickleball", "grounds", "eventLawn", "security", "parking"],
  announcements: [
    {
      id: "sv-a1",
      kind: "general",
      sampleLabel: sampleLabels.announcement,
      title: "Monthly community events calendar",
      dateLabel: "Sample date",
      body: "A placeholder announcement showing how clubs, classes, and community events would be shared each month.",
    },
    {
      id: "sv-a2",
      kind: "meeting",
      sampleLabel: sampleLabels.meetingNotice,
      title: "Board meeting with coffee social",
      dateLabel: "Sample date",
      body: "Meeting notices can pair the official agenda with the social side of the community calendar.",
    },
    {
      id: "sv-a3",
      kind: "maintenance",
      sampleLabel: sampleLabels.maintenance,
      title: "Walking path resurfacing",
      dateLabel: "Sample date",
      body: "Maintenance updates describe the schedule and any temporary detours around the community. This entry is sample content only.",
    },
  ],
  meetings: [
    {
      id: "sv-m1",
      kind: "board",
      title: "Board of Directors Meeting",
      dateLabel: "Sample date — first Wednesday",
      timeLabel: "10:00 AM",
      locationLabel: "Clubhouse — Assembly Room",
      note: "Seating and hearing assistance available.",
    },
    {
      id: "sv-m2",
      kind: "annual",
      title: "Annual Community Meeting",
      dateLabel: "Sample date — winter",
      timeLabel: "10:00 AM",
      locationLabel: "Clubhouse — Assembly Room",
      note: "Annual review and board election.",
    },
    {
      id: "sv-m3",
      kind: "committee",
      title: "Social & Activities Committee",
      dateLabel: "Sample date — monthly",
      timeLabel: "1:00 PM",
      locationLabel: "Clubhouse — Craft Room",
      note: "New residents especially welcome.",
    },
  ],
  documents: sampleDocuments("sv"),
  accentTheme: "heritage",
  designStyle: "active-adult",
  designName: "Active Adult Community",
  designTagline:
    "Warm cream, burgundy, and navy at a larger type scale — extra-accessible navigation with a community event focus.",
};

/* -------------------------------------------------------------------------- */

/**
 * The five fictional design concepts, followed by the real, named associations
 * in `prospect-concepts.ts`. Both sets carry the same disclaimers; the
 * difference is that the prospect records name real organisations, so they
 * assert only the three facts we can source (name, county, state).
 */
export const associations: Association[] = [
  harborlightPoint,
  velaRidge,
  cedarHollow,
  marquetteNinth,
  sunfieldVillage,
  ...prospectConcepts,
];

export function getAssociation(slug: string): Association | undefined {
  return associations.find((association) => association.slug === slug);
}

export function associationSlugs(): string[] {
  return associations.map((association) => association.slug);
}
