/**
 * Status configuration for content moderation
 * Maps status codes to display labels and metadata
 */

export interface StatusConfig {
  id: string;
  label: string;
  description: string;
  sortOrder: number;
}

export const STATUS_KEYS = [
  "draft",
  "pending",
  "published",
  "rejected",
] as const;

export type StatusId = (typeof STATUS_KEYS)[number];

export const STATUSES: Record<StatusId, StatusConfig> = {
  draft: {
    id: "draft",
    label: "Draft",
    description: "Work in progress, not visible to users",
    sortOrder: 1,
  },
  pending: {
    id: "pending",
    label: "Pending Review",
    description: "Submitted for review, awaiting moderator approval",
    sortOrder: 2,
  },
  published: {
    id: "published",
    label: "Published",
    description: "Approved and visible to all users",
    sortOrder: 3,
  },
  rejected: {
    id: "rejected",
    label: "Rejected",
    description: "Reviewed and declined for publication",
    sortOrder: 4,
  },
};

/**
 * Get status config by ID
 */
export function getStatusConfig(statusId: StatusId): StatusConfig {
  return STATUSES[statusId];
}

/**
 * Get all statuses sorted by sortOrder
 */
export function getAllStatuses(): StatusConfig[] {
  return STATUS_KEYS.map((key) => STATUSES[key]).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

/**
 * Check if a status ID is valid
 */
export function isValidStatusId(id: string): id is StatusId {
  return STATUS_KEYS.includes(id as StatusId);
}
