# Hướng dẫn Deploy

## Chuẩn bị

### 1. Cài đặt Supabase CLI (Windows)

Supabase CLI không thể cài global qua npm. Sử dụng một trong các cách sau:

**Cách 1: Dùng npx (Khuyến nghị)**
```powershell
# Không cần cài, chỉ cần dùng npx
npx supabase --version
```

**Cách 2: Cài qua Scoop (Nếu đã có Scoop)**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Cách 3: Download binary trực tiếp**
- Tải từ: https://github.com/supabase/cli/releases
- Giải nén và thêm vào PATH

### 2. Cấu hình Environment Variables

File `.env` đã được tạo với cấu hình Supabase. Nếu chưa có, tạo file `.env`:

```env
VITE_SUPABASE_URL=https://wzgqvnuodmupsrlqjtyh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z3F2bnVvZG11cHNybHFqdHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Nzk3NTMsImV4cCI6MjA3ODQ1NTc1M30.OFYSP11oYjVOt2NfYYtFLxwWkju1F_bDeXR1x4Q6EeQ
```

## Deploy Frontend

### Option 1: Vercel (Khuyến nghị - Dễ nhất)

1. **Cài Vercel CLI:**
```powershell
npm install -g vercel
```

2. **Login và Deploy:**
```powershell
vercel login
vercel
```

3. **Hoặc deploy qua GitHub:**
   - Push code lên GitHub
   - Vào https://vercel.com
   - Import project từ GitHub
   - Vercel tự động detect Vite và deploy

### Option 2: Netlify

1. **Cài Netlify CLI:**
```powershell
npm install -g netlify-cli
```

2. **Build và Deploy:**
```powershell
npm run build
netlify deploy --prod --dir=build
```

3. **Hoặc qua GitHub:**
   - Push code lên GitHub
   - Vào https://app.netlify.com
   - New site from Git
   - Build command: `npm run build`
   - Publish directory: `build`

### Option 3: GitHub Pages

1. **Cài gh-pages:**
```powershell
npm install --save-dev gh-pages
```

2. **Thêm script vào package.json:**
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d build"
}
```

3. **Deploy:**
```powershell
npm run deploy
```

## Deploy Supabase Edge Function (KHÔNG CẦN DOCKER)

### Cách 1: Deploy trực tiếp qua CLI (Khuyến nghị)

```powershell
# 1. Login Supabase
npx supabase login

# 2. Deploy function trực tiếp (KHÔNG CẦN Docker, KHÔNG CẦN link)
npx supabase functions deploy make-server-af026be6 --project-ref wzgqvnuodmupsrlqjtyh
```

**Lưu ý:** Không cần `supabase link` và không cần Docker khi dùng `--project-ref`

### Cách 2: Deploy qua Supabase Dashboard

1. Vào https://supabase.com/dashboard/project/wzgqvnuodmupsrlqjtyh
2. Edge Functions → Create function
3. Copy code từ `supabase/functions/make-server-af026be6/index.ts`
4. Deploy

**Xem chi tiết:** [DEPLOY_NO_DOCKER.md](./DEPLOY_NO_DOCKER.md)

### 3. Set Environment Variables cho Function

Vào Supabase Dashboard:
- Settings → Edge Functions → Environment Variables
- Thêm:
  - `SUPABASE_URL`: `https://wzgqvnuodmupsrlqjtyh.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY`: (Lấy từ Settings → API → service_role key)

## Kiểm tra sau khi Deploy

1. **Frontend:**
   - Mở URL đã deploy
   - Kiểm tra console không có lỗi
   - Test đăng ký shift và tạo task

2. **Edge Function:**
   - Test health endpoint: `https://wzgqvnuodmupsrlqjtyh.supabase.co/functions/v1/make-server-af026be6/health`
   - Phải trả về: `{"status":"ok"}`

## Troubleshooting

### Lỗi Supabase CLI
- **Không cài được global:** Dùng `npx supabase` thay vì cài global
- **Permission denied:** Chạy PowerShell as Administrator

### Lỗi Build
- **Missing env vars:** Đảm bảo file `.env` có đầy đủ biến
- **Import errors:** Chạy `npm install` lại

### Lỗi Deploy
- **Build fails:** Kiểm tra `npm run build` chạy thành công local
- **404 errors:** Kiểm tra base path trong `vite.config.ts`

## Production Checklist

- [ ] File `.env` có đầy đủ biến môi trường
- [ ] `npm run build` chạy thành công
- [ ] Test local với `npm run preview`
- [ ] Supabase Edge Function đã deploy
- [ ] Environment variables cho function đã set
- [ ] Frontend đã deploy và hoạt động
- [ ] Test tất cả tính năng trên production

