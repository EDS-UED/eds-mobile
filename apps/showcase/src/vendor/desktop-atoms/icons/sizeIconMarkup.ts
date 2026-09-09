/** Desktop icon 源稿 viewBox 边长（32×32 artboard）。 */
export const ICON_VIEWBOX_SIZE = 32;

/** 仅设 svg width/height（取整避免子像素）；描边由 CSS calc 补偿（见 Icon.module.css）。 */
export function sizeIconMarkup(markup: string, displayPx: number): string {
  if (displayPx <= 0) return markup;
  return applySvgSize(markup, Math.round(displayPx));
}

function applySvgSize(svg: string, size: number): string {
  const openMatch = svg.match(/<svg\b[^>]*>/i);
  if (!openMatch) return svg;

  const openTag = openMatch[0];
  let attrs = openTag.slice(4, -1).trim(); // drop "<svg" and ">"
  attrs = attrs.replace(/\swidth="[^"]*"/gi, '');
  attrs = attrs.replace(/\sheight="[^"]*"/gi, '');
  const nextOpen = attrs ? `<svg ${attrs} width="${size}" height="${size}">` : `<svg width="${size}" height="${size}">`;

  return svg.replace(openTag, nextOpen);
}
