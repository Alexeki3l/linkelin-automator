import { chromium } from "playwright";
import {
  CookiesInterfaceElectron,
  CookiesInterfacePlaywright,
} from "./interfaces";
import { Cookie, session } from "electron";

export const test = async () => {
  try {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://www.linkedin.com");

    const url = page.url();
    console.log(`URL en el playwrigth:${url}`);
    console.log("Esperar 1minuto");
    await page.waitForTimeout(60 * 1000);
    console.log("Se acabo el minuto");

    const cookies_response = await context.cookies(`${url}`);
    console.log(JSON.stringify(cookies_response, null, 2));

    // await page.waitForTimeout(10000);
    await page.pause();

    await browser.close();
  } catch (error) {
    console.log(error.message);
  }
};

export const playwrightTest = async (
  url: string,
  electronCookies: CookiesInterfaceElectron[]
) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // Convierte cookies de Electron al formato Playwright y las agrega
  const playwrightCookies: ReadonlyArray<CookiesInterfacePlaywright> = ([] =
    electronCookies.map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expirationDate,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite, // Puedes ajustarlo según tus necesidades
    })));

  await context.addCookies(playwrightCookies);

  const page = await context.newPage();
  await page.goto(`${url}`);

  await page.waitForTimeout(60 * 1000);
  console.log("Página cargada con cookies de Electron.");
  await browser.close();
};

export const takeCookiesOfElectronAndSendToPlaywright = async (url: string) => {
  try {
    const cookies: CookiesInterfaceElectron[] = (
      await session.defaultSession.cookies.get({})
    ).map((cookie: Cookie) => {
      return {
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        expirationDate: cookie.expirationDate,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite:
          cookie.sameSite === "unspecified"
            ? "None"
            : cookie.sameSite === "no_restriction"
            ? "None"
            : cookie.sameSite === "lax"
            ? "Lax"
            : "Strict",
      };
    });
    // console.log("Cookies obtenidas:", cookies);
    if (cookies) await playwrightTest(url, cookies);
  } catch (error) {
    console.error("Error obteniendo cookies('mainWindows'):", error);
  }
};
