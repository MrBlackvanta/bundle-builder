import rawCatalog from "./catalog.json";
import type { Catalog } from "./data.types";

export const catalog = rawCatalog as unknown as Catalog;
