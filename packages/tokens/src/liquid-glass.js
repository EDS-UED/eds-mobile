/**
 * Liquid Glass — SVG displacement backdrop filter (Web Renderer).
 * Adapted from https://github.com/shuding/liquid-glass (MIT © Shu Ding, 2025).
 *
 * Public Design Tokens: --eds-glass-blur, --eds-glass-saturation, --eds-glass-refraction
 * Shader parameters: renderer-internal defaults (not public CSS variables).
 *
 * Usage:
 *   import { initLiquidGlass, attachLiquidGlass } from '@eds/mobile-tokens/liquid-glass';
 *   initLiquidGlass();
 *   attachLiquidGlass(element);
 */

const GLASS_BOX_SELECTOR = '[data-liquid-glass-box]';

const RENDERER_SHADER = {
  default: {
    edgeStart: 0.8,
    edgeEnd: 0,
    edgeOffset: 0.15,
    rectInsetX: 0.2,
    rectInsetY: 0.15,
    cornerRadius: 0.6,
    refractionScale: 0.5,
  },
  box: {
    edgeStart: 0.72,
    edgeEnd: 0,
    edgeOffset: 0.08,
    rectInsetX: 0.14,
    rectInsetY: 0.12,
    cornerRadius: 0.55,
    refractionScale: 1.35,
  },
};

function smoothStep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function vectorLength(x, y) {
  return Math.sqrt(x * x + y * y);
}

function roundedRectSdf(x, y, halfWidth, halfHeight, radius) {
  const qx = Math.abs(x) - halfWidth + radius;
  const qy = Math.abs(y) - halfHeight + radius;
  return Math.min(Math.max(qx, qy), 0) + vectorLength(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

function texture(x, y) {
  return { type: 't', x, y };
}

function createFragment(options) {
  const {
    edgeStart = 0.8,
    edgeEnd = 0,
    edgeOffset = 0.15,
    rectInsetX = 0.2,
    rectInsetY = 0.15,
    cornerRadius = 0.6,
  } = options;

  const halfWidth = 0.5 - rectInsetX;
  const halfHeight = 0.5 - rectInsetY;

  return (uv) => {
    const ix = uv.x - 0.5;
    const iy = uv.y - 0.5;
    const distanceToEdge = roundedRectSdf(ix, iy, halfWidth, halfHeight, cornerRadius);
    const displacement = smoothStep(edgeStart, edgeEnd, distanceToEdge - edgeOffset);
    const scaled = smoothStep(0, 1, displacement);
    return texture(ix * scaled + 0.5, iy * scaled + 0.5);
  };
}

function readCssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function readCssNumber(name, fallback) {
  const parsed = Number.parseFloat(readCssVar(name, String(fallback)));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveShaderOptions(element) {
  if (element.matches?.(GLASS_BOX_SELECTOR)) {
    return RENDERER_SHADER.box;
  }
  return RENDERER_SHADER.default;
}

function buildBackdropFilter(filterId) {
  const blur = readCssVar('--eds-glass-blur', '50px');
  const saturate = readCssVar('--eds-glass-saturation', '360%');
  return `url(#${filterId}) saturate(${saturate}) blur(${blur})`;
}

class LiquidGlassSurface {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.canvasDpi = 1;
    this.id = `${options.filterPrefix ?? 'eds-liquid-glass'}-${Math.random().toString(36).slice(2, 9)}`;
    this.filterId = `${this.id}-filter`;
    this.fragment = createFragment(resolveShaderOptions(element));
    this.svg = null;
    this.feImage = null;
    this.feDisplacementMap = null;
    this.canvas = null;
    this.context = null;
    this.resizeObserver = null;

    this.createFilter();
    this.applyStyles();
    this.updateMap();
    this.observeSize();
  }

  createFilter() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svg.setAttribute('width', '0');
    this.svg.setAttribute('height', '0');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;overflow:hidden;';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', this.filterId);
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
    this.feImage.setAttribute('id', `${this.id}-map`);

    this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
    this.feDisplacementMap.setAttribute('in2', `${this.id}-map`);
    this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
    this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

    filter.appendChild(this.feImage);
    filter.appendChild(this.feDisplacementMap);
    defs.appendChild(filter);
    this.svg.appendChild(defs);

    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.svg);
    document.body.appendChild(this.canvas);
  }

  applyStyles() {
    this.element.dataset.liquidGlassReady = 'true';
    const backdropFilter = buildBackdropFilter(this.filterId);
    this.element.style.backdropFilter = backdropFilter;
    this.element.style.webkitBackdropFilter = backdropFilter;
  }

  getSize() {
    const rect = this.element.getBoundingClientRect();
    return {
      width: Math.max(1, Math.round(rect.width)),
      height: Math.max(1, Math.round(rect.height)),
    };
  }

  updateMap() {
    this.fragment = createFragment(resolveShaderOptions(this.element));

    const { width, height } = this.getSize();
    const w = width * this.canvasDpi;
    const h = height * this.canvasDpi;
    const data = new Uint8ClampedArray(w * h * 4);
    const rawValues = [];
    let maxScale = 0;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = this.fragment({ x: x / w, y: y / h });
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = (rawValues[index++] / maxScale + 0.5) * 255;
      data[i + 1] = (rawValues[index++] / maxScale + 0.5) * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    this.canvas.width = w;
    this.canvas.height = h;
    this.context.putImageData(new ImageData(data, w, h), 0, 0);

    this.feImage.setAttribute('width', String(width));
    this.feImage.setAttribute('height', String(height));
    this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());

    const filterNode = this.svg.querySelector('filter');
    filterNode.setAttribute('x', '0');
    filterNode.setAttribute('y', '0');
    filterNode.setAttribute('width', String(width));
    filterNode.setAttribute('height', String(height));

    const shader = resolveShaderOptions(this.element);
    const refraction = readCssNumber('--eds-glass-refraction', 0.08);
    const refractionBoost = Math.max(refraction / 0.08, 1);
    this.feDisplacementMap.setAttribute(
      'scale',
      String((maxScale / this.canvasDpi) * shader.refractionScale * refractionBoost * 2.5),
    );
  }

  observeSize() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateMap();
      this.applyStyles();
    });
    this.resizeObserver.observe(this.element);
  }

  destroy() {
    this.resizeObserver?.disconnect();
    this.svg?.remove();
    this.canvas?.remove();
    delete this.element.dataset.liquidGlassReady;
    delete this.element.dataset.liquidGlassBound;
  }
}

const instances = new WeakMap();
let mutationObserver = null;

export function attachLiquidGlass(element, options = {}) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError('attachLiquidGlass expects an HTMLElement');
  }

  if (instances.has(element)) {
    return instances.get(element);
  }

  const surface = new LiquidGlassSurface(element, options);
  element.dataset.liquidGlassBound = 'true';
  instances.set(element, surface);
  return surface;
}

export function detachLiquidGlass(element) {
  const surface = instances.get(element);
  if (!surface) {
    return;
  }
  surface.destroy();
  instances.delete(element);
}

function bindLiquidGlassElements(options = {}) {
  const selector = options.selector ?? GLASS_BOX_SELECTOR;
  const surfaces = [];

  for (const element of document.querySelectorAll(selector)) {
    if (element.dataset.liquidGlassBound === 'true') {
      continue;
    }
    surfaces.push(attachLiquidGlass(element, options));
  }

  return surfaces;
}

export function initLiquidGlass(options = {}) {
  const surfaces = bindLiquidGlassElements(options);

  if (!mutationObserver) {
    mutationObserver = new MutationObserver(() => {
      bindLiquidGlassElements(options);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  return surfaces;
}

export default {
  attachLiquidGlass,
  detachLiquidGlass,
  initLiquidGlass,
};
