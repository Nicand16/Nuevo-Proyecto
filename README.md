# Conversor COP → USD (App didáctica Full-Stack)

Proyecto simple para aprender cómo una app web consume una API externa **sin exponer la API key en el navegador**.

## ¿Qué hace cada parte?

### Frontend (`/frontend`)
- Muestra una interfaz sencilla.
- Pide una cantidad en COP.
- Llama al endpoint del backend: `GET /api/convert`.
- Muestra el resultado (COP, tasa, USD y hora de la tasa).

### Backend (`/backend`)
- Expone `GET /api/convert?amount=100000&from=COP&to=USD`.
- Valida parámetros.
- Lee la API key desde `.env`.
- Llama a la API externa (ExchangeRate-API) con `fetch`.
- Calcula la conversión y devuelve JSON.

## ¿Por qué el frontend NO llama directo a la API externa?

Porque así la API key queda protegida en el servidor. Si se pone en el frontend, cualquier usuario podría verla en el navegador.

---

## 1) Requisitos previos
- Node.js 18 o superior
- npm

## 2) Configurar backend

```bash
cd backend
npm install
cp .env.example .env
```

Ahora abre `backend/.env` y reemplaza:

```env
EXCHANGE_API_KEY=TU_API_KEY_AQUI
```

Puedes obtener una API key gratis en: https://www.exchangerate-api.com/

Inicia el backend:

```bash
npm run dev
```

Backend esperado en: `http://localhost:3000`

## 3) Configurar frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Frontend esperado en: `http://localhost:5500`

## 4) ¿Cómo probar la app?

1. Abre `http://localhost:5500`
2. Escribe un valor en COP (ej: `100000`)
3. Haz click en **Convertir**
4. Verás:
   - COP ingresado
   - tasa usada
   - resultado en USD
   - fecha/hora de la tasa (si la API la devuelve)

## 5) Flujo completo de la request

1. Usuario hace click en **Convertir** (frontend).
2. Frontend llama a `http://localhost:3000/api/convert?...`.
3. Backend valida datos y toma la API key del `.env`.
4. Backend llama a la API externa de divisas.
5. API externa responde con la tasa.
6. Backend calcula el resultado y devuelve JSON al frontend.
7. Frontend pinta el resultado en pantalla.

---

## Endpoint del backend

`GET /api/convert?amount=100000&from=COP&to=USD`

Ejemplo de respuesta:

```json
{
  "from": "COP",
  "to": "USD",
  "input": 100000,
  "rate": 0.00025,
  "result": 25,
  "rateTimestamp": "Tue, 23 Apr 2026 00:00:01 +0000",
  "provider": "ExchangeRate-API"
}
```

## Errores contemplados

- Cantidad inválida (`amount` faltante o no numérica)
- Parámetros inválidos (`from`/`to` mal formados)
- API key faltante
- Falla del proveedor externo
- Falla de conexión con backend
