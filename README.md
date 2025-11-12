# Shift Registration Interface Design

This is a code bundle for Shift Registration Interface Design. The original project is available at https://www.figma.com/design/RwG0gw00kZJNLvPe3euk0c/Shift-Registration-Interface-Design.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase Database:**
   - Xem file [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) để biết cách setup database
   - Chạy SQL schema từ `supabase/schema.sql` trong Supabase SQL Editor
   - Đảm bảo real-time đã được enable cho cả 2 tables

3. **Set up environment variables:**
   - File `.env` đã được tạo với Supabase credentials
   - Nếu chưa có, tạo file `.env` với:
     ```
     VITE_SUPABASE_URL=https://wzgqvnuodmupsrlqjtyh.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key_here
     ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
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

- `src/App.tsx` - Main application component với Supabase integration
- `src/components/` - React components
- `src/services/` - Supabase service functions (shiftRegistrations.ts, tasks.ts)
- `src/utils/supabase/` - Supabase client configuration
- `supabase/schema.sql` - Database schema cho Supabase
- `supabase/functions/` - Supabase Edge Functions
- `dist/` - Production build output (generated)

## Environment Variables

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Features

- ✅ **Real-time Updates**: Tự động cập nhật khi có thay đổi từ người dùng khác
- ✅ **Shift Registration**: Đăng ký/hủy đăng ký ca làm việc (tối đa 2 người/ca)
- ✅ **Task Management**: Quản lý công việc với status tracking và deadline
- ✅ **Supabase Integration**: Sử dụng Supabase cho database và real-time

## Database Setup

Xem file [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) để biết chi tiết cách setup database schema.

## Troubleshooting

- **Lỗi "Failed to load data"**: Kiểm tra database đã được setup chưa (xem SUPABASE_SETUP.md)
- **Real-time không hoạt động**: Enable real-time trong Supabase Dashboard → Database → Replication
- **Lỗi permission**: Kiểm tra RLS policies trong Supabase