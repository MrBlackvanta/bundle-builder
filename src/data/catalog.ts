import rawCatalog from './catalog.json';
import type { Catalog } from '../types';

export const catalog = rawCatalog as unknown as Catalog;
