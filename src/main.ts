// const menu = require("./menu/navbar.js");
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  session,
} = require("electron");
const path = require("path");

let mainWindow: BrowserWindow;
let campaignSubMenu;

const NAME_APP = "Linkelin Automator";

const menuTemplate = Menu.buildFromTemplate([
  {
    label: " Opciones ",
    submenu: [
      {
        label: "Home",
        // click: () => mainWindow.loadURL("http://localhost:5173/"),
        click: () => mainWindow.loadFile("index.html"),
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
    click: () => console.log("Ir a Dashboard"),
  },
  {
    label: " Configuraciones ",
    submenu: [
      {
        label: "Limites",
        click: () => console.log("Configuraciones 'Limites'"),
      },
      {
        label: "Horas de Trabajo",
        click: () => console.log("Configuraciones 'Horas de Trabajo'"),
      },
      { label: "Otros", click: () => console.log("Configuraciones 'Otros'") },
    ],
  },
  {
    label: " Necesitas ayuda? ",
    submenu: [
      {
        label: "LinkedIn weekly invitation ",
        click: () => console.log("Configuraciones 'Necesitas ayuda'"),
      },
      {
        label: "Knowledge base",
        click: () => console.log("Configuraciones 'Necesitas ayuda'"),
      },
      {
        label: "Video tutorials",
        click: () => console.log("Configuraciones 'Necesitas ayuda'"),
      },
      {
        label: "Ask for Support",
        click: () => console.log("Configuraciones 'Necesitas ayuda'"),
      },
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
      preload: path.join(app.getAppPath(), "/src/preload.ts"),
    },
  });

  console.log(path.join(app.getAppPath(), "/src/preload.ts"));

  mainWindow.webContents.openDevTools();

  // Captura el texto enviado desde el proceso de renderizado
  ipcMain.on("get-text-from-page", (event, text) => {
    console.log("Texto recibido:", text); // Aquí se procesa lo que el usuario escribió
  });

  // Escuchar el evento 'did-navigate' para obtener la URL cada vez que cambie
  mainWindow.webContents.on("did-navigate", (event, url) => {
    console.log("Nueva URL:", url); // Mostrar la URL actual en la consola
  });

  // Escuchar el evento 'did-navigate-in-page' para obtener la URL al hacer navegación interna
  mainWindow.webContents.on("did-navigate-in-page", (event, url) => {
    console.log("URL dentro de la misma página:", url); // Mostrar la URL interna
  });

  // Opcional: Cuando la página cambia de título, asegúrate de mantener el nombre de tu app
  mainWindow.webContents.on("page-title-updated", (event) => {
    event.preventDefault(); // Evita que el título sea modificado por la página
    mainWindow.setTitle(`${NAME_APP}`); // Fija el título a tu aplicación
  });

  // Crear el menú desde la plantilla
  // const menu = Menu.buildFromTemplate(menuTemplate);
  // Set the menu to the main window
  Menu.setApplicationMenu(menuTemplate);
}

ipcMain.on("openLinkedIn", (event, userId) => {
  console.log(`Abriendo LinkedIn para el usuario: ${userId}`);
  openLinkedInForUser(userId);
});

function openLinkedInForUser(userId: string) {
  const userSession = session.fromPartition(`persist:${userId}`);

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      session: userSession, // Asignar la sesión personalizada
      preload: path.join(__dirname, "preload.ts"),
    },
  });

  win.loadURL("https://www.linkedin.com"); // Cargar LinkedIn
}

// Recuperar la sesión para un usuario
function getUserSession(userId: string) {
  return session.fromPartition(`persist:${userId}`);
}

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
          mainWindow.loadFile("./src/pages/campaigns/details.html");
        },
      })
    );
    // Refrescar el menú para que aparezca la nueva campaña
    Menu.setApplicationMenu(Menu.getApplicationMenu());
  } else {
    console.log("No se encontró el submenú 'Campañas'");
  }
}

app.whenReady().then(() => {
  createWindow();
  mainWindow.loadFile("./src/pages/page-landing.html");
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
