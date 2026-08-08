import { associations as bundledAssociations } from "@/data/associations";
import { amenityKeys } from "@/lib/amenities";
import { designStyles } from "@/lib/design-styles";
import { getSupabase, mediaUrl, supabaseConfigured } from "@/lib/supabase";
import { themes } from "@/lib/themes";
import type {
  AccentTheme,
  AmenityKey,
  Association,
  CommunityImage,
  DesignStyle,
} from "@/lib/types";

/**
 * Where demo records come from.
 *
 * Bundled records in `data/associations.ts` are the baseline, so the project
 * builds and runs with no configuration. When Supabase is configured, published
 * rows are layered on top and win on matching `slug` — which means the five
 * shipped demos can be edited in the database without a code deploy, and a
 * database outage degrades to the bundled set rather than an empty site.
 *
 * Rows are validated defensively. The table has check constraints, but a record
 * with an unrecognised theme, design style, or amenity key is skipped or cleaned
 * rather than allowed to break a page render.
 */

const validThemes = new Set(Object.keys(themes));
const validStyles = new Set(Object.keys(designStyles));
const validAmenities = new Set<string>(amenityKeys);

/** Shape of a `public.hoa_associations` row. */
export interface AssociationRow {
  slug: string;
  name: string;
  short_name: string | null;
  monogram: string | null;
  city: string | null;
  state: string | null;
  short_description: string;
  tagline: string | null;
  community_type: string | null;
  residence_count: number | null;
  established_year: number | null;
  management_company: string | null;
  phone: string | null;
  email: string | null;
  office_hours: string | null;
  emergency_contact: string | null;
  office_address: string | null;
  hero_image: unknown;
  gallery_images: unknown;
  amenities: unknown;
  announcements: unknown;
  meetings: unknown;
  documents: unknown;
  faqs: unknown;
  accent_theme: string;
  design_style: string;
  design_name: string;
  design_tagline: string;
}

const COLUMNS = `
  slug, name, short_name, monogram, city, state, short_description, tagline,
  community_type, residence_count, established_year,
  management_company, phone, email, office_hours, emergency_contact, office_address,
  hero_image, gallery_images, amenities, announcements, meetings, documents, faqs,
  accent_theme, design_style, design_name, design_tagline
`;

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** Resolves a stored image, turning a bucket path into a public URL. */
function toImage(value: unknown, fallbackAlt: string): CommunityImage | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const alt = typeof raw.alt === "string" && raw.alt.trim() ? raw.alt : fallbackAlt;
  const src = typeof raw.src === "string" ? mediaUrl(raw.src) : undefined;

  return {
    alt,
    ...(src ? { src } : {}),
    ...(typeof raw.caption === "string" ? { caption: raw.caption } : {}),
    ...(typeof raw.placeholder === "string"
      ? { placeholder: raw.placeholder as CommunityImage["placeholder"] }
      : {}),
  };
}

/**
 * Maps a database row onto the Association shape, or null if unusable.
 * Exported so the mapping can be exercised without a network round trip.
 */
export function mapRowToAssociation(row: AssociationRow): Association | null {
  if (!row.slug || !row.name) return null;
  if (!validThemes.has(row.accent_theme) || !validStyles.has(row.design_style)) {
    return null;
  }

  const heroImage =
    toImage(row.hero_image, `Community image for ${row.name}.`) ??
    ({ alt: `Community image for ${row.name}.`, placeholder: "village" } as CommunityImage);

  return {
    slug: row.slug,
    name: row.name,
    ...(row.short_name ? { shortName: row.short_name } : {}),
    ...(row.monogram ? { monogram: row.monogram } : {}),
    ...(row.city ? { city: row.city } : {}),
    ...(row.state ? { state: row.state } : {}),
    shortDescription: row.short_description ?? "",
    ...(row.tagline ? { tagline: row.tagline } : {}),

    ...(row.community_type ? { communityType: row.community_type } : {}),
    ...(row.residence_count ? { residenceCount: row.residence_count } : {}),
    ...(row.established_year ? { establishedYear: row.established_year } : {}),

    ...(row.management_company ? { managementCompany: row.management_company } : {}),
    ...(row.phone ? { phone: row.phone } : {}),
    ...(row.email ? { email: row.email } : {}),
    ...(row.office_hours ? { officeHours: row.office_hours } : {}),
    ...(row.emergency_contact ? { emergencyContact: row.emergency_contact } : {}),
    ...(row.office_address ? { officeAddress: row.office_address } : {}),

    heroImage,
    galleryImages: asArray(row.gallery_images)
      .map((image, index) => toImage(image, `Community image ${index + 1} for ${row.name}.`))
      .filter((image): image is CommunityImage => image !== null),

    // Unknown amenity keys are dropped rather than rendered as blanks.
    amenities: asArray(row.amenities).filter(
      (key): key is AmenityKey => typeof key === "string" && validAmenities.has(key),
    ),
    announcements: asArray(row.announcements) as Association["announcements"],
    meetings: asArray(row.meetings) as Association["meetings"],
    documents: asArray(row.documents) as Association["documents"],
    ...(Array.isArray(row.faqs) && row.faqs.length
      ? { faqs: row.faqs as Association["faqs"] }
      : {}),

    accentTheme: row.accent_theme as AccentTheme,
    designStyle: row.design_style as DesignStyle,
    designName: row.design_name ?? row.name,
    designTagline: row.design_tagline ?? "",
  };
}

async function fetchPublished(): Promise<Association[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("hoa_associations")
    .select(COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (error) {
    // A database problem must never take the demos down — fall back quietly.
    console.warn(`[hoa-engine] Supabase fetch failed, using bundled records: ${error.message}`);
    return [];
  }

  return ((data ?? []) as unknown as AssociationRow[])
    .map(mapRowToAssociation)
    .filter((association): association is Association => association !== null);
}

/** All demo concepts: bundled records, with published database rows layered on top. */
export async function getAllAssociations(): Promise<Association[]> {
  if (!supabaseConfigured) return bundledAssociations;

  const remote = await fetchPublished();
  if (!remote.length) return bundledAssociations;

  const bySlug = new Map(bundledAssociations.map((a) => [a.slug, a]));
  for (const association of remote) bySlug.set(association.slug, association);
  return [...bySlug.values()];
}

export async function getAssociationBySlug(
  slug: string,
): Promise<Association | undefined> {
  const all = await getAllAssociations();
  return all.find((association) => association.slug === slug);
}
