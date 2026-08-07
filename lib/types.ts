import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Theme + design identity                                                    */
/* -------------------------------------------------------------------------- */

/** Colour palettes. Defined in `lib/themes.ts`. */
export type AccentTheme = "coastal" | "resort" | "sage" | "urban" | "heritage";

/** Layout / typography personalities. Defined in `lib/design-styles.ts`. */
export type DesignStyle =
  | "coastal-classic"
  | "modern-resort"
  | "friendly-community"
  | "urban-condominium"
  | "active-adult";

/* -------------------------------------------------------------------------- */
/*  Imagery                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Placeholder artwork scenes. These are generated SVG compositions — no stock
 * photography is bundled, so nothing here can infringe on anyone's imagery.
 * Swap in real photography by setting `src` on the image object.
 */
export type PlaceholderScene =
  | "waterfront"
  | "resort"
  | "garden"
  | "skyline"
  | "village"
  | "pool"
  | "clubhouse"
  | "courtyard"
  | "interior";

export interface CommunityImage {
  /**
   * Path or URL to a real photograph. When omitted, a generated placeholder
   * scene is rendered instead. Only use imagery you have the rights to.
   */
  src?: string;
  /** Required for accessibility — describes the image for screen readers. */
  alt: string;
  /** Optional visible caption rendered beneath gallery images. */
  caption?: string;
  /** Which generated scene to draw when `src` is absent. */
  placeholder?: PlaceholderScene;
}

/* -------------------------------------------------------------------------- */
/*  Amenities                                                                  */
/* -------------------------------------------------------------------------- */

export type AmenityKey =
  | "pool"
  | "clubhouse"
  | "fitness"
  | "parking"
  | "security"
  | "waterfront"
  | "tennis"
  | "pickleball"
  | "dock"
  | "grounds"
  | "elevator"
  | "petArea"
  | "evCharging"
  | "guestSuites"
  | "eventLawn";

export interface AmenityDefinition {
  key: AmenityKey;
  label: string;
  /** Short, factual description of the amenity type — never community-specific claims. */
  blurb: string;
  icon: LucideIcon;
  placeholder: PlaceholderScene;
  /** Object path in the media bucket. Falls back to `placeholder` when absent. */
  photo?: string;
}

/* -------------------------------------------------------------------------- */
/*  Content blocks                                                             */
/* -------------------------------------------------------------------------- */

export type AnnouncementKind = "general" | "meeting" | "maintenance";

export interface Announcement {
  id: string;
  kind: AnnouncementKind;
  /** The visible "this is not real" label, e.g. "Demo Announcement". */
  sampleLabel: string;
  title: string;
  body: string;
  /** Free-form, human readable. Kept as a string so no fake precise dates leak in. */
  dateLabel: string;
}

export type MeetingKind = "board" | "annual" | "committee";

export interface Meeting {
  id: string;
  kind: MeetingKind;
  title: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  note?: string;
}

export interface AssociationDocument {
  id: string;
  title: string;
  description: string;
  /** Displayed on the download chip, e.g. "PDF". */
  fileType: string;
  /** Demo links point at "#". Replace with real document URLs at handover. */
  href: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/* -------------------------------------------------------------------------- */
/*  Association configuration                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A single association demo site.
 *
 * Every factual field is optional on purpose. Components render only what is
 * supplied — nothing is invented to fill a gap. If a fact is unknown, leave it
 * out and the UI degrades to an honest "available upon official site setup".
 */
export interface Association {
  /* identity ------------------------------------------------------------- */
  slug: string;
  /** Full legal name. Used for the hero heading, the footer, and metadata. */
  name: string;
  /**
   * Optional short name for the header lockup, e.g. "Harborlight Point" for
   * "Harborlight Point Condominium Association". Long legal names truncate
   * badly next to a full navigation bar. Falls back to `name`.
   */
  shortName?: string;
  /** Short form used for the header monogram. Falls back to derived initials. */
  monogram?: string;
  city?: string;
  state?: string;
  shortDescription: string;
  /**
   * One short selling line for the cinematic hero — "Private waterfront
   * living on Marisol Bay". Optional: without it the hero shows the name
   * alone, which is also fine.
   */
  tagline?: string;

  /* community facts ------------------------------------------------------ */
  communityType?: string;
  residenceCount?: number;
  establishedYear?: number;

  /* management ----------------------------------------------------------- */
  managementCompany?: string;
  phone?: string;
  email?: string;
  officeHours?: string;
  emergencyContact?: string;
  officeAddress?: string;

  /* imagery -------------------------------------------------------------- */
  heroImage: CommunityImage;
  galleryImages: CommunityImage[];

  /* content -------------------------------------------------------------- */
  amenities: AmenityKey[];
  announcements: Announcement[];
  meetings: Meeting[];
  documents: AssociationDocument[];
  /** Optional override. Falls back to the shared sample FAQ set. */
  faqs?: FaqItem[];

  /* presentation --------------------------------------------------------- */
  accentTheme: AccentTheme;
  designStyle: DesignStyle;
  /** Portfolio-facing name of the design, e.g. "Coastal Classic". */
  designName: string;
  /** One-line pitch shown on the portfolio grid. */
  designTagline: string;
}
