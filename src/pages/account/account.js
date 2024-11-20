// Datos de ejemplo de usuarios
// const users = Array.from({ length: 20 }, (_, i) => ({
//   id: i + 1,
//   name: `Usuario ${i + 1}`,
//   email: `usuario${i + 1}@example.com`,
//   role: i % 2 === 0 ? "Admin" : "Usuario",
// }));

const users = [];

let displayCount = 10;
const userTableBody = document.getElementById("userTableBody");
const displayCountSelect = document.getElementById("displayCount");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const saveUserBtn = document.getElementById("saveUserBtn");

function renderUsers() {
  userTableBody.innerHTML = "";
  if (users.length > 0) {
    const usersToShow = users.slice(0, displayCount);
    usersToShow.forEach((user) => {
      const row = document.createElement("tr");
      const button =
        "<button onclick='selectUser(" +
        user.id +
        ")'>" +
        user.id +
        "</button>";
      row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${button}</td>
                `;
      userTableBody.appendChild(row);
    });

    loadMoreBtn.style.display =
      displayCount < users.length ? "inline-block" : "none";
  }
}

export function selectUser(userId) {
  window.electronAPI.openLinkedIn(userId);
}

displayCountSelect.addEventListener("change", (e) => {
  displayCount = Number(e.target.value);
  renderUsers();
});

loadMoreBtn.addEventListener("click", () => {
  displayCount = Math.min(displayCount + 5, users.length);
  renderUsers();
});

saveUserBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    // Agregar evento click al botón
    // const token = await bcrypt.hash({ username, password }, 10);

    try {
      // Realizar la petición a un endpoint (cambia esta URL por la de tu API)
      // const response = await fetch("http://localhost:5050/api/v1/users", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ username, password }),
      // });

      let response; // Manejar la respuesta de la petición
      if (!response) {
        throw new Error("Error");
      }
      users.push({ id: users.length + 1, name: username, email: password });
    } catch (error) {
      console.error("Error en la petición:", error);
    }
    // Cerrar el modal
    // eslint-disable-next-line no-undef
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("createUserModal")
    );
    modal.hide();

    // Limpiar el formulario
    document.getElementById("createUserForm").reset();
    renderUsers();
  } else {
    alert("Por favor, complete todos los campos");
  }
});

// Inicializar la tabla
renderUsers();
