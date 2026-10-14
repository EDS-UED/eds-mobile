/** Figma icon artboard (32×32). */
export const ICON_VIEWBOX_SIZE = 32;

export function sizeIconMarkup(markup: string, displayPx: number): string {
  if (displayPx <= 0) return markup;
  return applySvgSize(markup, Math.round(displayPx));
}

function applySvgSize(svg: string, size: number): string {
  const openMatch = svg.match(/<svg\b[^>]*>/i);
  if (!openMatch) return svg;

  const openTag = openMatch[0];
  let attrs = openTag.slice(4, -1).trim();
  attrs = attrs.replace(/\swidth="[^"]*"/gi, '');
  attrs = attrs.replace(/\sheight="[^"]*"/gi, '');
  const nextOpen = attrs ? `<svg ${attrs} width="${size}" height="${size}">` : `<svg width="${size}" height="${size}">`;

  return svg.replace(openTag, nextOpen);
}
