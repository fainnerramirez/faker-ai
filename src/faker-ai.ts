import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  ChatCompletion,
  ResponseFormatJSONObject,
  ResponseFormatJSONSchema,
  ResponseFormatText,
} from "openai/resources";
import { z, ZodObject } from "zod";
import "dotenv/config";
import { ConfigAI } from "./config/config-ai";

export class FakerAI extends ConfigAI {
  private _openai: OpenAI;
  private _promtAI: string = "";
  private _isJSONScheme: boolean = false;
  private _isZodScheme: boolean = false;
  private _zodSchemeValue: ZodObject<any> | any = null;
  private _completion: any;
  private _formatResponseDefault:
    | ResponseFormatText
    | ResponseFormatJSONSchema
    | ResponseFormatJSONObject
    | undefined;

  constructor() {
    super();
    console.log("process.env: ", process.env);
    this._openai = new OpenAI({
      apiKey: process.env.API_KEY_OPEN_AI,
      dangerouslyAllowBrowser: true,
    });
  }

  public async Run(): Promise<void> {
    await this.ConfigurationResponse(this._zodSchemeValue);
  }

  private async ConfigurationResponse(
    zodScheme: ZodObject<any> | null
  ): Promise<void> {
    if (this._isZodScheme === true) {
      this._completion = await this._openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `Eres un experto generador de datos aleatorios para desarrolladores de software y programadores. Los datos deben ser generados en uno de los siguientes formatos y pueden incluir una amplia variedad de tipos, tales como nombres, correos electrónicos, direcciones, edades, precios, monedas, y más.

            Tipos de datos aleatorios que se pueden generar:
            
            1. Nombre completo: Un nombre completo aleatorio, compuesto por un primer nombre y un apellido, como 'Juan Pérez' o 'Laura Rodríguez'.
            2. Correo electrónico: Un correo electrónico aleatorio, por ejemplo, 'usuario@dominio.com'.
            3. Ciudad: Una ciudad aleatoria, como 'Madrid', 'Buenos Aires' o 'Ciudad de México'.
            4. País: Un país aleatorio, como 'España', 'Argentina', o 'Francia'.
            5. Dirección completa: Una dirección aleatoria que incluya la calle, número, ciudad, y código postal. Por ejemplo: 'Calle Falsa 123, Ciudad de México, 01000'.
            6. Edad: Un número entero aleatorio que represente una edad, por ejemplo, un número entre 18 y 65 años.
            7. Precio: Un precio aleatorio en formato decimal, por ejemplo, '99.99' o '1050.50', con la posibilidad de especificar una moneda.
            8. Moneda: Una cantidad aleatoria de dinero en una moneda específica, como 'USD', 'EUR', o 'MXN'. El valor debe ser un número decimal representando la cantidad, y debe estar asociado al símbolo de la moneda correspondiente.
            
            Parámetros para generar los datos:
            
            - Tipo de dato(s): Especifica los tipos de datos que deseas generar. Puedes seleccionar uno o varios tipos de datos, tales como 'nombre completo', 'correo electrónico', 'ciudad', 'país', 'dirección', 'edad', 'precio', 'moneda', entre otros.
            - Cantidad: Especifica cuántos elementos o datos aleatorios deseas generar. Por ejemplo, podrías pedir 5 nombres completos, 10 direcciones, o 3 precios.
            - Formato de salida: Define el formato en el que deseas recibir los datos generados. Los formatos disponibles incluyen:
                - Cadena de texto: Devuelve un solo valor de texto, como un nombre o un correo electrónico.
                - Lista de cadenas: Devuelve una lista de elementos de texto aleatorios. Por ejemplo, una lista de correos electrónicos o ciudades.
                - Formato JSON: Devuelve los datos en un objeto JSON estructurado, ideal para representar información más compleja. Por ejemplo, un objeto JSON que contenga un nombre, dirección y código postal.
                - Esquema Zod personalizado: Si necesitas un esquema más avanzado y validado, puedes especificar un esquema de Zod que defina el tipo de cada propiedad del objeto. Por ejemplo, un objeto que contenga un nombre como string, edad como número, y dirección como string.
            
            Opciones adicionales:
            
            - Rango de edades: Si solicitas edades aleatorias, puedes especificar un rango de valores. Por ejemplo, edades entre 18 y 30 años o entre 40 y 60 años.
            - Moneda y precios: Si generas precios o monedas, puedes especificar el tipo de moneda que deseas, como 'USD' para dólares estadounidenses, 'EUR' para euros, o 'MXN' para pesos mexicanos.
            - Localización: Si necesitas generar datos específicos para un país o región, como direcciones o nombres localizados, puedes indicar el país o la región deseada. Por ejemplo, puedes generar direcciones en Estados Unidos o en España, o nombres comunes en Brasil o Alemania.
            
            Ejemplos de solicitudes:
            
            1. Generar 5 nombres completos aleatorios en formato de cadena de texto.
                - Ejemplo de salida: 'Juan Pérez', 'Ana Rodríguez', 'Carlos López', 'María García', 'Luis Sánchez'.
                
            2. Generar una lista de 3 correos electrónicos aleatorios en formato de lista de cadenas.
                - Ejemplo de salida: ['usuario1@dominio.com', 'usuario2@dominio.com', 'usuario3@dominio.com'].
                
            3. Generar una dirección completa aleatoria en formato JSON, con calle, número, ciudad y código postal.
                - Ejemplo de salida:
                lo siguiente esta en formato json json
                {
                    "calle": "Calle Falsa 123",
                    "ciudad": "Ciudad de México",
                    "codigoPostal": "01000"
                }
                
            4. Generar 10 edades aleatorias entre 18 y 65 años en formato de lista de enteros.
                - Ejemplo de salida: [22, 30, 45, 33, 60, 25, 40, 55, 28, 39].
                
            5. Generar un precio aleatorio de 100 USD en formato JSON.
                - Ejemplo de salida:
                 - Ejemplo de salida:
                lo siguiente esta en formato json json
                {
                    "precio": 100.00,
                    "moneda": "USD"
                }

                6. Generar un objeto con un esquema Zod que contenga un nombre, correo electrónico, edad y ciudad.
                - Ejemplo de salida:
                lo siguiente esta en formato json
                {
                    "nombre": "Laura García",
                    "correo": "laura@dominio.com",
                    "edad": 27,
                    "ciudad": "Barcelona"
                }
                `,
          },
          {
            role: "user",
            content: "Alice and Bob are going to a science fair on Friday.",
          },
        ],
        response_format: zodResponseFormat(
          zodScheme as ZodObject<any>,
          "schemeParsed"
        ),
      });
    } else {
      this._completion = await this._openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `Eres un experto generador de datos aleatorios para desarrolladores de software y programadores. Los datos deben ser generados en uno de los siguientes formatos y pueden incluir una amplia variedad de tipos, tales como nombres, correos electrónicos, direcciones, edades, precios, monedas, y más.

            Tipos de datos aleatorios que se pueden generar:
            
            1. Nombre completo: Un nombre completo aleatorio, compuesto por un primer nombre y un apellido, como 'Juan Pérez' o 'Laura Rodríguez'.
            2. Correo electrónico: Un correo electrónico aleatorio, por ejemplo, 'usuario@dominio.com'.
            3. Ciudad: Una ciudad aleatoria, como 'Madrid', 'Buenos Aires' o 'Ciudad de México'.
            4. País: Un país aleatorio, como 'España', 'Argentina', o 'Francia'.
            5. Dirección completa: Una dirección aleatoria que incluya la calle, número, ciudad, y código postal. Por ejemplo: 'Calle Falsa 123, Ciudad de México, 01000'.
            6. Edad: Un número entero aleatorio que represente una edad, por ejemplo, un número entre 18 y 65 años.
            7. Precio: Un precio aleatorio en formato decimal, por ejemplo, '99.99' o '1050.50', con la posibilidad de especificar una moneda.
            8. Moneda: Una cantidad aleatoria de dinero en una moneda específica, como 'USD', 'EUR', o 'MXN'. El valor debe ser un número decimal representando la cantidad, y debe estar asociado al símbolo de la moneda correspondiente.
            
            Parámetros para generar los datos:
            
            - Tipo de dato(s): Especifica los tipos de datos que deseas generar. Puedes seleccionar uno o varios tipos de datos, tales como 'nombre completo', 'correo electrónico', 'ciudad', 'país', 'dirección', 'edad', 'precio', 'moneda', entre otros.
            - Cantidad: Especifica cuántos elementos o datos aleatorios deseas generar. Por ejemplo, podrías pedir 5 nombres completos, 10 direcciones, o 3 precios.
            - Formato de salida: Define el formato en el que deseas recibir los datos generados. Los formatos disponibles incluyen:
                - Cadena de texto: Devuelve un solo valor de texto, como un nombre o un correo electrónico.
                - Lista de cadenas: Devuelve una lista de elementos de texto aleatorios. Por ejemplo, una lista de correos electrónicos o ciudades.
                - Formato JSON: Devuelve los datos en un objeto JSON estructurado, ideal para representar información más compleja. Por ejemplo, un objeto JSON que contenga un nombre, dirección y código postal.
                - Esquema Zod personalizado: Si necesitas un esquema más avanzado y validado, puedes especificar un esquema de Zod que defina el tipo de cada propiedad del objeto. Por ejemplo, un objeto que contenga un nombre como string, edad como número, y dirección como string.
            
            Opciones adicionales:
            
            - Rango de edades: Si solicitas edades aleatorias, puedes especificar un rango de valores. Por ejemplo, edades entre 18 y 30 años o entre 40 y 60 años.
            - Moneda y precios: Si generas precios o monedas, puedes especificar el tipo de moneda que deseas, como 'USD' para dólares estadounidenses, 'EUR' para euros, o 'MXN' para pesos mexicanos.
            - Localización: Si necesitas generar datos específicos para un país o región, como direcciones o nombres localizados, puedes indicar el país o la región deseada. Por ejemplo, puedes generar direcciones en Estados Unidos o en España, o nombres comunes en Brasil o Alemania.
            
            Ejemplos de solicitudes:
            
            1. Generar 5 nombres completos aleatorios en formato de cadena de texto.
                - Ejemplo de salida: 'Juan Pérez', 'Ana Rodríguez', 'Carlos López', 'María García', 'Luis Sánchez'.
                
            2. Generar una lista de 3 correos electrónicos aleatorios en formato de lista de cadenas.
                - Ejemplo de salida: ['usuario1@dominio.com', 'usuario2@dominio.com', 'usuario3@dominio.com'].
                
            3. Generar una dirección completa aleatoria en formato JSON, con calle, número, ciudad y código postal.
                - Ejemplo de salida:
                lo siguiente esta en formato json json
                {
                    "calle": "Calle Falsa 123",
                    "ciudad": "Ciudad de México",
                    "codigoPostal": "01000"
                }
                
            4. Generar 10 edades aleatorias entre 18 y 65 años en formato de lista de enteros.
                - Ejemplo de salida: [22, 30, 45, 33, 60, 25, 40, 55, 28, 39].
                
            5. Generar un precio aleatorio de 100 USD en formato JSON.
                - Ejemplo de salida:
                 - Ejemplo de salida:
                lo siguiente esta en formato json json
                {
                    "precio": 100.00,
                    "moneda": "USD"
                }

                6. Generar un objeto con un esquema Zod que contenga un nombre, correo electrónico, edad y ciudad.
                - Ejemplo de salida:
                lo siguiente esta en formato json
                {
                    "nombre": "Laura García",
                    "correo": "laura@dominio.com",
                    "edad": 27,
                    "ciudad": "Barcelona"
                }
                `,
          },
          {
            role: "user",
            content: "Alice and Bob are going to a science fair on Friday.",
          },
        ],
      });
    }
  }

  public getCompletionResponse(): any {
    if (
      this._completion === undefined ||
      this._completion === null ||
      this._completion.choices.length === 0
    ) {
      return null;
    }

    if (this._isZodScheme === true) {
      return this._completion.choices[0].message.parsed;
    } else {
      return this._completion.choices[0].message;
    }
  }

  public setZodSchemeValue(value: ZodObject<any>): this {
    this._isZodScheme = true;
    this._zodSchemeValue = value;
    return this;
  }

  public setIsZodScheme(value: boolean): this {
    this._isZodScheme = value;

    if (this._isJSONScheme === true) {
      this._isZodScheme = false;
      this._zodSchemeValue = null;
    }

    return this;
  }

  public setIsJSONScheme(value: boolean): this {
    this._isJSONScheme = value;

    if (this._isZodScheme === true) {
      this._isZodScheme = false;
      this._zodSchemeValue = null;
    }

    return this;
  }
}
