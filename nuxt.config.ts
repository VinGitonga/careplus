// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
   "@nuxtjs/tailwindcss",
   "shadcn-nuxt",
   "@nuxtjs/google-fonts",
   "@sidebase/nuxt-auth"
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  googleFonts: {
    families: {
      "Plus Jakarta Sans": true
    }
  },
  app: {
        head: {
            link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
        },
    },
  runtimeConfig: {
    db: {
      url: process.env.NEW_DB_URL!,
    },
    auth: {
      secret: process.env.AUTH_SECRET!,
      origin: process.env.AUTH_ORIGIN!,
    }
  },
  auth: {
    provider:{
      type: "authjs"
    }
  },
  devServer: {
    port: 6099
  }
});