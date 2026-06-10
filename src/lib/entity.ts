export interface EntityWithId {
  id?: string;
  _id?: string;
}

export function getEntityId(entity: EntityWithId | string | null | undefined) {
  if (!entity) return "";
  if (typeof entity === "string") return entity;
  return entity.id ?? entity._id ?? "";
}

export function getEntityLabel(
  entity:
    | string
    | {
        name?: string;
        title?: string;
        full_name?: string;
        email?: string;
      }
    | null
    | undefined,
  fallback = "Unknown"
) {
  if (!entity) return fallback;
  if (typeof entity === "string") return entity;
  return entity.name ?? entity.title ?? entity.full_name ?? entity.email ?? fallback;
}
