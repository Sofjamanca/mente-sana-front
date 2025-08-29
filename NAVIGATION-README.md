# 🧭 Sistema de Navegación - Mente Sana

Este documento describe los componentes de navegación implementados para mejorar la experiencia del usuario en la aplicación Mente Sana.

## 📋 Componentes Disponibles

### 1. `HomeNavigation` - Navegación Principal del Home

**Propósito**: Barra de navegación completa para la página principal con breadcrumbs, navegación rápida y acciones contextuales.

**Características**:
- ✅ Breadcrumbs dinámicos basados en la ruta actual
- ✅ Navegación rápida entre secciones principales
- ✅ Acciones contextuales según la página
- ✅ Notificaciones con badge
- ✅ Menú de usuario desplegable
- ✅ Botones de búsqueda, filtros y refrescar
- ✅ Responsive design para móvil y desktop

**Uso**:
```tsx
import HomeNavigation from '../components/HomeNavigation';

// En el componente Home
<HomeNavigation 
  theme={theme} 
  onRefresh={fetchEntriesAndStatus}
  showQuickActions={true}
/>
```

**Props**:
- `theme`: 'dark' | 'light' - Tema de la aplicación
- `onRefresh?`: () => void - Función para refrescar datos
- `showQuickActions?`: boolean - Mostrar navegación rápida (default: true)

---

### 2. `PageNavigation` - Navegación para Páginas Específicas

**Propósito**: Navegación simplificada para páginas individuales con breadcrumbs y acciones básicas.

**Características**:
- ✅ Breadcrumbs simples con navegación
- ✅ Título y subtítulo de la página
- ✅ Botones de acción (regresar, refrescar, inicio)
- ✅ Acciones adicionales personalizables
- ✅ Responsive design

**Uso**:
```tsx
import PageNavigation from '../components/PageNavigation';

// En cualquier página
<PageNavigation 
  theme={theme}
  title="Resumen Diario"
  subtitle="Registra tu estado de ánimo y actividades del día"
  onBack={() => navigate(-1)}
  onRefresh={fetchData}
  showHomeButton={true}
  extraActions={
    <Button type="primary" icon={<PlusOutlined />}>
      Nueva Entrada
    </Button>
  }
/>
```

**Props**:
- `theme`: 'dark' | 'light' - Tema de la aplicación
- `title`: string - Título principal de la página
- `subtitle?`: string - Subtítulo opcional
- `onBack?`: () => void - Función para regresar
- `onRefresh?`: () => void - Función para refrescar
- `showHomeButton?`: boolean - Mostrar botón de inicio (default: true)
- `extraActions?`: React.ReactNode - Acciones adicionales personalizadas

---

## 🎨 Estilos y Temas

### Tema Claro (Light)
- Fondo: `#ffffff`
- Bordes: `#f0f0f0`
- Texto: `#1f2937`
- Sombras: `rgba(0, 0, 0, 0.06)`

### Tema Oscuro (Dark)
- Fondo: `#1f1f1f`
- Bordes: `#303030`
- Texto: `#ffffff`
- Sombras: `rgba(0, 0, 0, 0.3)`

---

## 📱 Responsive Design

### Desktop (> 768px)
- Layout horizontal completo
- Todos los elementos visibles
- Hover effects completos

### Tablet (≤ 768px)
- Layout adaptativo
- Navegación rápida en columna
- Botones de acción redimensionados

### Móvil (≤ 480px)
- Layout vertical completo
- Elementos optimizados para touch
- Texto y botones redimensionados

---

## 🔧 Integración en Páginas Existentes

### 1. Página Home
```tsx
// mente-sana-front/src/pages/Home.tsx
import HomeNavigation from '../components/HomeNavigation';

const Home = ({ theme }: HomeProps) => {
  return (
    <div className={`home ${theme}`}>
      {/* Barra de Navegación */}
      <HomeNavigation 
        theme={theme} 
        onRefresh={fetchEntriesAndStatus}
        showQuickActions={true}
      />
      
      {/* Resto del contenido... */}
    </div>
  );
};
```

### 2. Páginas Específicas
```tsx
// mente-sana-front/src/pages/DailySummary.tsx
import PageNavigation from '../components/PageNavigation';

const DailySummary = ({ theme }: DailySummaryProps) => {
  return (
    <div className={`daily-summary ${theme}`}>
      {/* Navegación de Página */}
      <PageNavigation 
        theme={theme}
        title="Resumen Diario"
        subtitle="Registra tu estado de ánimo y actividades del día"
        onBack={() => navigate('/home')}
        onRefresh={fetchData}
        extraActions={
          <Button type="primary" icon={<PlusOutlined />}>
            Nueva Entrada
          </Button>
        }
      />
      
      {/* Resto del contenido... */}
    </div>
  );
};
```

---

## 🚀 Funcionalidades Avanzadas

### Breadcrumbs Dinámicos
Los breadcrumbs se generan automáticamente basándose en la ruta actual:
- `/home` → "Inicio"
- `/home/profile/edit` → "Inicio > Mi Perfil"
- `/home/admin/blogs` → "Inicio > Panel Admin > Gestión Blogs"

### Navegación Rápida
Botones de acceso directo a las secciones principales:
- Dashboard
- Resumen Diario
- Eventos
- Blogs
- Contactos
- Acerca de

### Acciones Contextuales
Las acciones cambian según la página actual:
- **Home**: "Registrar mi día" + "Admin" (si es admin)
- **Admin**: "Nuevo Blog" + "Nuevo Evento"
- **Eventos**: "Ver Eventos"
- **Blogs**: "Explorar Blogs"

---

## 🎯 Casos de Uso

### 1. Usuario Regular
- Navega entre secciones usando la navegación rápida
- Ve breadcrumbs para orientarse
- Accede a acciones principales desde el Home

### 2. Usuario Admin
- Acceso rápido al panel de administración
- Acciones contextuales para crear contenido
- Navegación entre módulos admin

### 3. Móvil
- Botón hamburguesa para abrir sidebar
- Navegación optimizada para touch
- Layout responsive adaptativo

---

## 🔄 Actualizaciones y Mantenimiento

### Agregar Nueva Sección
1. Actualizar `quickNavItems` en `HomeNavigation.tsx`
2. Agregar caso en `getBreadcrumbs()`
3. Actualizar `getContextualActions()` si es necesario

### Modificar Estilos
1. Editar archivos CSS correspondientes
2. Mantener consistencia con el sistema de temas
3. Verificar responsive design

### Agregar Nueva Acción
1. Crear función en el componente padre
2. Pasar como prop `onRefresh`, `onBack`, etc.
3. Actualizar interfaz de props si es necesario

---

## 📊 Beneficios del Sistema

### Para el Usuario
- ✅ Navegación intuitiva y clara
- ✅ Orientación visual con breadcrumbs
- ✅ Acceso rápido a funciones principales
- ✅ Experiencia consistente en todas las páginas

### Para el Desarrollador
- ✅ Componentes reutilizables
- ✅ Sistema de navegación centralizado
- ✅ Fácil mantenimiento y actualización
- ✅ Código limpio y organizado

### Para la Aplicación
- ✅ UX mejorada y profesional
- ✅ Navegación coherente
- ✅ Responsive design nativo
- ✅ Soporte para temas claro/oscuro

---

## 🐛 Solución de Problemas

### Breadcrumbs No Se Muestran
- Verificar que la ruta esté en `getBreadcrumbs()`
- Comprobar que `useLocation()` funcione correctamente

### Estilos No Se Aplican
- Verificar que el CSS esté importado
- Comprobar que el tema se pase correctamente

### Responsive No Funciona
- Verificar media queries en CSS
- Comprobar que `useResponsive` hook esté funcionando

---

## 🔮 Futuras Mejoras

### Planificadas
- [ ] Búsqueda global en tiempo real
- [ ] Filtros avanzados por página
- [ ] Historial de navegación
- [ ] Favoritos personalizables

### Ideas
- [ ] Navegación por gestos en móvil
- [ ] Atajos de teclado
- [ ] Navegación por voz
- [ ] Modo offline con navegación local

---

## 📞 Soporte

Para dudas o problemas con el sistema de navegación:
1. Revisar este README
2. Verificar la consola del navegador
3. Comprobar que todos los imports estén correctos
4. Verificar que las rutas estén definidas en el router

---

*Última actualización: Diciembre 2024*
*Versión: 1.0.0*





