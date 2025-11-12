# Shift Registration Interface Design

This is a code bundle for Shift Registration Interface Design. The original project is available at https://www.figma.com/design/RwG0gw00kZJNLvPe3euk0c/Shift-Registration-Interface-Design.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (đã có sẵn)
   - File `.env` đã được cấu hình với Supabase credentials

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Deploy

Xem file [DEPLOY.md](./DEPLOY.md) để biết hướng dẫn chi tiết về cách deploy lên Vercel, Netlify, hoặc GitHub Pages.

## Supabase CLI

Sử dụng Supabase CLI qua npx (không cần cài global):
```bash
npm run supabase -- --version
npm run supabase -- login
npm run supabase -- functions deploy make-server-af026be6
```

## Project Structure

- `src/App.tsx` - Main application component
- `src/components/` - React components
- `src/utils/supabase/` - Supabase client configuration
- `src/supabase/functions/` - Supabase Edge Functions
- `build/` - Production build output (generated)

## Environment Variables

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

Xem `.env.example` để biết format.