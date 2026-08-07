import type { AccentTheme, Association, DesignStyle, PlaceholderScene } from "@/lib/types";

/* -------------------------------------------------------------------------- *
 *  PROSPECT CONCEPTS — REAL, NAMED ASSOCIATIONS
 *
 *  Unlike `data/associations.ts`, these records name real condominium
 *  associations. They exist so a salesperson can show a community what a public
 *  website could look like. That makes the guardrails load-bearing rather than
 *  decorative:
 *
 *    · Only three facts are asserted, and all three come from our own condo
 *      dataset: the association's name, its county, and its state.
 *    · Nothing else is claimed. No unit counts, no founding years, no amenities,
 *      no management company, no phone, no email, no address, no photographs.
 *      Those fields are absent, so the UI omits the rows entirely and shows
 *      "Contact information available upon official site setup."
 *    · `city` is deliberately absent. Our data has counties, and a county is not
 *      a city — deriving "York, ME" from York County would be a fabricated fact
 *      on a real organisation's page.
 *    · Announcements, meetings, and documents are sample content and stay
 *      labelled as such.
 *    · The sample-design label, the unofficial-concept notice, and `noindex` are
 *      enforced in the application layer and apply here exactly as everywhere.
 *
 *  These mirror rows in `public.hoa_associations`. Bundling them means the site
 *  renders them with no configuration; when Supabase credentials are present,
 *  the database rows take over on matching slug.
 * -------------------------------------------------------------------------- */

const designFor: Record<AccentTheme, { style: DesignStyle; name: string; scene: PlaceholderScene }> = {
  coastal: { style: "coastal-classic", name: "Coastal Classic", scene: "waterfront" },
  sage: { style: "friendly-community", name: "Friendly Community", scene: "garden" },
  urban: { style: "urban-condominium", name: "Urban Condominium", scene: "skyline" },
  resort: { style: "modern-resort", name: "Modern Resort", scene: "resort" },
  heritage: { style: "active-adult", name: "Active Adult Community", scene: "clubhouse" },
};

/** [slug, name, shortName, state, "County, ST", theme] */
type Spec = [string, string, string, string, string, AccentTheme];

const specs: Spec[] = [
  ["ansley-arms", "Ansley Arms", "", "GA", "Fulton County, GA", "urban"],
  ["colton-circle", "Colton Circle", "", "IA", "Linn County, IA", "sage"],
  ["emerald-isles-west", "Emerald Isles West", "", "FL", "Broward County, FL", "coastal"],
  ["garden-estates", "Garden Estates", "", "NY", "Rockland County, NY", "sage"],
  ["heatherton-of-edina", "Heatherton of Edina", "", "MN", "Hennepin County, MN", "heritage"],
  ["hidden-cove", "Hidden Cove", "", "SC", "Berkeley County, SC", "coastal"],
  ["hills-at-crescent-springs", "Hills at Crescent Springs", "Hills at", "KY", "Kenton County, KY", "sage"],
  ["indian-palms-4700", "Indian Palms #4700", "", "CA", "Riverside County, CA", "resort"],
  ["lanai-condos", "Lanai Condos", "", "CO", "Denver County, CO", "urban"],
  ["madonna-heights", "Madonna Heights", "", "NJ", "Passaic County, NJ", "urban"],
  ["nordic-village", "Nordic Village", "", "NH", "Carroll County, NH", "sage"],
  ["oakwood-ll", "Oakwood ll", "", "IL", "Cook County, IL", "sage"],
  ["regal-chase-phase-e", "Regal Chase Phase E", "", "VA", "Loudoun County, VA", "urban"],
  ["russell-street-flats", "Russell Street Flats", "", "MS", "Oktibbeha County, MS", "urban"],
  ["seaside-village", "Seaside Village", "", "ME", "York County, ME", "coastal"],
  ["sequoia-village", "Sequoia Village", "", "OR", "Washington County, OR", "sage"],
  ["shores-on-crooked-lake", "Shores on Crooked Lake", "", "MI", "Emmet County, MI", "coastal"],
  ["tre-bellavia-ii", "Tre Bellavia II", "", "AZ", "Maricopa County, AZ", "resort"],
  ["verandas-on-berkman", "Verandas on Berkman", "", "TX", "Travis County, TX", "resort"],
  ["west-winds", "West Winds", "", "NM", "Lincoln County, NM", "resort"],
];

/** Sample content — identical for every prospect concept, and labelled as sample. */
function sampleAnnouncements(slug: string): Association["announcements"] {
  return [
    {
      id: `${slug}-a1`,
      kind: "general",
      sampleLabel: "Demo Announcement",
      title: "Community announcements would appear here",
      dateLabel: "Sample date",
      body: "This placeholder shows how the association would share news, seasonal reminders, and notices with residents.",
    },
    {
      id: `${slug}-a2`,
      kind: "meeting",
      sampleLabel: "Sample Meeting Notice",
      title: "Meeting notices would appear here",
      dateLabel: "Sample date",
      body: "Notices would carry the date, time, and location, plus a link to the agenda once published by the association.",
    },
    {
      id: `${slug}-a3`,
      kind: "maintenance",
      sampleLabel: "Sample Maintenance Update",
      title: "Maintenance updates would appear here",
      dateLabel: "Sample date",
      body: "Updates would explain what work is planned, which areas are affected, and who to contact. Sample content only.",
    },
  ];
}

function sampleMeetings(slug: string): Association["meetings"] {
  return [
    {
      id: `${slug}-m1`,
      kind: "board",
      title: "Board of Directors Meeting",
      dateLabel: "Sample date",
      timeLabel: "Sample time",
      locationLabel: "Location to be supplied",
      note: "Schedule shown is sample content.",
    },
    {
      id: `${slug}-m2`,
      kind: "annual",
      title: "Annual Meeting",
      dateLabel: "Sample date",
      timeLabel: "Sample time",
      locationLabel: "Location to be supplied",
    },
    {
      id: `${slug}-m3`,
      kind: "committee",
      title: "Committee Meeting",
      dateLabel: "Sample date",
      timeLabel: "Sample time",
      locationLabel: "Location to be supplied",
    },
  ];
}

function sampleDocuments(slug: string): Association["documents"] {
  const docs: [string, string, string, string][] = [
    ["d1", "Architectural Request Form", "Submit exterior changes for committee review before work begins.", "PDF"],
    ["d2", "Rules and Regulations", "Community standards covering shared areas and residences.", "PDF"],
    ["d3", "Meeting Minutes", "Approved minutes from recent association meetings.", "PDF"],
    ["d4", "Resident Information Form", "Keep contact, vehicle, and emergency details current.", "PDF"],
    ["d5", "Insurance Information", "Coverage summary and certificate request instructions.", "PDF"],
    ["d6", "Frequently Requested Documents", "Governing documents, budgets, and disclosure packets.", "ZIP"],
  ];
  return docs.map(([id, title, description, fileType]) => ({
    id: `${slug}-${id}`,
    title,
    description,
    fileType,
    href: "#",
  }));
}

export const prospectConcepts: Association[] = specs.map(
  ([slug, name, shortName, state, place, theme]) => {
    const design = designFor[theme];
    return {
      slug,
      name,
      ...(shortName ? { shortName } : {}),
      // city intentionally omitted — we hold county, not city.
      state,
      shortDescription:
        `A condominium community in ${place}. This concept shows how a public website ` +
        `could present community information, documents, and contact details in one place.`,
      communityType: "Condominium Association",
      // residenceCount, establishedYear, managementCompany, phone, email,
      // officeHours, emergencyContact and officeAddress are all unknown and so
      // are deliberately absent.
      heroImage: {
        alt: "Illustrated placeholder representing the community.",
        placeholder: design.scene,
      },
      galleryImages: [],
      amenities: [], // unknown — nothing invented
      announcements: sampleAnnouncements(slug),
      meetings: sampleMeetings(slug),
      documents: sampleDocuments(slug),
      accentTheme: theme,
      designStyle: design.style,
      designName: design.name,
      designTagline: `Unofficial website concept prepared for ${name}.`,
    };
  },
);
