# PrimeReact en modo unstyled con passthrough Tailwind

El rediseño migra toda la UI a PrimeReact con estética industrial utilitario. Se eligió **modo unstyled + passthrough Tailwind** en lugar del tema Lara o el preset Tailwind oficial.

Los temas predefinidos de PrimeReact producirían una interfaz genérica difícil de distinguir del stock. El passthrough permite controlar `DataTable`, `Tag`, `Sidebar` y formularios con el sistema visual propio (tipografía técnica, tags outline, paleta acero) sin pelear con estilos por defecto. El costo es mayor esfuerzo inicial por componente, pero coherencia en vista pública y área operador.

**Considered Options:** Lara personalizado (más rápido, look reconocible de PrimeReact), preset Tailwind oficial (compromiso intermedio).
