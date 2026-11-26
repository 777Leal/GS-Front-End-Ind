/**
 * Configuração do Tailwind – StoreBooks (tema amarelo + neutros escuros)
 * Funciona no navegador (GitHub Pages, carregado após o CDN) e com Node (module.exports).
 */
const config = {
  content: ["./index.html", "./assets/js/**/*.js"],
  // preflight e visibility desligados para não conflitar com o Bootstrap (.collapse etc.)
  corePlugins: { preflight: false, visibility: false },
  theme: {
    extend: {
      colors: {
        brand: { 50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207" },
        ink: { 100:"#e5e5e5",300:"#b3b3b3",400:"#8a8a8a",600:"#3f3f3f",700:"#2b2b2b",800:"#1f1f1f",900:"#141414",950:"#0a0a0a" },
      },
      spacing: { 18:"4.5rem", 22:"5.5rem", 128:"32rem" },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        book: "0 10px 25px -5px rgba(0,0,0,.6)",
        glow: "0 20px 45px -12px rgba(250,204,21,.45)",
      },
      keyframes: {
        fadeIn: { "0%":{opacity:0,transform:"translateY(-12px)"}, "100%":{opacity:1,transform:"translateY(0)"} },
        slideIn: { "0%":{opacity:0,transform:"translateX(-60px)"}, "100%":{opacity:1,transform:"translateX(0)"} },
        growLine: { "0%":{width:"0%"}, "100%":{width:"100%"} },
        shadowPulse: { "0%,100%":{boxShadow:"0 10px 25px -5px rgba(0,0,0,.6)"}, "50%":{boxShadow:"0 25px 50px -12px rgba(250,204,21,.55)"} },
        pulseSocial: { "0%,100%":{transform:"scale(1) rotate(0)"}, "50%":{transform:"scale(1.3) rotate(12deg)"} },
        float: { "0%,100%":{transform:"translateY(0)"}, "50%":{transform:"translateY(-10px)"} },
        bump: { "0%,100%":{transform:"scale(1)"}, "50%":{transform:"scale(1.5)"} },
      },
      animation: {
        fadeIn: "fadeIn .8s ease-out both",
        slideIn: "slideIn .7s ease-out both",
        growLine: "growLine .35s ease-out forwards",
        shadowPulse: "shadowPulse 1.2s ease-in-out infinite",
        "pulse-social": "pulseSocial .8s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        bump: "bump .35s ease-in-out",
      },
    },
  },
  plugins: [],
};
if (typeof module !== "undefined" && module.exports) module.exports = config;
if (typeof tailwind !== "undefined") tailwind.config = config;
