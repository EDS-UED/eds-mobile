export function resolveAvatarInitials(name?: string, initials?: string): string {
  const explicit = initials?.trim();
  if (explicit) {
    return explicit.slice(0, 1).toUpperCase();
  }

  const trimmed = name?.trim();
  if (!trimmed) {
    return 'N';
  }

  return (trimmed[0] ?? 'N').toUpperCase();
}
