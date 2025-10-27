# Shared UI Components

Esta carpeta contiene componentes reutilizables de la interfaz de usuario que pueden ser utilizados en toda la aplicación para mantener consistencia y reducir la duplicación de código.

## Componentes Disponibles

### FormInputComponent
Componente de input de formulario con íconos, validación y funcionalidades avanzadas.

**Características:**
- Soporte para diferentes tipos de input (text, password, email)
- Íconos personalizables
- Indicador de éxito
- Toggle de visibilidad para contraseñas
- Validación visual
- ControlValueAccessor para integración con formularios reactivos

**Uso:**
```typescript
<app-form-input
  label="Username"
  inputId="username"
  name="username"
  type="text"
  placeholder="Enter your username"
  icon="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
  [(ngModel)]="username"
  [showSuccessIcon]="true"
  [showPasswordToggle]="false"
  [required]="true"
  [hasError]="false"
  errorMessage="Username is required"
></app-form-input>
```

### FormButtonComponent
Componente de botón de formulario con estados de carga e íconos.

**Características:**
- Estados de carga con spinner
- Íconos personalizables
- Diferentes variantes (primary, secondary, danger, success)
- Deshabilitación automática durante carga

**Uso:**
```typescript
<app-form-button
  text="Sign In"
  icon="M15 3H9C6.79086 3 5 4.79086 5 7V17C5 19.2091 6.79086 21 9 21H15C17.2091 21 19 19.2091 19 17V7C19 4.79086 17.2091 3 15 3Z"
  [isLoading]="isLoading"
  [disabled]="!form.valid"
  (onClick)="handleSubmit()"
></app-form-button>
```

### LoadingSpinnerComponent
Componente de spinner de carga reutilizable.

**Características:**
- Tamaño personalizable
- Texto opcional
- Modo inline o block
- Animación suave

**Uso:**
```typescript
<app-loading-spinner
  text="Loading..."
  size="24px"
  [inline]="false"
></app-loading-spinner>
```

### ErrorMessageComponent
Componente para mostrar mensajes de error de manera consistente.

**Características:**
- Ícono de error
- Animación de shake opcional
- Estilos consistentes

**Uso:**
```typescript
<app-error-message
  [message]="errorMessage"
  [animate]="true"
></app-error-message>
```

### FormLabelComponent
Componente de label de formulario con soporte para íconos (actualmente no usado en el login refactorizado).

**Características:**
- Íconos personalizables
- Indicador de campo requerido
- Estilos consistentes

## Instalación

Los componentes están diseñados para ser usados con Angular standalone components. Simplemente importa los componentes que necesites:

```typescript
import {
  FormInputComponent,
  FormButtonComponent,
  LoadingSpinnerComponent,
  ErrorMessageComponent
} from './components/shared';

@Component({
  // ...
  imports: [FormInputComponent, FormButtonComponent, LoadingSpinnerComponent, ErrorMessageComponent]
})
```

## Beneficios

1. **Consistencia**: Todos los formularios tienen el mismo aspecto y comportamiento
2. **Mantenibilidad**: Cambios en un componente se reflejan en toda la aplicación
3. **Reutilización**: Reduce la duplicación de código HTML y CSS
4. **Accesibilidad**: Componentes diseñados con buenas prácticas de accesibilidad
5. **Responsive**: Todos los componentes son responsive por defecto

## Próximos Pasos

- Crear más componentes reutilizables (DatePicker, Select, Checkbox, etc.)
- Implementar temas personalizables
- Agregar tests unitarios
- Documentación más detallada con ejemplos
