# Inventario de Rollos

Sistema interno para consultar y cargar inventario de rollos de material (calibre, color, RAL, peso y estado de existencia).

## Language

**Rollo**:
Unidad de inventario identificada por código; representa un rollo físico de material en almacén.
_Avoid_: Producto, ítem, SKU

**Inventario**:
Conjunto de rollos registrados en el sistema, consultable y filtrable por el operador.
_Avoid_: Stock, catálogo

**Estado**:
Condición actual de un rollo en almacén. Valores válidos: `activo`, `destapado`, `sin existencias`.
_Avoid_: Status, disponibilidad

**Carga**:
Importación masiva de rollos desde un archivo CSV al inventario.
_Avoid_: Upload, importación

**Operador**:
Persona autenticada que ejecuta una carga CSV. No es un cliente externo.
_Avoid_: Usuario, admin

**Vista pública**:
Consulta del inventario de rollos sin autenticación. Cualquier visitante puede ver y filtrar la tabla.
_Avoid_: Pantalla abierta, guest view

**Área operador**:
Zona autenticada con shell de navegación (sidebar) para tareas internas como la carga CSV.
_Avoid_: Panel admin, backoffice

**Acceso operador**:
Punto de entrada al login desde la vista pública. Solo desbloquea el área operador; el inventario no requiere autenticación.
_Avoid_: Login, sign in

**Consulta**:
Acción de solo lectura sobre el inventario: filtrar, ordenar y paginar rollos sin modificar datos.
_Avoid_: Búsqueda, exploración

**Calculadora de peso**:
Suma del peso en kg de los rollos seleccionados en la vista pública. No modifica el inventario.
_Avoid_: Totalizador, sumatoria
