/**
 * Corner Smoothing — Figma/iOS squircle via clip-path.
 * Uses figma-squircle (MIT © Tien Pham).
 *
 * Usage:
 *   import { initCornerSmoothing, attachCornerSmoothing, rescanCornerSmoothing } from '@eds/mobile-tokens/corner-smoothing';
 *   initCornerSmoothing(); // auto-bind elements with non-zero border-radius
 *   attachCornerSmoothing(element);
 *   rescanCornerSmoothing(popoverRoot); // after Teleport / v-if mount
 *
 * Opt out: data-no-corner-smoothing on element or ancestor.
 * Smoothing level: --corner-smoothing (0–1, default 0.6 = Figma 60% / iOS).
 */

import { getSvgPath } from 'figma-squircle';

const OPT_OUT_ATTR = 'data-no-corner-smoothing';
const EFFECT_LAYER_PATTERN = /^effect-(flotation|popup)-box__/;
const SKIP_TAGS = new Set([
  'SVG',
  'PATH',
  'CIRCLE',
  'RECT',
  'LINE',
  'POLYGON',
  'POLYLINE',
  'ELLIPSE',
  'G',
  'DEFS',
  'CLIPPATH',
  'MASK',
  'USE',
  'SYMBOL',
]);

function readCornerSmoothing() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--corner-smoothing').trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0.6;
}

function parseLength(value) {
  if (!value || value === '0' || value === '0px') {
    return 0;
  }

  if (value.endsWith('%')) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseRadii(style) {
  const shorthand = style.borderTopLeftRadius;
  const usesIndividual =
    style.borderTopRightRadius !== shorthand ||
    style.borderBottomRightRadius !== shorthand ||
    style.borderBottomLeftRadius !== shorthand;

  if (usesIndividual) {
    const topLeft = parseLength(style.borderTopLeftRadius);
    const topRight = parseLength(style.borderTopRightRadius);
    const bottomRight = parseLength(style.borderBottomRightRadius);
    const bottomLeft = parseLength(style.borderBottomLeftRadius);

    if ([topLeft, topRight, bottomRight, bottomLeft].some((value) => value === null)) {
      return null;
    }

    if (topLeft + topRight + bottomRight + bottomLeft <= 0) {
      return null;
    }

    return { topLeft, topRight, bottomRight, bottomLeft };
  }

  const values = style.borderRadius.split(/\s+/).map(parseLength);
  if (values.some((value) => value === null)) {
    return null;
  }

  if (values.every((value) => value <= 0)) {
    return null;
  }

  const [first = 0, second = first, third = first, fourth = second] = values;
  return {
    topLeft: first,
    topRight: second,
    bottomRight: third,
    bottomLeft: fourth,
  };
}

function isEffectBoxRoot(element) {
  return (
    element.classList.contains('effect-container-box') ||
    element.classList.contains('effect-flotation-box') ||
    element.classList.contains('effect-popover-box') ||
    element.classList.contains('effect-popup-box') ||
    element.classList.contains('effect-subtle-card')
  );
}

function isEffectInternalLayer(element) {
  for (const className of element.classList) {
    if (EFFECT_LAYER_PATTERN.test(className)) {
      return true;
    }
  }

  return false;
}

function isOptedOut(element) {
  return element.hasAttribute(OPT_OUT_ATTR) || Boolean(element.closest(`[${OPT_OUT_ATTR}]`));
}

function shouldSkipStatic(element) {
  if (!(element instanceof HTMLElement)) {
    return true;
  }

  if (isOptedOut(element)) {
    return true;
  }

  if (SKIP_TAGS.has(element.tagName)) {
    return true;
  }

  if (element.closest('svg')) {
    return true;
  }

  if (isEffectInternalLayer(element)) {
    return true;
  }

  /* clip-path 会裁切 box-shadow；effect 场景类保留 border-radius，不做 squircle clip */
  if (isEffectBoxRoot(element)) {
    return true;
  }

  const style = getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return true;
  }

  return parseRadii(style) === null;
}

function hasLayout(element) {
  return element.offsetWidth >= 1 && element.offsetHeight >= 1;
}

function isCandidate(element) {
  return !shouldSkipStatic(element);
}

function canBind(element) {
  return isCandidate(element) && hasLayout(element);
}

function buildSquirclePath(element, radii, cornerSmoothing) {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const uniform =
    radii.topLeft === radii.topRight &&
    radii.topRight === radii.bottomRight &&
    radii.bottomRight === radii.bottomLeft;

  if (uniform) {
    return getSvgPath({
      width,
      height,
      cornerRadius: radii.topLeft,
      cornerSmoothing,
      preserveSmoothing: true,
    });
  }

  return getSvgPath({
    width,
    height,
    topLeftCornerRadius: radii.topLeft,
    topRightCornerRadius: radii.topRight,
    bottomRightCornerRadius: radii.bottomRight,
    bottomLeftCornerRadius: radii.bottomLeft,
    cornerSmoothing,
    preserveSmoothing: true,
  });
}

function applyCornerSmoothing(element) {
  const cornerSmoothing = readCornerSmoothing();
  if (cornerSmoothing <= 0) {
    clearCornerSmoothing(element);
    return;
  }

  const radii = parseRadii(getComputedStyle(element));
  if (!radii) {
    clearCornerSmoothing(element);
    return;
  }

  const path = buildSquirclePath(element, radii, cornerSmoothing);
  const clipPath = `path('${path}')`;
  element.style.clipPath = clipPath;
  element.style.webkitClipPath = clipPath;
  element.dataset.cornerSmoothingBound = 'true';
}

function clearCornerSmoothing(element) {
  if (element.dataset.cornerSmoothingBound !== 'true') {
    return;
  }

  element.style.clipPath = '';
  element.style.webkitClipPath = '';
  delete element.dataset.cornerSmoothingBound;
}

function renderCornerSmoothing(element) {
  if (!isCandidate(element)) {
    detachCornerSmoothing(element);
    return;
  }

  if (!hasLayout(element)) {
    watchUntilSized(element);
    return;
  }

  applyCornerSmoothing(element);
}

class CornerSmoothingSurface {
  constructor(element) {
    this.element = element;
    this.resizeObserver = new ResizeObserver(() => {
      renderCornerSmoothing(element);
    });
    this.resizeObserver.observe(element);
    renderCornerSmoothing(element);
  }

  destroy() {
    this.resizeObserver.disconnect();
    clearCornerSmoothing(this.element);
    delete this.element.dataset.cornerSmoothingBound;
  }
}

const instances = new WeakMap();
const pendingSizeObservers = new WeakMap();
let mutationObserver = null;
let initialized = false;
let scanScheduled = false;
const pendingScanRoots = new Set();

function cancelPendingWatch(element) {
  const observer = pendingSizeObservers.get(element);
  if (!observer) {
    return;
  }

  observer.disconnect();
  pendingSizeObservers.delete(element);
}

function watchUntilSized(element) {
  if (instances.has(element) || pendingSizeObservers.has(element) || !isCandidate(element)) {
    return;
  }

  const observer = new ResizeObserver(() => {
    if (!isCandidate(element)) {
      cancelPendingWatch(element);
      return;
    }

    if (!hasLayout(element)) {
      return;
    }

    cancelPendingWatch(element);
    bindElement(element);
  });

  observer.observe(element);
  pendingSizeObservers.set(element, observer);
}

function bindElement(element) {
  cancelPendingWatch(element);

  if (instances.has(element)) {
    renderCornerSmoothing(element);
    return instances.get(element);
  }

  const surface = new CornerSmoothingSurface(element);
  instances.set(element, surface);
  return surface;
}

export function attachCornerSmoothing(element) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError('attachCornerSmoothing expects an HTMLElement');
  }

  if (!isCandidate(element)) {
    return null;
  }

  if (!hasLayout(element)) {
    watchUntilSized(element);
    return null;
  }

  return bindElement(element);
}

export function detachCornerSmoothing(element) {
  cancelPendingWatch(element);

  const surface = instances.get(element);
  if (!surface) {
    clearCornerSmoothing(element);
    return;
  }

  surface.destroy();
  instances.delete(element);
}

function collectCandidates(root) {
  const elements = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

  for (let node = walker.currentNode; node; node = walker.nextNode()) {
    if (node instanceof HTMLElement && isCandidate(node)) {
      elements.push(node);
    }
  }

  return elements;
}

function unbindSubtree(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  for (const element of collectCandidates(root)) {
    detachCornerSmoothing(element);
  }
}

export function rescanCornerSmoothing(root = document.body) {
  return scanRoot(root);
}

function scanRoot(root) {
  if (!(root instanceof HTMLElement)) {
    return [];
  }

  const surfaces = [];
  for (const element of collectCandidates(root)) {
    if (canBind(element)) {
      surfaces.push(bindElement(element));
    } else {
      watchUntilSized(element);
    }
  }

  return surfaces;
}

function flushScheduledScans() {
  scanScheduled = false;
  const roots = [...pendingScanRoots];
  pendingScanRoots.clear();

  for (const root of roots) {
    scanRoot(root);
  }
}

function scheduleScan(root = document.body) {
  if (!root) {
    return;
  }

  pendingScanRoots.add(root);

  if (scanScheduled) {
    return;
  }

  scanScheduled = true;
  requestAnimationFrame(() => {
    requestAnimationFrame(flushScheduledScans);
  });
}

function handleMutations(mutations) {
  for (const mutation of mutations) {
    for (const node of mutation.removedNodes) {
      if (node instanceof HTMLElement) {
        unbindSubtree(node);
      }
    }

    for (const node of mutation.addedNodes) {
      if (node instanceof HTMLElement) {
        scheduleScan(node);
      }
    }

    if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
      const target = mutation.target;
      if (instances.has(target)) {
        renderCornerSmoothing(target);
      } else if (isCandidate(target)) {
        if (canBind(target)) {
          bindElement(target);
        } else {
          watchUntilSized(target);
        }
      } else {
        detachCornerSmoothing(target);
      }
    }
  }
}

export function initCornerSmoothing(options = {}) {
  if (typeof document === 'undefined') {
    return [];
  }

  const root = options.root instanceof HTMLElement ? options.root : document.body;
  const surfaces = scanRoot(root);
  scheduleScan(root);

  if (initialized) {
    return surfaces;
  }

  initialized = true;

  if (typeof MutationObserver !== 'undefined' && document.body) {
    mutationObserver = new MutationObserver(handleMutations);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
  }

  return surfaces;
}

export default {
  attachCornerSmoothing,
  detachCornerSmoothing,
  initCornerSmoothing,
  rescanCornerSmoothing,
};
