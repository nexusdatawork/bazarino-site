# Patch v10 – Fix PAGE_SIZE is not defined

O Astro pode isolar o getStaticPaths do resto do frontmatter.
Então constantes usadas no getStaticPaths precisam existir dentro dele.

## Aplique
Substitua:
- src/pages/blog/page/[page].astro

## Teste
npm run build
