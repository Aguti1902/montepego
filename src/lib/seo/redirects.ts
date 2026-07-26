/**
 * Mapa de redirecciones 301 desde la web WordPress antigua.
 * Ampliar con el inventario real antes del lanzamiento.
 * TODO(cliente): confirmar listado completo de URLs indexadas
 */
export const legacyRedirects: Array<{ source: string; destination: string }> = [
  { source: "/en/properties/", destination: "/en/properties" },
  { source: "/nl/woningen/", destination: "/nl/woningen" },
  { source: "/es/propiedades/", destination: "/es/propiedades" },
  { source: "/en/contact/", destination: "/en/contact" },
  { source: "/en/about-us/", destination: "/en/about" },
  { source: "/en/sell-your-property/", destination: "/en/sell" },
  { source: "/property/:slug*", destination: "/en/property/:slug*" },
  { source: "/propiedades/:slug*", destination: "/es/propiedad/:slug*" },
];
