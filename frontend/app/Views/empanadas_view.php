<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF--8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Empanadas</title>
    <!-- Un poco de estilo para que se vea decente -->

        <link rel="stylesheet" href="/css/style.css">
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