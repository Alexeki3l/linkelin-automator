/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);

// En tu archivo Playwright o integrado en la lógica de Electron
// import { chromium } from "playwright";

// window.electronAPI.onMenuClick(async (menuOption) => {
//   //   if (menuOption === "Abrir Playwright") {
//   //     console.log("Playwright será lanzado...");

//   //     const browser = await chromium.launch({ headless: false });
//   //     const context = await browser.newContext();
//   //     const page = await context.newPage();

//   //     await page.goto("https://www.linkedin.com"); // Cambia a la URL deseada
//   //     console.log("Página cargada en Playwright");

//   //     await page.waitForTimeout(10000);

//   //     await browser.close();
//   //   }
//   console.log(menuOption);
// });
