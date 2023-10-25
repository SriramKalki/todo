import "@/styles/globals.css";
import "nprogress/nprogress.css";
import React, { StrictMode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { Command } from "@/components/ui/command";
import SiteHeader from "@/components/site-header";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ServerResponse } from "http";
import { IncomingMessage } from "http";
import { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App: React.FC<AppProps> = ({ Component, pageProps, router }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null as string | null);

  const { pathname } = useRouter();

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <StrictMode>
      <Head>
        <title>Todo+</title>
      </Head>
      <ClerkProvider {...pageProps}>
        <Command />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster
            toastOptions={{
              position: "bottom-right",
            }}
          />
          <SiteHeader />
          <AnimatePresence mode="wait">
            <motion.div
              key={router.asPath}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <main className="w-100 h-100 py-8 flex">
                <Component {...pageProps} />
              </main>
            </motion.div>
          </AnimatePresence>
        </ThemeProvider>
      </ClerkProvider>
    </StrictMode>
  );
};

export default App;
