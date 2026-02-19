# Global Cinema Platform

Zamonaviy dark-theme web platforma: global kino va seriallarni qidirish, trending kontentlarni ko'rish, IMDb/user ratinglarni solishtirish, favorites va search history yuritish.

Tech stack:
- Frontend: React + Next.js (App Router) + Tailwind CSS + Framer Motion
- Backend: Next.js API Routes (REST)
- DB: Prisma (default local SQLite), PostgreSQL ga osongina o'tkaziladi
- Auth: JWT
- External APIs: TMDb + OMDb

## Features
- Live search (`Avatar`, `Marvel`, `DC`, `Netflix` va boshqalar)
- Film/serial card:
  - Poster
  - Nomi
  - Yili
  - Janr
  - Platformasi (Netflix, Disney+, HBO...)
  - IMDb rating
  - User rating (community average)
- Har bir title uchun alohida detail page
- JWT auth (register/login)
- O'z ratingini berish (1-10)
- Favorites
- Search history
- Rating bo'yicha saralash (`IMDb` yoki `User rating`)
- Trending page
- Responsive UI (mobile + desktop)
- Loading skeleton va modal oynalar

## Project structure
```text
app/
  api/
    auth/
      login/route.ts
      me/route.ts
      register/route.ts
    favorites/route.ts
    history/route.ts
    movies/
      [mediaType]/[id]/route.ts
      search/route.ts
      trending/route.ts
    ratings/
      [movieId]/route.ts
      route.ts
  favorites/page.tsx
  history/page.tsx
  title/[mediaType]/[id]/page.tsx
  trending/page.tsx
  globals.css
  layout.tsx
  page.tsx

components/
  auth-modal.tsx
  favorites-client.tsx
  history-client.tsx
  home-client.tsx
  movie-card.tsx
  movie-grid.tsx
  rating-modal.tsx
  search-toolbar.tsx
  site-header.tsx
  skeleton-grid.tsx
  title-detail-client.tsx

contexts/
  auth-context.tsx

lib/
  auth.ts
  client-api.ts
  movie-service.ts
  omdb.ts
  prisma.ts
  request-auth.ts
  tmdb.ts
  types.ts

prisma/
  schema.prisma

.env.example
package.json
tailwind.config.ts
```

## Dependencies
Asosiy kutubxonalar:
- `next`, `react`, `react-dom`
- `tailwindcss`, `postcss`, `autoprefixer`
- `prisma`, `@prisma/client`
- `bcryptjs`, `jsonwebtoken`, `zod`
- `framer-motion`, `lucide-react`, `clsx`
- `typescript` va `@types/*`

## Environment variables
`.env` fayl yarating:

```env
DATABASE_URL="file:./dev.db"
TMDB_API_KEY="your_tmdb_api_key"
OMDB_API_KEY="your_omdb_api_key"
JWT_SECRET="replace_with_strong_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Run locally
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## REST API (short)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/movies/search?q=avatar&sort=imdb`
- `GET /api/movies/trending?sort=userRating`
- `GET /api/movies/{mediaType}/{id}`
- `POST /api/ratings`
- `GET /api/ratings/{movieId}?mediaType=movie`
- `GET/POST/DELETE /api/favorites`
- `GET /api/history`

## API integration notes
- `lib/tmdb.ts`:
  - Search: `/search/multi`
  - Trending: `/trending/all/week`
  - Detail: `/{mediaType}/{id}`
  - Providers: `/{mediaType}/{id}/watch/providers`
  - External IDs: `/{mediaType}/{id}/external_ids`
- `lib/omdb.ts`:
  - IMDb bo'yicha qo'shimcha rating/runtime: `https://www.omdbapi.com/?i={imdbId}`
- `lib/movie-service.ts`:
  - TMDb + OMDb ma'lumotlarini birlashtiradi
  - DB'dagi user rating average bilan enrich qiladi
  - `IMDb` yoki `User rating` bo'yicha sort qiladi

## Deployment
### Frontend (Vercel)
1. Repo'ni Vercel'ga ulang.
2. Environment variables qo'shing (`TMDB_API_KEY`, `OMDB_API_KEY`, `JWT_SECRET`, `DATABASE_URL`).
3. Build command: `next build`.

### Backend/DB (Railway yoki Render)
1. PostgreSQL instance yarating.
2. `DATABASE_URL` ni Vercel'da ham bir xil qiymat bilan qo'ying.
3. Deploydan keyin migration ishga tushiring:
   - `npx prisma migrate deploy`

## Important
- `TMDB_API_KEY` va `OMDB_API_KEY` bo'lmasa movie endpointlar ishlamaydi.
- Production'da kuchli `JWT_SECRET` ishlating.
