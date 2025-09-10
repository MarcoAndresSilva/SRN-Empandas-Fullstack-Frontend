<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF--8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Empanadas</title>
    <!-- Un poco de estilo para que se vea decente -->
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #333; }
        h1, h2 { color: #d9534f; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f8f8; }
        form { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; }
        input, textarea, button { width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; }
        button { background-color: #5cb85c; color: white; border: none; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #4cae4c; }
        .delete-btn { background-color: #d9534f; }
        .delete-btn:hover { background-color: #c9302c; }
        .edit-btn { background-color: #f0ad4e; margin-right: 5px; }
        .edit-btn:hover { background-color: #ec971f; }
        td button { width: auto; display: inline-block; padding: 8px 12px; }
    </style>
</head>
<body>

    <h1>Fonda "El Programador" - Gestión de Empanadas</h1>

    <!-- Formulario para Añadir/Editar Empanadas -->
    <div id="form-container">
        <h2 id="form-title">Añadir Nueva Empanada</h2>
        <form id="empanada-form">
            <input type="hidden" id="empanada-id">
            
            <label for="name">Nombre:</label>
            <input type="text" id="name" required>
            
            <label for="type">Tipo (ej: Horno, Frita):</label>
            <input type="text" id="type" required>
            
            <label for="filling">Relleno:</label>
            <textarea id="filling" rows="3"></textarea>
            
            <label for="price">Precio:</label>
            <input type="number" id="price" step="0.01" required>
            
            <button type="submit">Guardar</button>
        </form>
    </div>

    <hr>

    <h2>Listado de Empanadas</h2>
    <table id="empanadas-table">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody id="empanadas-table-body">
            <!-- Las filas se insertarán aquí con JavaScript -->
        </tbody>
    </table>

    <!-- El script de JavaScript que le dará vida a la página -->
    <script src="/js/app.js"></script>
</body>
</html>