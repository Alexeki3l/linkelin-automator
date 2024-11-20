import { prueba } from "./scraper/prueba";

// const menu = require("./menu/navbar.js");
import { app, BrowserWindow, ipcMain, Menu, MenuItem, session } from "electron";
import path from "path";
import { test } from "./utils";

let mainWindow: BrowserWindow;
let campaignSubMenu;

const NAME_APP = "Linkelin Automator";

const menuTemplate = Menu.buildFromTemplate([
  {
    label: " Opciones ",
    submenu: [
      // {
      //   label: "Home",
      //   // accelerator: "CmdOrCtrl+H",
      //   click: () => mainWindow.loadFile("index.html"),
      //   // icon: path.join(__dirname, 'icon.png')
      // },
      {
        label: "Abrir Playwright",
        click: async () => {
          console.log("Menú seleccionado: Abrir Playwright");
          // mainWindow.webContents.send("menu-click", 1);
          await test();
        },
      },
      {
        label: "Accounts Linkelin",
        // click: () => mainWindow.loadURL("http://localhost:5173/"),
        click: () => mainWindow.loadFile("./src/pages/account/account.html"),
      },
      { type: "separator" }, // Separador
      {
        label: "Crear Campañas",
        click: () => addCampaign(), // Llama a la función para agregar campañas
      },
      {
        label: "Campaigns",
        submenu: [], // Aquí se añadirán dinámicamente las campañas
      },
      {
        label: "Linkedin",
        click: () => mainWindow.loadURL("https://www.linkedin.com"),
      },

      { type: "separator" }, // Separador
      { label: "Salir", role: "quit" }, // Rol predefinido
    ],
  },
  {
    label: " Dashboard ",
    click: () => mainWindow.loadFile("./src/pages/dashboad/dashboard.html"),
  },
  // {
  //   label: " Configuraciones ",
  //   submenu: [
  //     {
  //       label: "Limites",
  //       click: () => console.log("Configuraciones 'Limites'"),
  //     },
  //     {
  //       label: "Horas de Trabajo",
  //       click: () => console.log("Configuraciones 'Horas de Trabajo'"),
  //     },
  //     { label: "Otros", click: () => console.log("Configuraciones 'Otros'") },
  //   ],
  // },
  {
    label: " Necesitas ayuda? ",
    submenu: [
      {
        label: "Ayuda",
        click: () => mainWindow.loadFile("./src/pages/help/help.html"),
      },
      // {
      //   label: "LinkedIn weekly invitation ",
      //   click: () => console.log("Configuraciones 'Necesitas ayuda'"),
      // },
      // {
      //   label: "Knowledge base",
      //   click: () => console.log("Configuraciones 'Necesitas ayuda'"),
      // },
      // {
      //   label: "Video tutorials",
      //   click: () => console.log("Configuraciones 'Necesitas ayuda'"),
      // },
      // {
      //   label: "Ask for Support",
      //   click: () => console.log("Configuraciones 'Necesitas ayuda'"),
      // },
    ],
  },
]);

function createWindow() {
  const iconPath = __dirname + "/staticfiles/icons/linkedin.png";
  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(app.getAppPath(), "/preload.ts"),
      preload: path.join(__dirname, "preload.ts"),
    },
  });

  // console.log(path.join(app.getAppPath(), "/src/preload.ts"));

  mainWindow.webContents.openDevTools();

  // mainWindow.loadURL("https://www.linkedin.com");

  // Escuchar el evento 'did-navigate' para obtener la URL cada vez que cambie
  // mainWindow.webContents.on("did-navigate", async (event, url) => {
  //   console.log("Nueva URL:", url); // Mostrar la URL actual en la consola
  //   try {
  //     const cookies = await session.defaultSession.cookies.get({});
  //     console.log("Cookies obtenidas:", cookies);
  //   } catch (error) {
  //     console.error("Error obteniendo cookies:", error);
  //   }
  // });

  //solo funciona cuando se carga la aplicacion
  // mainWindow.webContents.once("did-finish-load", async () => {
  //   try {
  //     const cookies = await session.defaultSession.cookies.get({});
  //     console.log("Cookies obtenidas:", cookies);
  //   } catch (error) {
  //     console.error("Error obteniendo cookies:", error);
  //   }
  // });

  // Escuchar el evento 'did-navigate-in-page' para obtener la URL al hacer navegación interna
  mainWindow.webContents.on("did-navigate-in-page", (event, url) => {
    console.log("URL dentro de la misma página:", url); // Mostrar la URL interna
  });

  // Opcional: Cuando la página cambia de título, asegúrate de mantener el nombre de tu app
  mainWindow.webContents.on("page-title-updated", (event) => {
    event.preventDefault(); // Evita que el título sea modificado por la página
    mainWindow.setTitle(`${NAME_APP}`); // Fija el título a tu aplicación
  });

  // Aplicar el CSS personalizado
  // menuTemplate.setStyle({
  //   css: fs.readFileSync(path.join(__dirname, "styles.css"), "utf8"),
  // });
  // Set the menu to the main window
  Menu.setApplicationMenu(menuTemplate);
}

// ipcMain.on("openLinkedIn", (event, userId) => {
//   console.log(`Abriendo LinkedIn para el usuario: ${userId}`);
//   openLinkedInForUser(userId);
// });

// function openLinkedInForUser(userId: string) {
//   const userSession = session.fromPartition(`persist:${userId}`);

//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       session: userSession, // Asignar la sesión personalizada
//       preload: path.join(__dirname, "preload.ts"),
//     },
//   });

//   win.loadURL("https://www.linkedin.com"); // Cargar LinkedIn
// }

// Recuperar la sesión para un usuario
// function getUserSession(userId: string) {
//   return session.fromPartition(`persist:${userId}`);
// }

// import fs from "fs";
// import { chromium } from "playwright";

// const wer = async () => {
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   await page.goto("https://www.linkedin.com"); // Reemplaza con tu URL
//   console.log("Inicia sesión manualmente en la página.");

//   await page.waitForTimeout(10000);

//   // Espera unos segundos para permitir el inicio de sesión manual
//   // await page.waitForTimeout(10000);

//   // const cookies = await context.cookies();
//   // fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));

//   // console.log("Cookies guardadas en cookies.json");
//   await browser.close();
// };

// Función para añadir una nueva campaña al submenú
function addCampaign() {
  mainWindow.loadFile("./src/pages/campaigns/create-campaign.html");

  const campaignMenu = menuTemplate.items.find((item) => {
    if (item.submenu) {
      return item.submenu.items.find(
        (element) => element.label.trim() === "Campaigns"
      );
    }
    return false; // Si no tiene submenu, retorna false.
  });

  campaignSubMenu = campaignMenu.submenu.items.find(
    (item) => item.label.trim() === "Campaigns"
  );

  if (campaignSubMenu) {
    const campaignName = `Campaña ${campaignSubMenu.submenu.items.length + 1}`;
    campaignSubMenu.submenu.append(
      new MenuItem({
        label: campaignName,
        click: () => {
          console.log(`Clic en ${campaignName}`);
          mainWindow.loadFile(
            "./src/pages/campaigns/details-campaign/details.html"
          );
        },
      })
    );
    // Aplicar el CSS personalizado
    // menu.setStyle({
    //   css: fs.readFileSync(path.join(__dirname, "styles.css"), "utf8"),
    // });

    // Refrescar el menú para que aparezca la nueva campaña
    Menu.setApplicationMenu(Menu.getApplicationMenu());
  } else {
    console.log("No se encontró el submenú 'Campañas'");
  }
}

app.whenReady().then(async () => {
  createWindow();
  // await wer();
  mainWindow.loadFile("./src/pages/help/help.html");
});

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

app.on("web-contents-created", (e, wc) => {
  // before a webview makes a request
  wc.session.webRequest.onBeforeRequest((details, callback) => {
    // if the request url matches the url which appears to be sending the passkey request
    if (details.url.includes("checkpoint/pk/initiateLogin")) {
      // log the blocked url
      console.log("\x1b[31m", "Blocked", details.url);
    } else {
      // if the request url doesn't match the misbehaving url, allow the callback as usual
      callback({});
    }
  });
});
