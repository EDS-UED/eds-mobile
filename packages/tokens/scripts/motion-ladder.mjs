/** Resolve `--motion-N` ladder ms from motion/base.json groups. */

export function resolveMotionLadderMs(baseSpec, ladderRef) {
  for (const group of baseSpec.groups ?? []) {
    const raw = group.tokens?.[ladderRef];
    if (raw == null) {
      continue;
    }
    const ms = Number.parseFloat(String(raw).replace(/ms$/u, '').trim());
    return Number.isFinite(ms) ? ms : null;
  }
  return null;
}

export function resolveMotionTimingMs(baseSpec, timing) {
  if (timing?.duration != null && Number.isFinite(timing.duration)) {
    return timing.duration;
  }
  if (timing?.durationRef) {
    const ms = resolveMotionLadderMs(baseSpec, timing.durationRef);
    if (ms != null) {
      return ms;
    }
  }
  throw new Error(`motion timing: missing duration or durationRef (${JSON.stringify(timing)})`);
}

/** RN / catalog export — numeric duration only. */
export function normalizeMotionTimings(baseSpec) {
  const out = {};
  for (const [name, timing] of Object.entries(baseSpec.timings ?? {})) {
    const { durationRef, ...rest } = timing;
    out[name] = {
      ...rest,
      duration: resolveMotionTimingMs(baseSpec, timing),
      ...(durationRef ? { durationRef } : {}),
    };
  }
  return out;
}
