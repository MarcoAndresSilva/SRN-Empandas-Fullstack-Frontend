document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api";
  const API_KEY = "mi-clave-ultra-secreta-12345";

  // Cache de selectores del DOM
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

  const showToast = (msg) => {
    toast.textContent = msg;
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
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><div class="skel" style="width:60%"></div></td>
        <td><div class="skel" style="width:40%"></div></td>
        <td><div class="skel" style="width:50%"></div></td>
        <td><div class="skel" style="width:40%"></div></td>
        <td class="actions"><div class="skel" style="width:100%"></div></td>`;
      tbody.appendChild(tr);
    }
  };

  const fetchEmpanadas = async () => {
    renderSkeleton();
    try {
      const resp = await fetch(`${API_URL}/empanadas`, {
        headers: { "X-API-KEY": API_KEY },
      });
      if (!resp.ok) throw new Error("Error de red al cargar empanadas");
      allEmpanadas = await resp.json();
      renderTable();
    } catch (e) {
      console.error("Error al obtener empanadas:", e);
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Error cargando datos. Revisa la conexión con la API.</td></tr>`;
    }
  };

  const renderTable = () => {
    const q = (searchInput.value || "").toLowerCase().trim();
    const fType = typeFilter.value;
    const onlyAvail = onlyAvailable.checked;

    const filtered = allEmpanadas.filter((e) => {
      const matchQ =
        !q || `${e.name} ${e.filling || ""}`.toLowerCase().includes(q);
      const matchType = !fType || e.type === fType;
      const matchAvail = !onlyAvail || e.is_sold_out === 0;
      return matchQ && matchType && matchAvail;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Sin resultados. Prueba otro filtro o crea una empanada.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    filtered.forEach((e) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.name}</td>
        <td>${e.type}</td>
        <td>${CLP.format(Number(e.price) || 0)}</td>
        <td><span class="badge ${e.is_sold_out ? "sold" : "ok"}">${
        e.is_sold_out ? "Agotada" : "Disponible"
      }</span></td>
        <td class="actions">
          <button class="btn edit-btn" 
            data-id="${e.id}" data-name="${e.name}" data-type="${e.type}"
            data-filling="${e.filling || ""}" data-price="${
        e.price
      }" data-sold="${e.is_sold_out ? 1 : 0}">
            Editar
          </button>
          <button class="btn delete-btn" data-id="${e.id}">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });
  };

  const debounce = (fn, t = 300) => {
    let h;
    return (...a) => {
      clearTimeout(h);
      h = setTimeout(() => fn(...a), t);
    };
  };
  const debouncedRender = debounce(renderTable);
  searchInput.addEventListener("input", debouncedRender);
  typeFilter.addEventListener("change", debouncedRender);
  onlyAvailable.addEventListener("change", debouncedRender);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
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
    const delay = new Promise((r) => setTimeout(r, 600));

    try {
      const fetchPromise = fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY },
        body: JSON.stringify(body),
      });
      const [resp] = await Promise.all([fetchPromise, delay]);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || "Error al guardar");
      }
      showToast(id ? "Empanada actualizada" : "Empanada creada");
      closeModal();
      await fetchEmpanadas(); // Recargamos todo desde la API
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      btnSave.disabled = false;
      btnSave.textContent = "Guardar";
    }
  });

  tbody.addEventListener("click", async (ev) => {
    const t = ev.target.closest("button");
    if (!t) return;
    const id = t.dataset.id;
    if (t.classList.contains("edit-btn")) {
      idInput.value = id;
      nameInput.value = t.dataset.name || "";
      typeInput.value = t.dataset.type || "Horno";
      fillingInput.value = t.dataset.filling || "";
      priceInput.value = t.dataset.price || 0;
      soldOutInput.checked = t.dataset.sold === "1";
      openModal("Editar empanada");
      return;
    }
    if (t.classList.contains("delete-btn")) {
      if (!confirm("¿Eliminar empanada de forma permanente?")) return;
      try {
        const resp = await fetch(`${API_URL}/empanada/${id}`, {
          method: "DELETE",
          headers: { "X-API-KEY": API_KEY },
        });
        if (!resp.ok) throw new Error("No se pudo eliminar");
        showToast("Empanada eliminada");
        await fetchEmpanadas();
      } catch (e) {
        console.error(e);
        alert("Error al eliminar");
      }
    }
  });

  // Event Listeners para el modal
  btnOpenCreate.onclick = () => {
    form.reset();
    idInput.value = "";
    openModal();
  };
  document
    .querySelectorAll("[data-close]")
    .forEach((b) => (b.onclick = closeModal));
  document.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && !modal.hidden && closeModal()
  );

  // Carga inicial
  fetchEmpanadas();
});
