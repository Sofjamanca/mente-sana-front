# Sidebar Mejorada - Mente Sana

## 🚀 Características

La sidebar ha sido completamente rediseñada con las siguientes mejoras:

### ✨ **Diseño Moderno**
- Fuente Poppins aplicada consistentemente
- Transiciones suaves y animaciones
- Soporte completo para temas claro/oscuro
- Diseño responsive para todos los dispositivos

### 📱 **Responsive Design**
- **Desktop (≥1024px)**: Sidebar siempre visible, ancho fijo
- **Tablet (768px-1023px)**: Sidebar colapsable
- **Móvil (<768px)**: Sidebar overlay con botón hamburguesa

### 🎨 **Temas**
- Tema claro y oscuro
- Transiciones suaves entre temas
- Colores consistentes con la identidad de Mente Sana

### 🔧 **Funcionalidades**
- Menú colapsable en desktop
- Navegación automática
- Gestión de roles (admin/user)
- Control de tema integrado
- Perfil de usuario en footer

## 📁 Archivos Creados

```
src/
├── components/
│   ├── Sidebar.tsx              # Sidebar principal mejorada
│   ├── MobileMenuButton.tsx     # Botón hamburguesa para móvil
│   └── Layout.tsx               # Layout que integra la sidebar
├── hooks/
│   └── useResponsive.ts         # Hook para manejo responsive
└── styles/
    ├── Sidebar.css              # Estilos de la sidebar
    ├── MobileMenuButton.css     # Estilos del botón móvil
    └── Layout.css               # Estilos del layout
```

## 🛠️ Uso Básico

### 1. **Sidebar Simple**
```tsx
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Sidebar
      theme="light"
      onMenuClick={(key) => console.log('Navegando a:', key)}
      onLogout={() => console.log('Cerrando sesión')}
    />
  );
}
```

### 2. **Layout Completo con Sidebar**
```tsx
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <YourPageContent />
    </Layout>
  );
}
```

### 3. **Uso Manual del Hook Responsive**
```tsx
import useResponsive from './hooks/useResponsive';

function MyComponent() {
  const { isMobile, sidebarOpen, toggleSidebar } = useResponsive();
  
  return (
    <div>
      {isMobile && (
        <button onClick={toggleSidebar}>
          {sidebarOpen ? 'Cerrar' : 'Abrir'} Menú
        </button>
      )}
    </div>
  );
}
```

## 🎯 Props de la Sidebar

| Prop | Tipo | Descripción |
|------|------|-------------|
| `theme` | `"dark" \| "light"` | Tema actual de la aplicación |
| `isMobile` | `boolean` | Si está en modo móvil |
| `isOpen` | `boolean` | Si la sidebar está abierta (móvil) |
| `onClose` | `() => void` | Función para cerrar la sidebar |
| `onMenuClick` | `(key: string) => void` | Callback al hacer clic en menú |
| `onLogout` | `() => void` | Callback al cerrar sesión |

## 🎨 Personalización

### **Colores del Tema**
```css
/* Variables CSS personalizables */
:root {
  --sidebar-bg-light: #ffffff;
  --sidebar-bg-dark: #001529;
  --sidebar-accent: #ff4d4f;
  --sidebar-primary: #1890ff;
}
```

### **Animaciones**
```css
/* Transiciones personalizables */
.sidebar-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 📱 Comportamiento Responsive

### **Desktop (≥1024px)**
- Sidebar siempre visible
- Ancho fijo de 320px
- Botón de colapsar disponible
- Contenido principal con margen izquierdo

### **Tablet (768px-1023px)**
- Sidebar colapsable
- Ancho variable según estado
- Transiciones suaves

### **Móvil (<768px)**
- Sidebar como overlay
- Botón hamburguesa fijo
- Overlay para cerrar
- Animaciones de entrada/salida

## 🔧 Configuración Avanzada

### **Modificar Menú Items**
```tsx
// En Sidebar.tsx, editar el array 'items'
const items: MenuItem[] = [
  {
    key: "/nueva-ruta",
    label: "Nueva Página",
    icon: <NewIcon />
  },
  // ... más items
];
```

### **Agregar Roles Personalizados**
```tsx
// En getMenuItems()
if (isAdmin || userRole === 'moderator') {
  baseItems.push({
    key: "moderation",
    label: "Moderación",
    icon: <ModerationIcon />
  });
}
```

### **Personalizar Estilos**
```css
/* En Sidebar.css */
.sidebar-container {
  /* Tus estilos personalizados */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🚀 Mejoras Futuras

- [ ] Soporte para múltiples idiomas
- [ ] Temas personalizables por usuario
- [ ] Animaciones más avanzadas
- [ ] Integración con notificaciones
- [ ] Búsqueda en el menú
- [ ] Favoritos/páginas frecuentes

## 📝 Notas Importantes

1. **Fuente Poppins**: Asegúrate de que esté importada en tu CSS global
2. **Ant Design**: La sidebar usa componentes de Ant Design, asegúrate de tener la dependencia
3. **UserContext**: Requiere el contexto de usuario para el tema y perfil
4. **React Router**: Necesario para la navegación

## 🐛 Solución de Problemas

### **La fuente no se aplica**
- Verifica que `Sidebar.css` esté importado
- Asegúrate de que Poppins esté disponible en Google Fonts

### **No funciona en móvil**
- Verifica que `useResponsive` esté funcionando
- Asegúrate de que `isMobile` sea `true`

### **Problemas de navegación**
- Verifica que React Router esté configurado
- Revisa que las rutas en `items` coincidan con tu router

---

**Desarrollado para Mente Sana** ❤️
*Tu bienestar, nuestra prioridad*







