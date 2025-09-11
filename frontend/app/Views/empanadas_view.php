<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestión de Empanadas</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>

  <!-- Header fijo con CTA -->
  <header class="app-header">
    <h1>App gestión de empanadas chilenas: “Fonda SRN”</h1>
  </header>

  <!-- Toolbar: búsqueda + filtros -->
  <section class="toolbar container">
    <input id="searchInput" class="input" placeholder="Buscar por nombre o relleno…">
    <select id="typeFilter" class="select">
      <option value="">Todos los tipos</option>
      <option>Horno</option>
      <option>Frita</option>
    </select>
    <label class="switch">
      <input id="onlyAvailable" type="checkbox">
      <span>Solo disponibles</span>
    </label>
    <button id="btnOpenCreate" class="btn btn-primary">
      <span class="icon">＋</span> Añadir empanada
    </button>
  </section>

  <!-- Card principal con tabla -->
  <main class="container">
    <section class="card">
      <div class="table-wrap">
        <table id="empanadas-table" class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Estado</th>
              <th class="actions">Acciones</th>
            </tr>
          </thead>
          <tbody id="empanadas-table-body">
            <!-- filas por JS; incluye skeleton al cargar -->
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <!-- Modal Crear/Editar (reemplaza tu formulario visible) -->
  <div id="empModal" class="modal" hidden role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal-content">
      <header class="modal-header">
        <h2 id="modalTitle">Añadir empanada</h2>
        <button class="icon-btn" data-close aria-label="Cerrar">✕</button>
      </header>

      <form id="empanada-form" class="form">
        <input type="hidden" id="empanada-id">

        <div class="grid">
          <label>Nombre
            <input type="text" id="name" required class="input">
          </label>

          <label>Tipo
            <select id="type" required class="select">
              <option value="Horno">Horno</option>
              <option value="Frita">Frita</option>
            </select>
          </label>

          <label>Relleno
            <textarea id="filling" rows="2" class="input"></textarea>
          </label>

          <label>Precio (CLP)
            <input type="number" id="price" step="100" min="0" required class="input">
          </label>

          <label class="switch">
            <input id="is_sold_out" type="checkbox">
            <span>Marcar como agotada</span>
          </label>
        </div>

        <footer class="modal-actions">
          <button type="button" class="btn" data-close>Cancelar</button>
          <button type="submit" class="btn btn-primary" id="btnSave">Guardar</button>
        </footer>
      </form>
    </div>
  </div>

  <!-- Toasts -->
  <div id="toast" class="toast" hidden></div>

  <script src="/js/app.js"></script>
</body>
</html>