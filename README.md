# 📚 StoreBooks
Loja fictícia de livros — **CSS Grid + TailwindCSS + Bootstrap**, tema amarelo e neutros escuros.

## Estrutura
```
index.html           ← página principal (raiz, pronta para GitHub Pages)
tailwind.config.js   ← tema (colors, spacing, fontFamily, boxShadow) + keyframes/animations
assets/css/style.css ← CSS Grid (grid-template-areas) e ajustes de tema
assets/js/main.js    ← catálogo, busca, filtros, carrinho, favoritos, checkout
```

## Funcionalidades
Busca ao vivo (barra expansiva), filtro por categoria, ordenação, favoritos (salvos), carrinho com quantidades,
cupom `STORE10` (10%), frete grátis acima de R$ 150, checkout com validação, detalhes do livro em modal,
newsletter, toasts, voltar ao topo, scroll spy e carrinho/favoritos salvos no navegador (localStorage).
Capas reais via Open Library (com capa alternativa automática caso alguma falhe).

## Publicar no GitHub Pages
1. Envie todos os arquivos para a **raiz** do repositório.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Acesse `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

> Requer internet (CDNs do Tailwind/Bootstrap e capas da Open Library).
