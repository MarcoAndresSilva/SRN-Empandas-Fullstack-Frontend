document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api";
  const tablaBody = document.getElementById("empanadas-table-body");
  const empanadaForm = document.getElementById("empanada-form");
  const formTitle = document.getElementById("form-title");
  const empanadaIdInput = document.getElementById("empanada-id");
  const submitButton = empanadaForm.querySelector('button[type="submit"]');

  // --- FUNCIÓN PARA OBTENER Y MOSTRAR LAS EMPANADAS (GET) ---
  const fetchEmpanadas = async () => {
    try {
      const response = await fetch(`${API_URL}/empanadas`);
      const empanadas = await response.json();
      tablaBody.innerHTML = "";
      empanadas.forEach((empanada) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${empanada.name}</td>
                    <td>${empanada.type}</td>
                    <td>$${parseFloat(empanada.price).toFixed(2)}</td>
                    <td>
                        <button class="edit-btn" data-id="${
                          empanada.id
                        }" data-name="${empanada.name}" data-type="${
          empanada.type
        }" data-filling="${empanada.filling}" data-price="${
          empanada.price
        }">Editar</button>
                        <button class="delete-btn" data-id="${
                          empanada.id
                        }">Eliminar</button>
                    </td>
                `;
        tablaBody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al obtener empanadas:", error);
    }
  };

  // --- MANEJO DEL FORMULARIO PARA CREAR Y EDITAR (POST/PUT) ---
  empanadaForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";

    const empanadaData = {
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      filling: document.getElementById("filling").value,
      price: document.getElementById("price").value,
    };
    const id = empanadaIdInput.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/empanada/${id}` : `${API_URL}/empanada`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empanadaData),
      });

      if (response.ok) {
        empanadaForm.reset();
        empanadaIdInput.value = "";
        formTitle.textContent = "Añadir Nueva Empanada";
        fetchEmpanadas();
      } else {
        console.error("Error al guardar la empanada.");
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red al intentar guardar. Revisa la conexión con la API.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
  // --- MANEJO DE CLICS EN BOTONES DE LA TABLA (EDITAR/ELIMINAR) ---
  tablaBody.addEventListener("click", async (event) => {
    const target = event.target;
    const id = target.dataset.id;

    // Botón Eliminar
    if (target.classList.contains("delete-btn")) {
      if (confirm("¿Estás seguro de que quieres eliminar esta empanada?")) {
        try {
          const response = await fetch(`${API_URL}/empanada/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            fetchEmpanadas();
          } else {
            console.error("Error al eliminar la empanada.");
          }
        } catch (error) {
          console.error("Error de red:", error);
        }
      }
    }

    // Botón Editar
    if (target.classList.contains("edit-btn")) {
      document.getElementById("empanada-id").value = id;
      document.getElementById("name").value = target.dataset.name;
      document.getElementById("type").value = target.dataset.type;
      document.getElementById("filling").value = target.dataset.filling;
      document.getElementById("price").value = target.dataset.price;
      formTitle.textContent = "Editar Empanada";
      window.scrollTo(0, 0); // Sube la página al inicio para ver el form
    }
  });

  // Carga inicial de datos
  fetchEmpanadas();
});
