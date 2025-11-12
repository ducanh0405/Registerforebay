# Hướng dẫn Deploy Nhanh

## 🚀 Deploy Frontend (Chọn 1 trong 3 cách)

### Cách 1: Vercel (Khuyến nghị - 2 phút)

```powershell
# 1. Cài Vercel CLI
npm install -g vercel

# 2. Login và deploy
vercel login
vercel

# Hoặc push lên GitHub và import vào vercel.com
```

### Cách 2: Netlify (3 phút)

```powershell
# 1. Cài Netlify CLI
npm install -g netlify-cli

# 2. Build và deploy
npm run build
netlify deploy --prod --dir=build

# Hoặc push lên GitHub và import vào app.netlify.com
```

### Cách 3: GitHub Pages (5 phút)

```powershell
# 1. Cài gh-pages
npm install --save-dev gh-pages

# 2. Thêm vào package.json scripts:
# "deploy": "npm run build && gh-pages -d build"

# 3. Deploy
npm run deploy
```

## 🔧 Deploy Supabase Edge Function (KHÔNG CẦN DOCKER)

**Cách 1: Deploy trực tiếp (Khuyến nghị)**
```powershell
# 1. Login Supabase
npm run supabase -- login

# 2. Deploy function trực tiếp (KHÔNG CẦN Docker)
npm run supabase -- functions deploy make-server-af026be6 --project-ref wzgqvnuodmupsrlqjtyh --no-verify-jwt
```

**Cách 2: Deploy qua Dashboard (Dễ nhất)**
- Vào https://supabase.com/dashboard/project/wzgqvnuodmupsrlqjtyh
- Edge Functions → Create function → Copy code từ `supabase/functions/make-server-af026be6/`

**Xem chi tiết:** [DEPLOY_NO_DOCKER.md](./DEPLOY_NO_DOCKER.md)

**Lưu ý:** Cần set environment variables trong Supabase Dashboard:
- Settings → Edge Functions → Environment Variables
- `SUPABASE_URL`: `https://wzgqvnuodmupsrlqjtyh.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: (Lấy từ Settings → API)

## ✅ Checklist

- [ ] Build thành công: `npm run build`
- [ ] Test local: `npm run preview`
- [ ] Deploy frontend (Vercel/Netlify/GitHub Pages)
- [ ] Deploy Supabase function
- [ ] Set environment variables cho function
- [ ] Test production URL

## 🐛 Troubleshooting

**Supabase CLI không cài được?**
→ Dùng `npm run supabase` (đã cấu hình sẵn)

**Build fails?**
→ Kiểm tra `.env` file có đầy đủ biến

**404 errors sau khi deploy?**
→ Kiểm tra file `vercel.json` hoặc `netlify.toml` đã có

