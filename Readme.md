# FakerAI - Generador de Datos de Prueba con Inteligencia Artificial

**FakerAI** es una poderosa librería de Node.js diseñada para generar datos aleatorios útiles en proyectos de desarrollo y pruebas de software. Usando **OpenAI** y un conjunto flexible de opciones, FakerAI permite a los desarrolladores generar datos como nombres, correos electrónicos, direcciones, fechas, UUIDs, números, tarjetas de crédito, y mucho más.

FakerAI es ideal para crear datos realistas en pruebas de simulación, generación de contenido aleatorio o para usar en entornos de desarrollo.

## Características

- **Generación de datos aleatorios** para pruebas y simulaciones.
- **Soporte para una amplia gama de tipos de datos**, incluyendo:
  - Nombres
  - Correos electrónicos
  - Direcciones
  - Fechas
  - Números
  - UUIDs
  - Tarjetas de crédito
  - Cuentas bancarias
  - Y muchos más...
- **Integración con OpenAI GPT** para generar datos avanzados de manera realista.
- **Flexibilidad en el formato de salida**:
  - Datos en texto plano
  - Datos estructurados en JSON
  - Datos validados con esquemas Zod
- **Configuración avanzada** para personalizar los datos generados con facilidad.

## Instalación

Para instalar FakerAI en tu proyecto, puedes usar npm o yarn:

```bash
npm install faker-ai
```

# Uso

## Requisitos previos

FakerAI requiere una clave de API de OpenAI. Puedes obtener tu clave desde OpenAI. Asegúrate de configurarla como una variable de entorno llamada API_KEY_OPENAI.

## Ejemplo de Uso Básico

```typescript
import { FakerAI } from "faker-ai";
import { z } from "zod";

// Crear una instancia de FakerAI con tu clave de API
const fakerAI = new FakerAI("TU_API_KEY_DE_OPENAI");

// Definir un esquema Zod para la validación de datos generados
const userSchema = z.object({
  nombre: z.string(),
  correo: z.string().email(),
  edad: z.number().min(18).max(65),
  ciudad: z.string(),
});

// Configurar el esquema Zod en FakerAI
fakerAI.setZodSchemeValue(userSchema);

// Generar datos de prueba (por ejemplo, 5 nombres aleatorios)
await fakerAI.names(5);

// Obtener los datos generados
const generatedData = fakerAI.getAll();
console.log(generatedData);
```

## Métodos Principales

FakerAI ofrece métodos específicos para generar distintos tipos de datos. Aquí hay algunos ejemplos:

**Generar Nombres:**

```typescript
await fakerAI.names(10);
```

**Generar Correos Electrónicos:**

```typescript
await fakerAI.emails(10);
```

Generar Direcciones:

```typescript
await fakerAI.addresses(10);
```

Generar Fechas:

```typescript
await fakerAI.dates(10);
```

Generar UUIDs:

```typescript
await fakerAI.uuids(10);
```

Generar Número de tarjetas de crédito:

```typescript
await fakerAI.credit_cards(10);
```

## Formatos de Respuesta

FakerAI permite varios formatos de salida, incluyendo:

**Texto plano:** Datos generados como cadenas de texto.
**JSON:** Datos estructurados en formato JSON, ideales para usar en bases de datos o API.
**Esquemas Zod personalizados:** Los datos generados pueden validarse automáticamente contra esquemas Zod definidos por el usuario.

Puedes elegir el formato que prefieras mediante las configuraciones disponibles en el paquete.

## Métodos de Configuración

- **setZodSchemeValue:** Configura un esquema Zod para validar los datos generados.

```typescript
fakerAI.setZodSchemeValue(
  z.object({
    nombre: z.string(),
    correo: z.string().email(),
  })
);
```

- **setIsZodScheme:** Habilita o deshabilita la validación con Zod.

```typescript
fakerAI.setIsZodScheme(true); // Activar validación con Zod
```

- **setIsJSONScheme:** Habilita o deshabilita la generación de datos en formato JSON.

```typescript
fakerAI.setIsJSONScheme(true); // Activar formato JSON
```

## Formato de Respuesta

Los datos generados pueden ser obtenidos a través del método **getAll():**

```typescript
const data = fakerAI.getAll();
```

## Contribuciones

Las contribuciones son bienvenidas. Si tienes una mejora o corrección, por favor abre un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

---

¡Gracias por usar **FakerAI**! Esperamos que esta herramienta sea útil para tus proyectos de desarrollo y pruebas de software.
