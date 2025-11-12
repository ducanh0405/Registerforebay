# Hướng dẫn Setup Supabase Database

## Bước 1: Tạo Database Schema

1. Đăng nhập vào Supabase Dashboard:
   - Vào: https://supabase.com/dashboard/project/wzgqvnuodmupsrlqjtyh

2. Mở SQL Editor:
   - Click vào **SQL Editor** ở sidebar bên trái
   - Click **New query**

3. Chạy SQL Schema:
   - Copy toàn bộ nội dung từ file `supabase/schema.sql`
   - Paste vào SQL Editor
   - Click **Run** hoặc nhấn `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. Kiểm tra kết quả:
   - Bạn sẽ thấy thông báo "Success. No rows returned"
   - Vào **Table Editor** để xem 2 bảng mới:
     - `shift_registrations`
     - `tasks`

## Bước 2: Kiểm tra Tables

1. Vào **Table Editor**:
   - Click vào **Table Editor** ở sidebar
   - Bạn sẽ thấy 2 tables:
     - `shift_registrations` - Lưu đăng ký ca làm việc
     - `tasks` - Lưu danh sách công việc

2. Kiểm tra cấu trúc:
   - Click vào từng table để xem columns
   - Đảm bảo có đầy đủ các columns như trong schema

## Bước 3: Kiểm tra Row Level Security (RLS)

1. Vào **Authentication** → **Policies**:
   - Kiểm tra RLS đã được enable
   - Hiện tại đang dùng policy "Allow all operations" (cho phép tất cả)
   - Bạn có thể tùy chỉnh policies sau nếu cần authentication

## Bước 4: Test Database

1. Test Insert:
   ```sql
   -- Test insert shift registration
   INSERT INTO shift_registrations (date, shift, user_name)
   VALUES ('2025-11-17', 'Morning', 'Test User');
   
   -- Test insert task
   INSERT INTO tasks (name, assigned_to, status, deadline)
   VALUES ('Test Task', 'Test User', 'not started', '2025-12-01');
   ```

2. Test Select:
   ```sql
   -- Xem shift registrations
   SELECT * FROM shift_registrations;
   
   -- Xem tasks
   SELECT * FROM tasks;
   ```

3. Xóa test data:
   ```sql
   DELETE FROM shift_registrations WHERE user_name = 'Test User';
   DELETE FROM tasks WHERE name = 'Test Task';
   ```

## Bước 5: Kiểm tra Real-time

1. Vào **Database** → **Replication**:
   - Đảm bảo real-time đã được enable cho cả 2 tables
   - Nếu chưa, click vào toggle để enable

## Cấu trúc Database

### Table: `shift_registrations`
- `id` (UUID, Primary Key)
- `date` (DATE) - Ngày đăng ký
- `shift` (TEXT) - Loại ca: 'Morning' hoặc 'Afternoon'
- `user_name` (TEXT) - Tên người đăng ký
- `created_at` (TIMESTAMPTZ) - Thời gian tạo
- `updated_at` (TIMESTAMPTZ) - Thời gian cập nhật
- Unique constraint: (date, shift, user_name) - Mỗi user chỉ đăng ký 1 lần cho 1 ca

### Table: `tasks`
- `id` (UUID, Primary Key)
- `name` (TEXT) - Tên công việc
- `assigned_to` (TEXT, nullable) - Người được giao
- `status` (TEXT) - Trạng thái: 'not started', 'in progress', 'completed'
- `deadline` (DATE) - Hạn chót
- `created_at` (TIMESTAMPTZ) - Thời gian tạo
- `updated_at` (TIMESTAMPTZ) - Thời gian cập nhật

## Troubleshooting

### Lỗi: "relation does not exist"
- Đảm bảo đã chạy schema.sql thành công
- Kiểm tra lại trong Table Editor xem tables đã được tạo chưa

### Lỗi: "permission denied"
- Kiểm tra RLS policies
- Đảm bảo policy "Allow all operations" đã được tạo

### Real-time không hoạt động
- Vào Database → Replication
- Enable real-time cho cả 2 tables
- Refresh lại trang app

### Lỗi khi chạy app: "Failed to load data"
- Kiểm tra environment variables trong `.env`
- Kiểm tra Supabase URL và Anon Key
- Kiểm tra network connection
- Xem console log để biết lỗi chi tiết

## Next Steps

Sau khi setup xong:
1. Chạy `npm run dev` để test app
2. Thử đăng ký shift và tạo task
3. Mở 2 tab browser để test real-time updates
4. Kiểm tra data trong Supabase Table Editor

## Customization

Nếu bạn muốn thêm authentication:
1. Vào **Authentication** → **Settings**
2. Enable authentication providers
3. Cập nhật RLS policies để chỉ cho phép authenticated users
4. Cập nhật code để handle authentication

