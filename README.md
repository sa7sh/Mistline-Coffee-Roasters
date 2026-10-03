# Mistline Coffee Roasters

Single-origin Indian coffee from Chikmagalur, Coorg, and Araku. Shoppers can browse bags. An admin can sign in and manage them.

Tagline: Grown in the mist. Roasted in small lots.

## Live

| | |
| --- | --- |
| Site | https://mistline-coffee-roasters.vercel.app |
| API | https://mistline-coffee-roasters.onrender.com |
| GitHub | https://github.com/sa7sh/Mistline-Coffee-Roasters |
| Admin email | `admin@mistline.coffee` |

Sign in at https://mistline-coffee-roasters.vercel.app/admin/login. The password is in the submission email.

## Pages

| Address | What it shows |
| --- | --- |
| `/` | Landing page |
| `/products` | Catalog |
| `/products/:id` | One coffee. A bad id shows “Coffee not found.” |
| `/bag` | Selected coffees. Nothing is charged |
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard. Redirects to login when signed out |
| Any other address | Page not found |

Shoppers can collect coffees in a bag saved in the browser. There is no checkout, payment, or customer account.

## Run it locally

Open this project folder in two terminals.

API, in the first terminal:

```powershell
cd .\server
npm install
node .\src\index.js
```

Site, in the second terminal:

```powershell
cd .\client
npm install
npm run dev
```

Open `http://localhost:5173`. The API listens on `http://localhost:5000`.

## Environment

Copy the examples and fill in the real values. Do not commit `.env` files.

```powershell
copy .\server\.env.example .\server\.env
copy .\client\.env.example .\client\.env
```

Server settings:

| Name | Purpose |
| --- | --- |
| `PORT` | API port. Local default is `5000` |
| `MONGO_URI` | MongoDB connection string. Database name `mistline` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name, used when seeding image URLs |
| `JWT_SECRET` | Secret used to sign the admin token |
| `ADMIN_EMAIL` | `admin@mistline.coffee` |
| `ADMIN_PASSWORD` | bcrypt hash of the admin password, not the plain password. See Admin sign-in below |
| `CLIENT_ORIGIN` | Site address allowed by CORS. Local default is `http://localhost:5173` |

Client setting:

| Name | Purpose |
| --- | --- |
| `VITE_API_URL` | API address. Local value is `http://localhost:5000` |

Restart the API after changing `server/.env`. Restart Vite after changing `client/.env`.

## Seed

In the `server` folder, with `server/.env` filled in:

```powershell
cd .\server
node .\src\seed.js
```

This replaces every coffee with the eight Mistline bags. Run it on an empty database. Running it again deletes coffees you added in the dashboard.

## Admin sign-in

Email: `admin@mistline.coffee`

`ADMIN_PASSWORD` in `server/.env` is a bcrypt hash. The login form takes the plain password that was hashed. From the `server` folder:

```powershell
node -e "require('bcryptjs').hash('your-password', 10).then(console.log)"
```

Paste the printed hash into `ADMIN_PASSWORD`. The hash stays in `server/.env`. The browser stores only the JWT, under the key `token`, for 8 hours.

## API

Errors use `{ "error": "message" }`.

| Method | Path | Auth | Success |
| --- | --- | --- | --- |
| GET | `/api/health` | No | `200` `{ "ok": true }` |
| GET | `/api/products` | No | `200` coffee array, names A–Z |
| GET | `/api/products/:id` | No | `200` one coffee, or `404` |
| POST | `/api/products` | Admin | `201` created coffee |
| PUT | `/api/products/:id` | Admin | `200` updated coffee. Send the full coffee, not one field |
| DELETE | `/api/products/:id` | Admin | `200` `{ "message": "Coffee deleted" }` |
| POST | `/api/auth/login` | No | `200` `{ "token": "..." }`, or `401` |
| GET | `/api/auth/me` | Admin | `200` `{ "email": "admin@mistline.coffee" }` |

Admin routes expect `Authorization: Bearer <token>`.

A coffee has `name`, `origin` (`Chikmagalur`, `Coorg`, or `Araku`), `roast` (`Light`, `Medium`, or `Dark`), `tastingNotes`, `weight` (whole grams, at least 1), `price` (whole rupees, at least 1), `stock` (whole number, 0 allowed), and `image` (an `https://` URL).
