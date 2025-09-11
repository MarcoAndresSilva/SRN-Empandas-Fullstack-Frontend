document.addEventListener("DOMContentLoaded", () => {
  // CONFIGURACIÓN Y SELECTORES DEL DOM
  const API_URL = "http://localhost:3000/api";
  const API_KEY = "mi-clave-ultra-secreta-12345";

  const tbody = document.getElementById("empanadas-table-body");
  const modal = document.getElementById("empModal");
  const form = document.getElementById("empanada-form");
  const btnOpenCreate = document.getElementById("btnOpenCreate");
  const btnSave = document.getElementById("btnSave");
  const modalTitle = document.getElementById("modalTitle");
  const toast = document.getElementById("toast");

  const idInput = document.getElementById("empanada-id");
  const nameInput = document.getElementById("name");
  const typeInput = document.getElementById("type");
  const fillingInput = document.getElementById("filling");
  const priceInput = document.getElementById("price");
  const soldOutInput = document.getElementById("is_sold_out");

  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const onlyAvailable = document.getElementById("onlyAvailable");

  let allEmpanadas = []; // Caché local para filtrar sin llamar a la API

  const CLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  // FUNCIONES DE UTILIDAD (UI)
  const showToast = (message) => {
    toast.textContent = message;
    toast.hidden = false;
    setTimeout(() => (toast.hidden = true), 2500);
  };

  const openModal = (title = "Añadir empanada") => {
    modalTitle.textContent = title;
    modal.hidden = false;
    nameInput.focus();
  };

  const closeModal = () => (modal.hidden = true);

  const renderSkeleton = (rows = 5) => {
    tbody.innerHTML = "";
    for (let i = 0; i < rows; i++) {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td><div class="skel" style="width:60%"></div></td>
        <td><div class="skel" style="width:40%"></div></td>
        <td><div class="skel" style="width:50%"></div></td>
        <td><div class="skel" style="width:40%"></div></td>
        <td class="actions"><div class="skel" style="width:100%"></div></td>`;
      tbody.appendChild(tableRow);
    }
  };

  const debounce = (callback, delay = 300) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  };

  // LÓGICA PRINCIPAL (DATOS Y RENDERIZADO)
  const fetchEmpanadas = async () => {
    renderSkeleton();
    try {
      const response = await fetch(`${API_URL}/empanadas`, {
        headers: { "X-API-KEY": API_KEY },
      });
      if (!response.ok) throw new Error("Error de red al cargar empanadas");
      allEmpanadas = await response.json();
      renderTable();
    } catch (error) {
      console.error("Error al obtener empanadas:", error);
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Error cargando datos. Revisa la conexión con la API.</td></tr>`;
    }
  };

  const renderTable = () => {
    const query = (searchInput.value || "").toLowerCase().trim();
    const filterType = typeFilter.value;
    const onlyAvailableChecked = onlyAvailable.checked;

    const filteredEmpanadas = allEmpanadas.filter((empanada) => {
      const matchesQuery =
        !query ||
        `${empanada.name} ${empanada.filling || ""}`
          .toLowerCase()
          .includes(query);
      const matchesType = !filterType || empanada.type === filterType;
      const matchesAvailability =
        !onlyAvailableChecked || empanada.is_sold_out === 0;
      return matchesQuery && matchesType && matchesAvailability;
    });

    if (!filteredEmpanadas.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Sin resultados. Prueba otro filtro o crea una empanada.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    filteredEmpanadas.forEach((empanada) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td>${empanada.name}</td>
        <td>${empanada.type}</td>
        <td>${CLP.format(Number(empanada.price) || 0)}</td>
        <td><span class="badge ${empanada.is_sold_out ? "sold" : "ok"}">${
        empanada.is_sold_out ? "Agotada" : "Disponible"
      }</span></td>
        <td class="actions">
          <button class="btn edit-btn" 
            data-id="${empanada.id}" data-name="${empanada.name}" data-type="${
        empanada.type
      }"
            data-filling="${empanada.filling || ""}" data-price="${
        empanada.price
      }" data-sold="${empanada.is_sold_out ? 1 : 0}">
            Editar
          </button>
          <button class="btn delete-btn" data-id="${
            empanada.id
          }">Eliminar</button>
        </td>`;
      tbody.appendChild(tableRow);
    });
  };

  // EVENT LISTENERS
  const debouncedRender = debounce(renderTable);
  searchInput.addEventListener("input", debouncedRender);
  typeFilter.addEventListener("change", debouncedRender);
  onlyAvailable.addEventListener("change", debouncedRender);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = idInput.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/empanada/${id}` : `${API_URL}/empanada`;
    const body = {
      name: nameInput.value,
      type: typeInput.value,
      filling: fillingInput.value,
      price: priceInput.value,
      is_sold_out: !!soldOutInput.checked,
    };
    btnSave.disabled = true;
    btnSave.textContent = "Guardando…";
    const delay = new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const fetchPromise = fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY },
        body: JSON.stringify(body),
      });
      const [response] = await Promise.all([fetchPromise, delay]);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al guardar");
      }
      showToast(id ? "Empanada actualizada" : "Empanada creada");
      closeModal();
      await fetchEmpanadas();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      btnSave.disabled = false;
      btnSave.textContent = "Guardar";
    }
  });

  tbody.addEventListener("click", async (event) => {
    const clickedElement = event.target.closest("button");
    if (!clickedElement) return;
    const id = clickedElement.dataset.id;

    if (clickedElement.classList.contains("edit-btn")) {
      idInput.value = id;
      nameInput.value = clickedElement.dataset.name || "";
      typeInput.value = clickedElement.dataset.type || "Horno";
      fillingInput.value = clickedElement.dataset.filling || "";
      priceInput.value = clickedElement.dataset.price || 0;
      soldOutInput.checked = clickedElement.dataset.sold === "1";
      openModal("Editar empanada");
      return;
    }

    if (clickedElement.classList.contains("delete-btn")) {
      if (!confirm("¿Eliminar empanada de forma permanente?")) return;
      try {
        const response = await fetch(`${API_URL}/empanada/${id}`, {
          method: "DELETE",
          headers: { "X-API-KEY": API_KEY },
        });
        if (!response.ok) throw new Error("No se pudo eliminar");
        showToast("Empanada eliminada");
        await fetchEmpanadas();
      } catch (error) {
        console.error(error);
        alert("Error al eliminar");
      }
    }
  });

  btnOpenCreate.onclick = () => {
    form.reset();
    idInput.value = "";
    openModal();
  };

  document
    .querySelectorAll("[data-close]")
    .forEach((button) => (button.onclick = closeModal));
  document.addEventListener(
    "keydown",
    (event) => event.key === "Escape" && !modal.hidden && closeModal()
  );

  // CARGA INICIAL
  fetchEmpanadas();
});
