import { CyberLinkSimple } from 'src/types/base';

export const getUniqueParticlesFromLinks = (links: CyberLinkSimple[]) => [
  ...new Set([
    ...links.map((link) => link.to),
    ...links.map((link) => link.from),
  ]),
];
