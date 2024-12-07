# FakerAI

FakerAI es un paquete de NPM diseñado para generar datos aleatorios útiles para desarrolladores de software, testers y simulaciones. El paquete usa OpenAI para generar una amplia variedad de datos como nombres, correos electrónicos, direcciones, edades, precios y más, tanto en formatos sencillos como estructurados. FakerAI permite la personalización de los datos generados a través de esquemas Zod y otros formatos.

## Características

- Generación de datos aleatorios para pruebas y simulaciones.
- Soporte para varios tipos de datos: nombres, correos electrónicos, direcciones, edades, precios, monedas y más.
- Integración con OpenAI GPT para la generación avanzada de datos.
- Salida en varios formatos: texto, listas, JSON y esquemas Zod personalizados.
- Configuración flexible para elegir el formato de salida y los datos a generar.

## Instalación

Primero, instala el paquete FakerAI desde NPM:

```bash
npm install faker-ai
```

```typescript
import { FakerAI } from "faker-ai";
import { z } from "zod";

// Crear una instancia de FakerAI
const fakerAI = new FakerAI();

// Definir un esquema Zod para la generación de datos
const userSchema = z.object({
  nombre: z.string(),
  correo: z.string().email(),
  edad: z.number().min(18).max(65),
  ciudad: z.string(),
});

// Configurar el esquema Zod
fakerAI.setZodSchemeValue(userSchema);

// Ejecutar la generación de datos
await fakerAI.Run();

// Obtener la respuesta generada
const generatedData = fakerAI.getCompletionResponse();
console.log(generatedData);
```

# Métodos

**setZodSchemeValue(value: ZodObject<any>): this**
Establece el esquema Zod que define los tipos de los datos que se generarán.

**setIsZodScheme(value: boolean): this**
Configura si los datos deben generarse usando un esquema Zod. Si se establece en false, deshabilita el uso de esquemas Zod.

**setIsJSONScheme(value: boolean): this**
Configura si los datos deben generarse en formato JSON. Si se establece en false, deshabilita este formato.

**Run(): Promise<void>**
Genera los datos aleatorios de acuerdo con el esquema y las configuraciones definidas. Este método debe ser llamado después de configurar el esquema y el tipo de formato.

**getCompletionResponse(): any**
Devuelve los datos generados en el formato especificado, ya sea como un texto plano, un JSON o un esquema Zod validado.

### Ejemplos de Solicitudes

El sistema de FakerAI puede generar los siguientes tipos de datos:

**Nombres completos aleatorios**: 'Juan Pérez', 'Ana Rodríguez', 'Carlos López', ...
**Correos electrónicos aleatorios**: ['usuario1@dominio.com', 'usuario2@dominio.com', ...]
**Direcciones completas**:

```json
{
  "calle": "Calle Falsa 123",
  "ciudad": "Ciudad de México",
  "codigoPostal": "01000"
}
```

Precios aleatorios con monedas:

```json
{
  "precio": 100.0,
  "moneda": "USD"
}
```

### Datos con esquema Zod personalizado:

```json
{
  "nombre": "Laura García",
  "correo": "laura@dominio.com",
  "edad": 27,
  "ciudad": "Barcelona"
}
```

## Formatos de Respuesta

FakerAI soporta varios formatos de salida para los datos generados:

**Cadena de texto**: Un solo valor de texto como un nombre o correo electrónico.
**Lista de cadenas**: Una lista de elementos de texto aleatorios.
**Formato JSON**: Datos estructurados como objetos JSON, ideales para representar información compleja.
**Esquema Zod personalizado**: Datos validados y estructurados según un esquema Zod proporcionado.

### Configuración de la API

Para usar FakerAI, necesitas una clave de API de OpenAI. Configura la variable de entorno API_KEY_OPEN_AI con tu clave de API antes de ejecutar el código.

```bash
export API_KEY_OPEN_AI="tu_clave_de_api_aqui"
```

**Dependencias**

**openai**: La librería que interactúa con la API de OpenAI para generar los datos.
**zod**: Una biblioteca para validación de esquemas y tipos de datos.

### Contribuciones

Si deseas contribuir a este proyecto, por favor abre un "pull request" con tus mejoras o correcciones.

### Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.
