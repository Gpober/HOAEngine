import {
  Anchor,
  BedDouble,
  Building2,
  Car,
  CircleDot,
  Dog,
  Dumbbell,
  MoveVertical,
  PlugZap,
  Sailboat,
  ShieldCheck,
  Sun,
  Trees,
  Trophy,
  Waves,
} from "lucide-react";
import type { AmenityDefinition, AmenityKey } from "./types";

/**
 * The amenity catalogue. Descriptions are generic descriptions of the amenity
 * *type* — never a claim about a specific community. An amenity only appears on
 * a demo if its key is listed in that association's configuration.
 */
export const amenityCatalogue: Record<AmenityKey, AmenityDefinition> = {
  pool: {
    key: "pool",
    label: "Swimming Pool",
    blurb: "Community pool area with seasonal hours posted by the association.",
    icon: Waves,
    placeholder: "pool",
  },
  clubhouse: {
    key: "clubhouse",
    label: "Clubhouse",
    blurb: "Shared indoor space for meetings, gatherings, and reservations.",
    icon: Building2,
    placeholder: "clubhouse",
  },
  fitness: {
    key: "fitness",
    label: "Fitness Center",
    blurb: "On-site exercise space available to residents.",
    icon: Dumbbell,
    placeholder: "interior",
  },
  parking: {
    key: "parking",
    label: "Resident Parking",
    blurb: "Assigned or shared parking managed under association rules.",
    icon: Car,
    placeholder: "village",
  },
  security: {
    key: "security",
    label: "Security & Access",
    blurb: "Controlled access and community safety procedures.",
    icon: ShieldCheck,
    placeholder: "village",
  },
  waterfront: {
    key: "waterfront",
    label: "Waterfront Access",
    blurb: "Shared waterfront frontage or walkway maintained by the association.",
    icon: Sailboat,
    placeholder: "waterfront",
  },
  tennis: {
    key: "tennis",
    label: "Tennis Courts",
    blurb: "Court facilities available under posted community guidelines.",
    icon: Trophy,
    placeholder: "courtyard",
  },
  pickleball: {
    key: "pickleball",
    label: "Pickleball Courts",
    blurb: "Court facilities available under posted community guidelines.",
    icon: CircleDot,
    placeholder: "courtyard",
  },
  dock: {
    key: "dock",
    label: "Docks & Slips",
    blurb: "Boat slips or dock access administered by the association.",
    icon: Anchor,
    placeholder: "waterfront",
  },
  grounds: {
    key: "grounds",
    label: "Landscaped Grounds",
    blurb: "Maintained common areas, walking paths, and green space.",
    icon: Trees,
    placeholder: "garden",
  },
  elevator: {
    key: "elevator",
    label: "Elevator Access",
    blurb: "Elevator service to residential floors and common areas.",
    icon: MoveVertical,
    placeholder: "interior",
  },
  petArea: {
    key: "petArea",
    label: "Pet-Friendly Areas",
    blurb: "Designated pet areas subject to community pet rules.",
    icon: Dog,
    placeholder: "garden",
  },
  evCharging: {
    key: "evCharging",
    label: "EV Charging",
    blurb: "Electric vehicle charging in designated parking areas.",
    icon: PlugZap,
    placeholder: "village",
  },
  guestSuites: {
    key: "guestSuites",
    label: "Guest Suites",
    blurb: "Reservable guest accommodation for resident visitors.",
    icon: BedDouble,
    placeholder: "interior",
  },
  eventLawn: {
    key: "eventLawn",
    label: "Event Lawn",
    blurb: "Open lawn used for community gatherings and seasonal events.",
    icon: Sun,
    placeholder: "garden",
  },
};

/** Every valid amenity key — used to validate externally-sourced records. */
export const amenityKeys = Object.keys(amenityCatalogue) as AmenityKey[];

export function getAmenities(keys: AmenityKey[]): AmenityDefinition[] {
  // Unknown keys are dropped rather than guessed at.
  return keys.map((key) => amenityCatalogue[key]).filter(Boolean);
}
