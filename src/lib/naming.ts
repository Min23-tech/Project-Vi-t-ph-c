import { colorName, EVENT_BY_ID, STYLE_BY_ID } from '../data/catalog';
import { GARMENT_BY_ID } from '../data/garments';
import type { Look, LookContext } from '../types';

export function autoName(look: Look, ctx: LookContext): string {
  const garment = GARMENT_BY_ID[look.garment].name;
  const color = colorName(look.colors.primary);
  const occasion = ctx.event ? EVENT_BY_ID[ctx.event].name : STYLE_BY_ID[look.style].name;
  return `${garment}${color ? ` ${color.toLowerCase()}` : ''} · ${occasion}`;
}
