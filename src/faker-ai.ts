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
import { ConfigGenerateAI } from "./config/config-ai";
import { ResponseDataRandom, typeDataRamdom } from "./interfaces/types";

export class FakerAI extends ConfigGenerateAI {
  private _openai: OpenAI;
  private _isJSONScheme: boolean = false;
  private _isZodScheme: boolean = false;
  private _zodSchemeValue: ZodObject<any> | any = null;
  private _completion: any;
  private _dataResponse: any = null;

  constructor(API_KEY_OPENAI = "") {
    super();
    this._openai = new OpenAI({
      apiKey: API_KEY_OPENAI,
      dangerouslyAllowBrowser: true,
    });
  }

  private async ConfigurationResponse(data: ResponseDataRandom): Promise<any> {
    if (this._isZodScheme === true) {
      this._completion = await this._openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content:
              `Eres un experto generador de datos aleatorios para desarrolladores de software y programadores. Los datos deben ser generados en uno de los siguientes formatos y pueden incluir una amplia variedad de tipos, tales como nombres, correos electrónicos, direcciones, edades, precios, monedas, y más.

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
                ` +
              `
                el lenguaje base que vas a utilizar es javascript con typescript para los tipos de los datos que vas a generar.
                - Por ejemplo si solicito una lista de nombres completos me vas a DEVOLVER un ARRAY de nombres así; esto es un ejemplo: ["nombre1", "nombre2", "nombre3"]
                de esta manera vas a seguir el siguiente paso a paso para generar la data: 

                la enumeración que el usuario va a tener par generar la data depende de unas opciones que estan en esta estructura: 
                export enum typeDataRamdom {
                  NAMES = 1,
                  DATES,
                  COUNTRIES,
                  CITYS,
                  PHONE_NUMBERS,
                  EMAILS,
                  URLS,
                  ADDRESSES,
                  NUMBERS,
                  BOOLEANS,
                  PERCENTAGES,
                  SENTENCES,
                  WORDS,
                  TEXTS,
                  UUIDS,
                  CREDIT_CARDS,
                  IP_ADDRESSES,
                  GAMES,
                  CURRENCIES,
                  TIMEZONES
                }
                
                Así que, depende lo que pida el usuario te lo voyahacer saber a travez de cada opción de esta enumeración:
                Es decir, si te digo que la data que vas a generar es de tipo typeDataRamdom.NAMES ó 1 es porque el usuario quieres LISTA DE NOMBRES COMPLETOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.DATES ó 2 es porque el usuario quieres LISTA DE FECHAS,
                Si te digo que la data que vas a generar es de typeDataRamdom.COUNTRIES ó 3 es porque el usuario quieres LISTA DE PAÍSES,
                Si te digo que la data que vas a generar es de typeDataRamdom.CITYS ó 4 es porque el usuario quieres LISTA DE CIUDADES,
                Si te digo que la data que vas a generar es de typeDataRamdom.PHONE_NUMBERS ó 5 es porque el usuario quieres LISTA DE N��MEROS DE TELÉFONO,
                Si te digo que la data que vas a generar es de typeDataRamdom.EMAILS ó 6 es porque el usuario quieres LISTA DE CORREOS ELECTRÓNICOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.URLS ó 7 es porque el usuario quieres LISTA DE URLS,
                Si te digo que la data que vas a generar es de typeDataRamdom.ADDRESSES ó 8 es porque el usuario quieres LISTA DE DIRECCIONES,
                Si te digo que la data que vas a generar es de typeDataRamdom.NUMBERS ó 9 es porque el usuario quieres LISTA DE N��MEROS,
                Si te digo que la data que vas a generar es de typeDataRamdom.BOOLEANS ó 10 es porque el usuario quieres LISTA DE VALORES BOOLEANOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.PERCENTAGES ó 11 es porque el usuario quieres LISTA DE N��MEROS EN PORCENTAJE,
                Si te digo que la data que vas a generar es de typeDataRamdom.SENTENCES ó 12 es porque el usuario quieres LISTA DE ORACIONES,
                Si te digo que la data que vas a generar es de typeDataRamdom.WORDS ó 13 es porque el usuario quieres LISTA DE PALABRAS,
                Si te digo que la data que vas a generar es de typeDataRamdom.TEXTS ó 14 es porque el usuario quieres LISTA DE TEXTOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.UUIDS ó 15 es porque el usuario quieres LISTA DE UUIDS,
                Si te digo que la data que vas a generar es de typeDataRamdom.CREDIT_CARDS ó 16 es porque el usuario quieres LISTA DE TARJETAS DE CRÉDITO,
                Si te digo que la data que vas a generar es de typeDataRamdom.IP_ADDRESSES ó 17 es porque el usuario quieres LISTA DE DIRECCIONES IP,
                Si te digo que la data que vas a generar es de typeDataRamdom.GAMES ó 18 es porque el usuario quieres LISTA DE JUEGOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.CURRENCIES es porque el usuario quieres LISTA DE MONEDAS así: {symbol, value}
                Si te digo que la data que vas a generar es de typeDataRamdom.TIMEZONES ó 19 es porque el usuario quieres LISTA DE ZONAS HORARIAS,

                por tanto la solicitud completa del usuario es la siguiente:

                - el tipo de data que vas a generar es ${data.type}
                - el número de elementos que vas a generar son ${data.count}

                solo generar la data que te pido SIN TEXTO ADICIONAL para que yo pueda utilizarla desde javascript y manipkuar esta data.
                `,
          },
          {
            role: "user",
            content: "Alice and Bob are going to a science fair on Friday.",
          },
        ],
        response_format: zodResponseFormat(
          this._zodSchemeValue as ZodObject<any>,
          "schemeParsed"
        ),
      });

      this._dataResponse = this._completion.choices[0].message.parsed;
    } else {
      this._completion = await this._openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              `Eres un experto generador de datos aleatorios para desarrolladores de software y programadores. Los datos deben ser generados en uno de los siguientes formatos y pueden incluir una amplia variedad de tipos, tales como nombres, correos electrónicos, direcciones, edades, precios, monedas, y más.

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
                ` +
              `
                el lenguaje base que vas a utilizar es javascript con typescript para los tipos de los datos que vas a generar.
                - Por ejemplo si solicito una lista de nombres completos me vas a DEVOLVER un ARRAY de nombres así; esto es un ejemplo: ["nombre1", "nombre2", "nombre3"]
                de esta manera vas a seguir el siguiente paso a paso para generar la data: 

                la enumeración que el usuario va a tener par generar la data depende de unas opciones que estan en esta estructura: 
                export enum typeDataRamdom {
                  NAMES = 1,
                  DATES,
                  COUNTRIES,
                  CITYS,
                  PHONE_NUMBERS,
                  EMAILS,
                  URLS,
                  ADDRESSES,
                  NUMBERS,
                  BOOLEANS,
                  PERCENTAGES,
                  SENTENCES,
                  WORDS,
                  TEXTS,
                  UUIDS,
                  CREDIT_CARDS,
                  IP_ADDRESSES,
                  GAMES,
                  CURRENCIES,
                  TIMEZONES
                }
                
                Así que, depende lo que pida el usuario te lo voyahacer saber a travez de cada opción de esta enumeración:
                Es decir, si te digo que la data que vas a generar es de tipo typeDataRamdom.NAMES ó 1 es porque el usuario quieres LISTA DE NOMBRES COMPLETOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.DATES ó 2 es porque el usuario quieres LISTA DE FECHAS,
                Si te digo que la data que vas a generar es de typeDataRamdom.COUNTRIES ó 3 es porque el usuario quieres LISTA DE PAÍSES,
                Si te digo que la data que vas a generar es de typeDataRamdom.CITYS ó 4 es porque el usuario quieres LISTA DE CIUDADES,
                Si te digo que la data que vas a generar es de typeDataRamdom.PHONE_NUMBERS ó 5 es porque el usuario quieres LISTA DE N��MEROS DE TELÉFONO,
                Si te digo que la data que vas a generar es de typeDataRamdom.EMAILS ó 6 es porque el usuario quieres LISTA DE CORREOS ELECTRÓNICOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.URLS ó 7 es porque el usuario quieres LISTA DE URLS,
                Si te digo que la data que vas a generar es de typeDataRamdom.ADDRESSES ó 8 es porque el usuario quieres LISTA DE DIRECCIONES,
                Si te digo que la data que vas a generar es de typeDataRamdom.NUMBERS ó 9 es porque el usuario quieres LISTA DE N��MEROS,
                Si te digo que la data que vas a generar es de typeDataRamdom.BOOLEANS ó 10 es porque el usuario quieres LISTA DE VALORES BOOLEANOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.PERCENTAGES ó 11 es porque el usuario quieres LISTA DE N��MEROS EN PORCENTAJE,
                Si te digo que la data que vas a generar es de typeDataRamdom.SENTENCES ó 12 es porque el usuario quieres LISTA DE ORACIONES,
                Si te digo que la data que vas a generar es de typeDataRamdom.WORDS ó 13 es porque el usuario quieres LISTA DE PALABRAS,
                Si te digo que la data que vas a generar es de typeDataRamdom.TEXTS ó 14 es porque el usuario quieres LISTA DE TEXTOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.UUIDS ó 15 es porque el usuario quieres LISTA DE UUIDS,
                Si te digo que la data que vas a generar es de typeDataRamdom.CREDIT_CARDS ó 16 es porque el usuario quieres LISTA DE TARJETAS DE CRÉDITO,
                Si te digo que la data que vas a generar es de typeDataRamdom.IP_ADDRESSES ó 17 es porque el usuario quieres LISTA DE DIRECCIONES IP,
                Si te digo que la data que vas a generar es de typeDataRamdom.GAMES ó 18 es porque el usuario quieres LISTA DE JUEGOS,
                Si te digo que la data que vas a generar es de typeDataRamdom.CURRENCIES es porque el usuario quieres LISTA DE MONEDAS así: {symbol, value}
                Si te digo que la data que vas a generar es de typeDataRamdom.TIMEZONES ó 19 es porque el usuario quieres LISTA DE ZONAS HORARIAS,

                por tanto la solicitud completa del usuario es la siguiente:

                - el tipo de data que vas a generar es ${data.type}
                - el número de elementos que vas a generar son ${data.count}

                solo generar la data que te pido SIN TEXTO ADICIONAL para que yo pueda utilizarla desde javascript y manipkuar esta data.
                `,
          },
          {
            role: "user",
            content: "Alice and Bob are going to a science fair on Friday.",
          },
        ],
      });

      this._dataResponse = this._completion.choices[0].message;
    }
  }

  private async generateRandomData(
    data: ResponseDataRandom
  ): Promise<Array<any>> {
    return await this.ConfigurationResponse(data);
  }

  public async names(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.NAMES,
      count: countElements,
    });

    return this;
  }

  public async dates(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.DATES,
      count: countElements,
    });

    return this;
  }

  public async countries(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.COUNTRIES,
      count: countElements,
    });

    return this;
  }

  public async cities(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.CITYS,
      count: countElements,
    });

    return this;
  }

  public async phone_numbers(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.PHONE_NUMBERS,
      count: countElements,
    });

    return this;
  }

  public async emails(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.EMAILS,
      count: countElements,
    });

    return this;
  }

  public async urls(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.URLS,
      count: countElements,
    });

    return this;
  }

  public async addresses(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.ADDRESSES,
      count: countElements,
    });

    return this;
  }

  public async numbers(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.NUMBERS,
      count: countElements,
    });

    return this;
  }

  public async values_booleans(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.BOOLEANS,
      count: countElements,
    });

    return this;
  }

  public async percentages(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.PERCENTAGES,
      count: countElements,
    });

    return this;
  }

  public async sentences(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.SENTENCES,
      count: countElements,
    });

    return this;
  }

  public async words(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.WORDS,
      count: countElements,
    });

    return this;
  }

  public async texts(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.TEXTS,
      count: countElements,
    });

    return this;
  }

  public async uuids(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.UUIDS,
      count: countElements,
    });

    return this;
  }

  public async credit_cards(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.CREDIT_CARDS,
      count: countElements,
    });

    return this;
  }

  public async ip_addresses(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.IP_ADDRESSES,
      count: countElements,
    });

    return this;
  }

  public async games(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.GAMES,
      count: countElements,
    });

    return this;
  }

  public async currencies(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.CURRENCIES,
      count: countElements,
    });

    return this;
  }

  public async timezones(countElements: number): Promise<this> {
    const names = await this.generateRandomData({
      type: typeDataRamdom.TIMEZONES,
      count: countElements,
    });

    return this;
  }

  public getAll(): any {
    if (this._dataResponse === undefined || this._dataResponse === null) {
      return null;
    }

    return this._dataResponse;
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
