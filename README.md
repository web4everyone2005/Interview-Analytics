# 🏗️ NextJS 16 — Layered Architecture Boilerplate

Boilerplate cho dự án **Next.js 16** với kiến trúc phân tầng rõ ràng, giúp cả team dễ phân công công việc, dễ đọc code, và dễ maintain lâu dài.

---

## 📦 Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios (1 file setup duy nhất) |
| Server State | SWR |

---

## 📁 Cấu trúc thư mục

```
src/
├── app/                          # Tầng App — layout & routing (Next.js App Router)
│   └── page.tsx
│
├── models/                       # Tầng Model — kiểu dữ liệu khớp với BE
│   ├── common.model.ts           # ApiResponse<T>, PaginatedResponse<T>, ...
│   └── user.model.ts             # User, CreateUserPayload, ...
│
├── services/                     # Tầng Service — gọi API
│   └── user.service.ts           # getUsers(), getUserById(), createUser(), ...
│
├── hooks/                        # Tầng Hooks — custom hook từ service + SWR
│   └── useUser.ts                # useUsers(), useUserById(), useCreateUser(), ...
│
├── components/                   # Tầng Components — UI, chỉ gọi hook
│   ├── ui/                       # Atomic components tái sử dụng (Button, Input, ...)
│   └── features/
│       └── users/
│           └── UserList.tsx
│
└── lib/
    └── axios.ts                  # ⭐ File Axios setup DUY NHẤT — KHÔNG import axios chỗ khác
```

---

## 🔄 Luồng dữ liệu

Dữ liệu chỉ đi **một chiều**, tầng trên KHÔNG được import tầng dưới ngược lại:

```
app  →  components  →  hooks  →  services  →  lib/axios.ts
                                     ↑
                                  models (được dùng ở mọi tầng)
```

> **Quy tắc vàng:** Component không biết axios tồn tại. Service không biết SWR tồn tại. Mỗi tầng chỉ biết tầng ngay dưới nó.

---

## 🧩 Chi tiết từng tầng

### ⭐ `src/lib/axios.ts` — File Axios duy nhất

File **quan trọng nhất** trong dự án. Tất cả cấu hình HTTP tập trung ở đây:

- Tạo `axiosInstance` với `baseURL` từ biến môi trường
- **Request Interceptor**: Tự động đọc `access_token` từ `localStorage` và gắn vào header `Authorization: Bearer <token>` cho **mọi request**
- **Response Interceptor**: Bắt lỗi `401 Unauthorized` → tự động gọi refresh token → retry request gốc → nếu thất bại thì redirect `/login`
- Export `tokenStorage` để lưu/xoá token

> ⚠️ **Không bao giờ** `import axios from 'axios'` trực tiếp ở nơi khác. Luôn dùng `import axiosInstance from '@/lib/axios'`.

---

### 📦 `src/models/` — Tầng Model

Định nghĩa **kiểu TypeScript** phản ánh đúng dữ liệu BE gửi về / FE gửi lên. Không chứa logic.

```ts
// Ví dụ: common.model.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

**Quy ước đặt tên file:** `<tên-feature>.model.ts`

---

### 🌐 `src/services/` — Tầng Service

Chứa các **hàm gọi API**. Mỗi hàm:
- Import `axiosInstance` từ `lib/axios`
- Nhận params/payload với kiểu từ `models/`
- Trả về `Promise<T>` với kiểu từ `models/`

```ts
// Ví dụ: user.service.ts
export const getUsers = async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
  const { data } = await axiosInstance.get('/users', { params });
  return data;
};
```

**Quy ước đặt tên file:** `<tên-feature>.service.ts`

---

### 🪝 `src/hooks/` — Tầng Hooks

Wrap tầng Service bằng **SWR** để có:
- ✅ Caching tự động
- ✅ Revalidation khi focus tab
- ✅ `isLoading` / `error` state
- ✅ `mutate` để invalidate cache

```ts
// Ví dụ: useUser.ts
export const useUsers = (params?: PaginationParams) => {
  const { data, error, isLoading, mutate } = useSWR(
    '/users',
    () => getUsers(params)
  );
  return { users: data?.data ?? [], pagination: data?.pagination, isLoading, error, mutate };
};
```

**Quy ước đặt tên file:** `use<TênFeature>.ts`

---

### 🎨 `src/components/` — Tầng Components

UI thuần túy. Component chỉ:
- Gọi hook từ tầng `hooks/`
- Render UI
- **Không biết gì về axios, URL endpoint hay service**

```ts
// Ví dụ: UserList.tsx
export const UserList = () => {
  const { users, isLoading, error } = useUsers({ page: 1, limit: 10 });
  // ... render
};
```

Chia thành 2 loại:
- `components/ui/` — Atomic, tái sử dụng mọi nơi (Button, Input, Modal, ...)
- `components/features/<feature>/` — Gắn với feature cụ thể

---

### 📄 `src/app/` — Tầng App

Pages của Next.js App Router. Nhiệm vụ duy nhất là **layout và gọi Components**. Không chứa business logic.

```ts
// page.tsx
export default function Home() {
  return <UserList />;
}
```

---

## 🚀 Hướng dẫn khởi chạy

### 1. Cài dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` ở thư mục gốc (đã có sẵn template):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

### 3. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

---

## ➕ Thêm feature mới (ví dụ: `Product`)

Khi cần thêm một feature mới, làm theo thứ tự **từ dưới lên**:

1. **Model** — Tạo `src/models/product.model.ts`
   ```ts
   export interface Product { id: string; name: string; price: number; }
   export interface CreateProductPayload { name: string; price: number; }
   ```

2. **Service** — Tạo `src/services/product.service.ts`
   ```ts
   export const getProducts = async () => { ... }
   ```

3. **Hook** — Tạo `src/hooks/useProduct.ts`
   ```ts
   export const useProducts = () => { ... }
   ```

4. **Component** — Tạo `src/components/features/products/ProductList.tsx`
   ```ts
   const { products } = useProducts();
   ```

5. **Page** — Tạo `src/app/products/page.tsx`
   ```ts
   export default function ProductsPage() { return <ProductList />; }
   ```

---

## 🔐 Xử lý Authentication

Token được quản lý hoàn toàn trong `src/lib/axios.ts` qua `tokenStorage`:

```ts
import { tokenStorage } from '@/lib/axios';

// Sau khi login thành công:
tokenStorage.setTokens(accessToken, refreshToken);

// Sau khi logout:
tokenStorage.clearTokens();
```

> Refresh token tự động khi nhận `401`. Endpoint mặc định là `POST /auth/refresh` — **đổi lại cho khớp với BE** trong `src/lib/axios.ts`.

---

## 📋 Scripts

```bash
npm run dev      # Chạy dev server (http://localhost:3000)
npm run build    # Build production
npm run lint     # Kiểm tra ESLint
npx tsc --noEmit # Kiểm tra TypeScript
```
