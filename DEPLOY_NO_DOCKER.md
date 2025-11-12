# Deploy Supabase Function KHÔNG CẦN DOCKER

## ✅ Cách 1: Deploy trực tiếp qua CLI (Khuyến nghị)

Supabase CLI có thể deploy function lên cloud mà **KHÔNG CẦN Docker** khi bạn dùng flag `--project-ref`:

```powershell
# 1. Login Supabase
npm run supabase -- login

# 2. Deploy function trực tiếp lên cloud (KHÔNG CẦN Docker)
npm run supabase -- functions deploy make-server-af026be6 --project-ref wzgqvnuodmupsrlqjtyh --no-verify-jwt
```

**✅ Đã test thành công!** Function đã được deploy và hoạt động.

**Lưu ý:** 
- Không cần `supabase link` (chỉ cần `--project-ref`)
- Không cần Docker
- Deploy trực tiếp lên Supabase cloud

## ✅ Cách 2: Deploy qua Supabase Dashboard (Dễ nhất)

1. **Vào Supabase Dashboard:**
   - https://supabase.com/dashboard/project/wzgqvnuodmupsrlqjtyh
   - Vào **Edge Functions** trong menu bên trái

2. **Tạo function mới:**
   - Click **Create a new function**
   - Tên function: `make-server-af026be6`
   - Copy nội dung từ `supabase/functions/make-server-af026be6/index.ts`
   - Paste vào editor
   - Click **Deploy**

3. **Upload các file cần thiết:**
   - Upload `kv_store.ts` và `deno.d.ts` vào cùng folder function

## ✅ Cách 3: Dùng Supabase CLI với remote deploy

```powershell
# 1. Login
npm run supabase -- login

# 2. Deploy với remote flag (bỏ qua local Docker)
npm run supabase -- functions deploy make-server-af026be6 --project-ref wzgqvnuodmupsrlqjtyh --no-verify-jwt
```

## 🔧 Set Environment Variables

Sau khi deploy, cần set environment variables trong Supabase Dashboard:

1. Vào **Settings** → **Edge Functions**
2. Tìm function `make-server-af026be6`
3. Thêm environment variables:
   - `SUPABASE_URL`: `https://wzgqvnuodmupsrlqjtyh.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: (Lấy từ Settings → API → service_role key)

## ✅ Test Function

Sau khi deploy, test endpoint:

```powershell
# Test health endpoint
curl https://wzgqvnuodmupsrlqjtyh.supabase.co/functions/v1/make-server-af026be6/health
```

Phải trả về: `{"status":"ok"}`

## 🐛 Troubleshooting

### Lỗi: "Docker is not running"
→ Dùng cách 1 hoặc 2 ở trên (không cần Docker)

### Lỗi: "Function not found"
→ Kiểm tra tên function đúng: `make-server-af026be6`

### Lỗi: "Permission denied"
→ Đảm bảo đã login: `npm run supabase -- login`

### Lỗi: "Environment variables not set"
→ Set environment variables trong Supabase Dashboard

## 📝 Cấu trúc thư mục

Function đã được tạo ở:
```
supabase/
  functions/
    make-server-af026be6/
      index.ts          # Main function file
      kv_store.ts       # KV store utilities
      deno.d.ts         # Type definitions
```

## 🚀 Quick Deploy Command

```powershell
# All-in-one command
npm run supabase -- login && npm run supabase -- functions deploy make-server-af026be6 --project-ref wzgqvnuodmupsrlqjtyh
```

