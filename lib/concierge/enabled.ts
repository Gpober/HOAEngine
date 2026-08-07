/**
 * Demos that run a community guide.
 *
 * Shared by the page and the API route so the two can never disagree — a slug
 * that renders the widget but is refused by the route (or the reverse) is the
 * obvious failure mode of keeping two lists.
 *
 * Only invented communities belong here. The twenty real-association concepts
 * assert three facts each; a guide on one of those would refuse almost every
 * question and would be speaking on behalf of a named association that has not
 * asked us to.
 */
export const CONCIERGE_SLUGS = new Set(["coastal-classic"]);
