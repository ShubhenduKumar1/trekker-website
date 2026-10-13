import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";
import { importMap } from "./admin/importMap";

import "@payloadcms/next/css";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

/**
 * This is the actual Next.js root layout (owns <html>/<body>) for the whole
 * app, shared by the admin panel AND the frontend — because only one root
 * layout can define those tags. The frontend's own look (Navbar, Footer,
 * fonts, globals.css) lives one level down in src/app/(frontend)/layout.tsx.
 */
const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
