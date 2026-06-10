# Interview Analytics BE - API cho Frontend

Nguon doc nay duoc tong hop tu `src/index.ts`, `src/routes/*`, `src/controllers/*`, `src/models/*` va `src/config/socket.ts`.

## Base

- Local REST base URL: `http://localhost:5000`
- Production base URL trong Swagger: `https://interview-analytics-be.onrender.com`
- API prefix: `/api/v1`
- Swagger UI: `GET /api-docs`
- Static upload files: `GET /uploads/...`

## Auth Chung

- Cac API co auth dung header:

```http
Authorization: Bearer <accessToken>
```

- `refreshToken` duoc set vao HTTP-only cookie ten `refreshToken`.
- FE nen goi request voi credentials khi dung refresh cookie:

```ts
fetch(url, { credentials: "include" })
```

- Loi auth/RBAC thuong gap:

```json
{ "message": "Truy cap bi tu choi: Khong co token" }
```

```json
{ "message": "Token khong hop le hoac da het han" }
```

```json
{ "message": "Hanh dong bi tu choi. Quyen hien tai: <ROLE>" }
```

## Model Shapes Chinh

Mot so model tra `id`, mot so tra `_id`, vi code chi set `toJSON` transform cho mot phan model.

### User

```ts
type User = {
  id: string;
  name: string;
  email: string;
  role_id?: string | { _id: string; name: string };
  role?: "ADMIN" | "HR" | "CANDIDATE";
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### JobPosition

```ts
type JobPosition = {
  _id: string;
  title: string;
  department: string;
  required_skills: Array<string | { _id: string; name: string }>;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
```

### CandidateProfile

```ts
type CandidateProfile = {
  _id: string;
  owner_id: string | { _id: string; name: string; email: string };
  full_name: string;
  email: string;
  resume_url?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
```

### Skill / Category

```ts
type Skill = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

type QuestionCategory = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
```

### QuestionBank

```ts
type QuestionBank = {
  id: string;
  category_id: string | { _id: string; name: string };
  assessed_skills: Array<string | { _id: string; name: string }>;
  content: string;
  expected_answer: string;
  embedding: number[];
  createdAt: string;
  updatedAt: string;
};
```

### InterviewSession

```ts
type InterviewSession = {
  id: string;
  conductor_id: string | { _id: string; name: string; email: string };
  job_position_id: string | { _id: string; title: string };
  candidate_profile_id: string | { _id: string; full_name: string; email: string };
  room_code: string;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  scheduled_at?: string;
  createdAt: string;
  updatedAt: string;
};
```

### SessionQuestion

```ts
type SessionQuestion = {
  id: string;
  session_id: string;
  question_bank_id?: string | QuestionBank;
  content: string;
  expected_answer: string;
  order_index: number;
  is_ad_hoc: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### Recording

```ts
type Recording = {
  id: string;
  session_id: string;
  question_id: string;
  user_role: "HR" | "CANDIDATE";
  file_url: string;
  file_name: string;
  transcript: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  duration: number;
  timestamp_metadata: {
    started_at?: string;
    ended_at?: string;
  };
  createdAt: string;
  updatedAt: string;
};
```

Note: controller co set `audio_url`, nhung `RecordingSchema` hien tai khong khai bao field nay. FE nen dung `file_url` de play audio.

### Evaluation

```ts
type EvaluationResult = {
  id: string;
  session_id: string;
  question_id: string;
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  evaluated_by: string;
  version: number;
  createdAt: string;
  updatedAt: string;
};
```

## REST APIs

### 0. Health

### GET `/health`

- Auth: khong can.
- Cong dung: check server song.
- Request: none.
- Response `200`:

```json
{
  "status": "OK",
  "timestamp": "2026-06-10T00:00:00.000Z"
}
```

---

## 1. Auth

### POST `/api/v1/auth/register`

- Auth: khong can.
- Cong dung: dang ky user moi.
- Request JSON:

```json
{
  "name": "HR User",
  "email": "hr@example.com",
  "password": "123456",
  "roleName": "HR"
}
```

- `roleName` optional, default `CANDIDATE`.
- Response `201`, dong thoi set cookie `refreshToken`:

```json
{
  "data": {
    "user": {
      "id": "userId",
      "name": "HR User",
      "email": "hr@example.com",
      "role": "HR"
    },
    "accessToken": "jwt-access-token"
  }
}
```

- Loi: `400` thieu field/role khong hop le, `409` email da ton tai, `500`.

### POST `/api/v1/auth/login`

- Auth: khong can.
- Cong dung: dang nhap.
- Request JSON:

```json
{
  "email": "hr@example.com",
  "password": "123456"
}
```

- Response `200`, dong thoi set cookie `refreshToken`:

```json
{
  "data": {
    "user": {
      "id": "userId",
      "name": "HR User",
      "email": "hr@example.com",
      "role": "HR",
      "avatarUrl": null
    },
    "accessToken": "jwt-access-token"
  }
}
```

- Loi: `400`, `401`, `500`.

### POST `/api/v1/auth/refresh`

- Auth: khong can bearer, can cookie `refreshToken`.
- Cong dung: cap access token moi.
- Request: no body.
- Response `200`, dong thoi rotate cookie `refreshToken`:

```json
{
  "data": {
    "accessToken": "new-jwt-access-token"
  }
}
```

- Loi: `401`.

### POST `/api/v1/auth/logout`

- Auth: Bearer token.
- Cong dung: logout, xoa refresh token trong DB va clear cookie.
- Request: no body.
- Response `200`:

```json
{
  "message": "Logged out successfully"
}
```

- Loi: `401`, `500`.

### GET `/api/v1/auth/me`

- Auth: Bearer token.
- Cong dung: lay user dang dang nhap.
- Request: none.
- Response `200`:

```json
{
  "data": {
    "id": "userId",
    "name": "HR User",
    "email": "hr@example.com",
    "role": "HR",
    "avatarUrl": null,
    "isActive": true
  }
}
```

- Loi: `401`, `404`, `500`.

---

## 2. Users

### GET `/api/v1/users`

- Auth: Bearer token.
- Role: `HR`.
- Cong dung: lay danh sach user co phan trang.
- Query:

```ts
{
  page?: number;  // default 1
  limit?: number; // default 10
}
```

- Response `200`:

```json
{
  "data": [
    {
      "id": "userId",
      "name": "User",
      "email": "user@example.com",
      "role_id": "roleId",
      "avatarUrl": null,
      "isActive": true,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

- Loi: `401`, `403`, `500`.

### DELETE `/api/v1/users/:id`

- Auth: Bearer token.
- Role: `HR`.
- Cong dung: xoa user theo id.
- Params: `id`.
- Response `200`:

```json
{
  "data": null,
  "message": "User deleted successfully"
}
```

- Loi: `401`, `403`, `404`, `500`.

---

## 3. Job Positions

Tat ca API group nay can Bearer token va role `HR` hoac `ADMIN`.

### GET `/api/v1/job-positions`

- Cong dung: lay danh sach job position dang active.
- Response `200`:

```json
{
  "data": [
    {
      "_id": "jobId",
      "title": "Frontend Developer",
      "department": "Engineering",
      "required_skills": [{ "_id": "skillId", "name": "React" }],
      "is_active": true,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

### GET `/api/v1/job-positions/:id`

- Cong dung: lay chi tiet job position.
- Params: `id`.
- Response `200`:

```json
{
  "data": {
    "_id": "jobId",
    "title": "Frontend Developer",
    "department": "Engineering",
    "required_skills": [{ "_id": "skillId", "name": "React" }],
    "is_active": true,
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

- Loi: `400` invalid ObjectId, `404`.

### POST `/api/v1/job-positions`

- Cong dung: tao job position.
- Request JSON:

```json
{
  "title": "Frontend Developer",
  "department": "Engineering",
  "required_skills": ["skillId1", "skillId2"]
}
```

- `department` optional, default `Engineering`.
- `required_skills` optional, default `[]`.
- Response `201`:

```json
{
  "data": {
    "_id": "jobId",
    "title": "Frontend Developer",
    "department": "Engineering",
    "required_skills": ["skillId1"],
    "is_active": true,
    "createdAt": "date",
    "updatedAt": "date"
  },
  "message": "Tao job position thanh cong"
}
```

- Loi: `400` thieu `title`.

### PUT `/api/v1/job-positions/:id`

- Cong dung: cap nhat job position.
- Params: `id`.
- Request JSON: partial fields.

```json
{
  "title": "Senior Frontend Developer",
  "department": "Product",
  "required_skills": ["skillId1"]
}
```

- Response `200`:

```json
{
  "data": {
    "_id": "jobId",
    "title": "Senior Frontend Developer",
    "department": "Product",
    "required_skills": [{ "_id": "skillId1", "name": "React" }],
    "is_active": true
  },
  "message": "Cap nhat thanh cong"
}
```

### DELETE `/api/v1/job-positions/:id`

- Cong dung: soft delete job position bang `is_active=false`.
- Params: `id`.
- Response `200`:

```json
{
  "data": null,
  "message": "Da xoa (soft-delete) job position"
}
```

---

## 4. Candidates

Tat ca API group nay can Bearer token va role `HR` hoac `ADMIN`.

- HR chi thay/sua/xoa candidate minh tao (`owner_id = req.user.id`).
- ADMIN thay tat ca.
- Neu candidate da gan vao interview session thi khong cho update/delete.

### GET `/api/v1/candidates`

- Cong dung: lay danh sach candidate.
- Response `200`:

```json
{
  "data": [
    {
      "_id": "candidateId",
      "owner_id": { "_id": "hrUserId", "name": "HR", "email": "hr@example.com" },
      "full_name": "Nguyen Van A",
      "email": "a@example.com",
      "resume_url": "https://...",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

### GET `/api/v1/candidates/:id`

- Cong dung: lay chi tiet candidate.
- Params: `id`.
- Response `200`:

```json
{
  "data": {
    "_id": "candidateId",
    "owner_id": { "_id": "hrUserId", "name": "HR", "email": "hr@example.com" },
    "full_name": "Nguyen Van A",
    "email": "a@example.com",
    "resume_url": "https://..."
  }
}
```

### POST `/api/v1/candidates`

- Cong dung: tao candidate profile.
- Request JSON:

```json
{
  "full_name": "Nguyen Van A",
  "email": "a@example.com",
  "resume_url": "https://example.com/cv.pdf"
}
```

- `resume_url` optional.
- Response `201`:

```json
{
  "data": {
    "_id": "candidateId",
    "owner_id": "hrUserId",
    "full_name": "Nguyen Van A",
    "email": "a@example.com",
    "resume_url": "https://example.com/cv.pdf"
  },
  "message": "Tao ung vien thanh cong"
}
```

### PUT `/api/v1/candidates/:id`

- Cong dung: cap nhat candidate profile.
- Params: `id`.
- Request JSON: partial fields, `owner_id` bi ignore.

```json
{
  "full_name": "Nguyen Van B",
  "email": "b@example.com",
  "resume_url": "https://example.com/new-cv.pdf"
}
```

- Response `200`:

```json
{
  "data": {
    "_id": "candidateId",
    "owner_id": "hrUserId",
    "full_name": "Nguyen Van B",
    "email": "b@example.com",
    "resume_url": "https://example.com/new-cv.pdf"
  },
  "message": "Cap nhat ung vien thanh cong"
}
```

### DELETE `/api/v1/candidates/:id`

- Cong dung: xoa candidate profile.
- Params: `id`.
- Response `200`:

```json
{
  "data": null,
  "message": "Da xoa ung vien"
}
```

---

## 5. Skills

Tat ca API group nay can Bearer token va role `HR` hoac `ADMIN`.

### GET `/api/v1/skills`

- Cong dung: lay danh sach skill.
- Response `200`:

```json
{
  "data": [
    {
      "_id": "skillId",
      "name": "React",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

### POST `/api/v1/skills`

- Cong dung: tao skill.
- Request JSON:

```json
{ "name": "React" }
```

- Response `201`:

```json
{
  "data": {
    "_id": "skillId",
    "name": "React",
    "createdAt": "date",
    "updatedAt": "date"
  },
  "message": "Tao skill thanh cong"
}
```

- Loi: `400` thieu name hoac skill da ton tai.

### DELETE `/api/v1/skills/:id`

- Cong dung: xoa skill.
- Params: `id`.
- Response `200`:

```json
{
  "data": null,
  "message": "Xoa skill thanh cong"
}
```

---

## 6. Categories

Tat ca API group nay can Bearer token va role `HR` hoac `ADMIN`.

### GET `/api/v1/categories`

- Cong dung: lay danh sach category cau hoi.
- Response `200`:

```json
{
  "data": [
    {
      "_id": "categoryId",
      "name": "Frontend",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

### POST `/api/v1/categories`

- Cong dung: tao category.
- Request JSON:

```json
{ "name": "Frontend" }
```

- Response `201`:

```json
{
  "data": {
    "_id": "categoryId",
    "name": "Frontend",
    "createdAt": "date",
    "updatedAt": "date"
  },
  "message": "Tao category thanh cong"
}
```

- Loi: `400` thieu name hoac category da ton tai.

### DELETE `/api/v1/categories/:id`

- Cong dung: xoa category.
- Params: `id`.
- Response `200`:

```json
{
  "data": null,
  "message": "Da xoa category"
}
```

---

## 7. Questions Bank

Tat ca API group nay can Bearer token.

- `GET /questions` va `POST /questions/vector-search`: moi user da login deu goi duoc.
- `POST /questions`, `DELETE /questions/:id`, `POST /questions/import-pdf`: chi role `HR`.
- Controller co ham `updateQuestion`, nhung route `PUT /questions/:id` chua duoc mount.

### GET `/api/v1/questions`

- Cong dung: lay danh sach question bank.
- Query:

```ts
{
  category_id?: string;
}
```

- Response `200`:

```json
{
  "data": [
    {
      "id": "questionId",
      "category_id": { "_id": "categoryId", "name": "Frontend" },
      "assessed_skills": [{ "_id": "skillId", "name": "React" }],
      "content": "Explain React hooks",
      "expected_answer": "A good answer...",
      "embedding": [0.01, 0.02],
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "total": 1
}
```

### POST `/api/v1/questions`

- Role: `HR`.
- Cong dung: tao cau hoi moi va auto tao embedding tu `expected_answer`.
- Request JSON:

```json
{
  "category_id": "categoryId",
  "assessed_skills": ["skillId1", "skillId2"],
  "content": "Explain React hooks",
  "expected_answer": "A good answer should mention useState, useEffect..."
}
```

- `assessed_skills` optional, default `[]`.
- Response `201`:

```json
{
  "data": {
    "id": "questionId",
    "category_id": "categoryId",
    "assessed_skills": ["skillId1"],
    "content": "Explain React hooks",
    "expected_answer": "A good answer...",
    "embedding": [0.01, 0.02],
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

- Loi: `400` thieu `category_id`, `content`, `expected_answer`.

### DELETE `/api/v1/questions/:id`

- Role: `HR`.
- Cong dung: xoa cau hoi.
- Params: `id`.
- Response `200`:

```json
{
  "data": null,
  "message": "Xoa cau hoi thanh cong"
}
```

### POST `/api/v1/questions/import-pdf`

- Role: `HR`.
- Content-Type: `multipart/form-data`.
- Cong dung: import danh sach cau hoi tu PDF bang Gemini.
- Form data:

```ts
{
  file: File;        // field name: "file", nen la PDF
  category_id: string;
}
```

- Response `201`:

```json
{
  "message": "Import thanh cong 10 cau hoi tu PDF",
  "data": [
    {
      "id": "questionId",
      "category_id": "categoryId",
      "assessed_skills": [],
      "content": "Question content",
      "expected_answer": "Expected answer",
      "embedding": [0.01, 0.02]
    }
  ]
}
```

- Loi: `400` khong co file hoac thieu `category_id`.

### POST `/api/v1/questions/vector-search`

- Auth: Bearer token, khong check role.
- Cong dung: test/search cau hoi gan nghia theo vector.
- Request JSON:

```json
{
  "query": "React state management",
  "limit": 5
}
```

- `limit` optional, default `5`.
- Response `200`:

```json
{
  "data": [
    {
      "id": "questionId",
      "content": "Explain React hooks",
      "expected_answer": "A good answer...",
      "embedding": [0.01, 0.02],
      "score": 0.9123
    }
  ]
}
```

- Neu MongoDB Atlas Vector Search khong kha dung, code fallback cosine similarity in-memory.

---

## 8. Knowledge Base / RAG

Tat ca API group nay can Bearer token va role `HR` hoac `ADMIN`.

### GET `/api/v1/knowledge`

- Cong dung: lay danh sach tai lieu RAG.
- Response `200`:

```json
{
  "data": [
    {
      "id": "documentId",
      "title": "Frontend Handbook",
      "file_url": "uploads/documents/file.pdf",
      "mime_type": "application/pdf",
      "uploaded_by": { "_id": "userId", "name": "HR", "email": "hr@example.com" },
      "job_position_id": "jobId",
      "is_processed": true,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

### POST `/api/v1/knowledge/upload`

- Content-Type: `multipart/form-data`.
- Cong dung: upload file tri thuc, tach chunk va tao embedding cho RAG.
- Ho tro: PDF, DOCX, TXT.
- Gioi han multer: `10MB`.
- Form data:

```ts
{
  file: File;              // field name: "file"
  title?: string;          // optional, default original file name
  job_position_id: string;
}
```

- Response `201`:

```json
{
  "message": "Xu ly RAG tai lieu thanh cong",
  "data": {
    "document": {
      "id": "documentId",
      "title": "Frontend Handbook",
      "file_url": "path/to/uploaded-file",
      "mime_type": "application/pdf",
      "uploaded_by": "userId",
      "job_position_id": "jobId",
      "is_processed": true,
      "createdAt": "date",
      "updatedAt": "date"
    },
    "total_chunks": 12
  }
}
```

- Loi: `400` thieu/sai `job_position_id`, file unsupported, khong trich xuat duoc text; `404` job position khong ton tai.

---

## 9. Interview Sessions

Tat ca API group nay can Bearer token.

- `GET /sessions`, `GET /sessions/room/:room_code`: moi user da login deu goi duoc.
- `POST /sessions`, `PUT /sessions/:id/status`, `POST /sessions/:id/send-invitation`, `POST /sessions/:id/follow-up-question`: chi role `HR`.
- HR chi thay list session minh tao; role khac thay tat ca theo code hien tai.

### GET `/api/v1/sessions`

- Cong dung: lay danh sach interview session.
- Response `200`:

```json
{
  "data": [
    {
      "id": "sessionId",
      "conductor_id": { "_id": "hrUserId", "name": "HR", "email": "hr@example.com" },
      "job_position_id": { "_id": "jobId", "title": "Frontend Developer" },
      "candidate_profile_id": { "_id": "candidateId", "full_name": "Nguyen Van A", "email": "a@example.com" },
      "room_code": "A1B2C3D4",
      "status": "SCHEDULED",
      "scheduled_at": "2026-06-10T10:00:00.000Z",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

### POST `/api/v1/sessions`

- Role: `HR`.
- Cong dung: tao phong phong van, clone cau hoi tu QuestionBank sang SessionQuestion, tao magic link.
- Request JSON:

```json
{
  "job_position_id": "jobId",
  "candidate_profile_id": "candidateId",
  "question_bank_ids": ["questionId1", "questionId2"],
  "scheduled_at": "2026-06-10T10:00:00.000Z"
}
```

- `question_bank_ids` optional, default khong clone cau hoi.
- `scheduled_at` optional.
- Gate: neu job co KnowledgeDocument `is_processed=false` thi tra `403`.
- Response `201`:

```json
{
  "message": "Tao buoi phong van thanh cong",
  "data": {
    "id": "sessionId",
    "conductor_id": "hrUserId",
    "job_position_id": "jobId",
    "candidate_profile_id": "candidateId",
    "room_code": "A1B2C3D4",
    "status": "SCHEDULED",
    "scheduled_at": "2026-06-10T10:00:00.000Z",
    "createdAt": "date",
    "updatedAt": "date"
  },
  "magic_url": "http://localhost:3000/interview/join?token=<magicLinkToken>"
}
```

### GET `/api/v1/sessions/room/:room_code`

- Auth: Bearer token.
- Cong dung: lay thong tin phong va danh sach cau hoi da clone theo room code.
- Params: `room_code`.
- Response `200`:

```json
{
  "data": {
    "id": "sessionId",
    "conductor_id": "hrUserId",
    "job_position_id": { "_id": "jobId", "title": "Frontend Developer" },
    "candidate_profile_id": { "_id": "candidateId", "full_name": "Nguyen Van A", "email": "a@example.com" },
    "room_code": "A1B2C3D4",
    "status": "SCHEDULED",
    "scheduled_at": "date",
    "questions": [
      {
        "id": "sessionQuestionId",
        "session_id": "sessionId",
        "question_bank_id": "questionId",
        "content": "Question content",
        "expected_answer": "Expected answer",
        "order_index": 1,
        "is_ad_hoc": false
      }
    ]
  }
}
```

### PUT `/api/v1/sessions/:id/status`

- Role: `HR`.
- Cong dung: cap nhat status session. Neu status la `COMPLETED`, backend day job vao queue AI evaluation.
- Params: `id`.
- Request JSON:

```json
{
  "status": "COMPLETED"
}
```

- Status hop le theo model: `SCHEDULED`, `ONGOING`, `COMPLETED`, `CANCELLED`.
- Response `200`:

```json
{
  "data": {
    "id": "sessionId",
    "status": "COMPLETED",
    "room_code": "A1B2C3D4"
  }
}
```

### POST `/api/v1/sessions/:id/send-invitation`

- Role: `HR`.
- Cong dung: gui email magic link cho candidate cua session.
- Params: `id`.
- Request: no body.
- Response `200`:

```json
{
  "message": "Da gui email loi moi thanh cong"
}
```

### POST `/api/v1/sessions/:id/follow-up-question`

- Role: `HR`.
- Cong dung: them cau hoi ad-hoc/follow-up vao session.
- Params: `id`.
- Request JSON:

```json
{
  "content": "Can you explain more about that tradeoff?",
  "expected_answer": "Candidate should mention performance, maintainability..."
}
```

- Response `201`:

```json
{
  "message": "Tao cau hoi Follow-up thanh cong",
  "data": {
    "id": "sessionQuestionId",
    "session_id": "sessionId",
    "content": "Can you explain more about that tradeoff?",
    "expected_answer": "Candidate should mention performance...",
    "order_index": 3,
    "is_ad_hoc": true,
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

---

## 10. Recordings

### POST `/api/v1/recordings/upload`

- Auth: Bearer token.
- Role: khong check role trong route.
- Content-Type: `multipart/form-data`.
- Cong dung: upload audio cho tung cau hoi phong van.
- Form data:

```ts
{
  audio: File;                 // field name: "audio"
  session_id: string;
  question_id: string;          // SessionQuestion id
  user_role: "HR" | "CANDIDATE";
  started_at?: string;          // ISO date
  ended_at?: string;            // ISO date
}
```

- Response `201`:

```json
{
  "message": "Upload am thanh thanh cong",
  "data": {
    "id": "recordingId",
    "session_id": "sessionId",
    "question_id": "sessionQuestionId",
    "user_role": "CANDIDATE",
    "file_url": "http://localhost:5000/uploads/recordings/file.webm",
    "file_name": "answer.webm",
    "transcript": "",
    "status": "PENDING",
    "duration": 0,
    "timestamp_metadata": {
      "started_at": "date",
      "ended_at": "date"
    },
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

- Loi: `400` khong co file/thieu field/user_role sai; `404` session hoac question khong ton tai; `500`.

---

## 11. Reports

Tat ca API group nay can Bearer token va role `HR` hoac `ADMIN`.

### GET `/api/v1/reports`

- Cong dung: lay dashboard report tat ca session.
- Response `200`:

```json
{
  "message": "Lay du lieu Dashboard thanh cong",
  "data": [
    {
      "session_id": "sessionId",
      "room_code": "A1B2C3D4",
      "status": "COMPLETED",
      "scheduled_at": "date",
      "candidate": {
        "_id": "candidateId",
        "full_name": "Nguyen Van A",
        "email": "a@example.com",
        "phone": "optional"
      },
      "metrics": {
        "total_questions": 5,
        "evaluated_questions": 5,
        "average_score": 82
      }
    }
  ]
}
```

### GET `/api/v1/reports/:sessionId`

- Cong dung: lay report chi tiet cua mot session.
- Params: `sessionId`.
- Response `200`:

```json
{
  "message": "Lay bao cao phong van thanh cong",
  "data": {
    "session_info": {
      "id": "sessionId",
      "candidate_profile_id": {
        "_id": "candidateId",
        "full_name": "Nguyen Van A",
        "email": "a@example.com"
      },
      "room_code": "A1B2C3D4",
      "status": "COMPLETED"
    },
    "metrics": {
      "total_questions": 5,
      "evaluated_questions": 5,
      "average_score": 82
    },
    "detailed_results": [
      {
        "question_id": "sessionQuestionId",
        "question_content": "Question content",
        "expected_answer": "Expected answer",
        "candidate_transcript": "Candidate answer transcript",
        "audio_url": null,
        "evaluation": {
          "score": 80,
          "feedback": "Good answer",
          "strengths": ["Clear explanation"],
          "weaknesses": ["Missing edge cases"],
          "version": 1
        }
      }
    ]
  }
}
```

Note: `audio_url` trong report co the `null` do schema Recording khong khai bao `audio_url`; neu can play audio, nen map them tu `file_url` o BE hoac sua schema.

### POST `/api/v1/reports/:sessionId/re-evaluate`

- Cong dung: dua session vao queue cham diem lai, tao version moi.
- Params: `sessionId`.
- Request: no body.
- Response `200`:

```json
{
  "message": "Da yeu cau AI cham diem lai phien nay. Vui long quay lai sau it phut."
}
```

### GET `/api/v1/reports/:sessionId/export-pdf`

- Cong dung: export report PDF.
- Params: `sessionId`.
- Response `200`:

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename=Interview_Report_<room_code>.pdf
```

- Body la binary PDF.

---

## Socket.IO API

Server khoi tao Socket.IO tren cung host voi Express.

### Connect

```ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: accessToken }
});
```

- Token duoc verify bang `JWT_ACCESS_SECRET`.
- Neu thieu/sai token: connection error `Authentication required` hoac `Invalid or expired token`.

### Client emits: `room:join`

- Cong dung: join phong phong van.
- Payload:

```json
{ "roomCode": "A1B2C3D4" }
```

- Server check session ton tai va status khong phai `COMPLETED`/`CANCELLED`.
- Server emits `room:user-joined` cho ca room:

```json
{
  "userId": "userId",
  "role": "HR",
  "participants": [
    { "userId": "userId", "role": "HR" }
  ]
}
```

- Loi emits `room:error`:

```json
{ "message": "Interview room not found" }
```

### Client emits: `room:leave`

- Payload:

```json
{ "roomCode": "A1B2C3D4" }
```

- Server emits `room:user-left`:

```json
{
  "userId": "userId",
  "role": "HR",
  "participants": []
}
```

### Client emits: `recording:start`

- Role socket: `HR`.
- Payload:

```json
{
  "roomCode": "A1B2C3D4",
  "questionId": "sessionQuestionId"
}
```

- Server emits `recording:started`:

```json
{
  "questionId": "sessionQuestionId",
  "startedBy": "hrUserId",
  "startedAt": "2026-06-10T00:00:00.000Z"
}
```

### Client emits: `recording:stop`

- Role socket: `HR`.
- Payload:

```json
{
  "roomCode": "A1B2C3D4",
  "questionId": "sessionQuestionId"
}
```

- Server emits `recording:stopped`:

```json
{
  "questionId": "sessionQuestionId",
  "stoppedBy": "hrUserId",
  "stoppedAt": "2026-06-10T00:00:00.000Z"
}
```

### Client emits: `question:next`

- Role socket: `HR`.
- Payload:

```json
{
  "roomCode": "A1B2C3D4",
  "questionIndex": 1
}
```

- Server emits `question:changed`:

```json
{
  "questionIndex": 1,
  "changedBy": "hrUserId"
}
```

### Client emits: `audio:stream`

- Role socket: `CANDIDATE`.
- Cong dung: gui chunk audio realtime de STT.
- Payload:

```ts
{
  roomCode: string;
  audioChunk: Buffer;
  questionId: string;
}
```

- Server emits `audio:transcription` neu co text:

```json
{
  "questionId": "sessionQuestionId",
  "text": "partial transcript",
  "userId": "candidateUserId"
}
```

### Client emits: `webrtc:offer`

- Payload:

```ts
{
  roomCode: string;
  targetUserId: string;
  offer: any;
}
```

- Server emits `webrtc:offer-received`:

```ts
{
  userId: string;
  targetUserId: string;
  offer: any;
}
```

### Client emits: `webrtc:answer`

- Payload:

```ts
{
  roomCode: string;
  targetUserId: string;
  answer: any;
}
```

- Server emits `webrtc:answer-received`:

```ts
{
  userId: string;
  targetUserId: string;
  answer: any;
}
```

### Client emits: `webrtc:ice-candidate`

- Payload:

```ts
{
  roomCode: string;
  targetUserId: string;
  candidate: any;
}
```

- Server emits `webrtc:ice-candidate-received`:

```ts
{
  userId: string;
  targetUserId: string;
  candidate: any;
}
```

### Server emits: `room:error`

- Dung chung cho loi room/permission/socket.

```json
{ "message": "Only HR can control recording" }
```

## Luong FE Goi API Goi Y

### HR Dashboard

1. `POST /api/v1/auth/login`
2. `GET /api/v1/auth/me`
3. `GET /api/v1/job-positions`
4. `GET /api/v1/candidates`
5. `GET /api/v1/questions`
6. `GET /api/v1/sessions`
7. `GET /api/v1/reports`

### Tao phong phong van

1. Tao skill/category neu can: `POST /api/v1/skills`, `POST /api/v1/categories`
2. Tao question: `POST /api/v1/questions` hoac `POST /api/v1/questions/import-pdf`
3. Tao candidate: `POST /api/v1/candidates`
4. Upload RAG doc neu can: `POST /api/v1/knowledge/upload`
5. Tao session: `POST /api/v1/sessions`
6. Gui email: `POST /api/v1/sessions/:id/send-invitation`

### Phong phong van realtime

1. Lay room data: `GET /api/v1/sessions/room/:room_code`
2. Connect Socket.IO voi access token.
3. Emit `room:join`.
4. HR dieu khien question/recording bang socket events.
5. Upload audio file sau moi cau hoi: `POST /api/v1/recordings/upload`.
6. Ket thuc session: `PUT /api/v1/sessions/:id/status` voi `COMPLETED`.
7. Xem report sau khi queue AI chay xong: `GET /api/v1/reports/:sessionId`.

## Ghi Chu Can Luu Y Cho FE/BE

1. Magic link middleware co ton tai o `src/middlewares/magic-link.middleware.ts` nhung chua route nao mount. Hien tai magic URL duoc tao/gui email, nhung backend chua co endpoint public de verify magic token.
2. Socket.IO auth yeu cau token co payload `{ id, role }`. Magic link token hien tai co payload `{ session_id, candidate_id, room_code }`, nen khong phu hop truc tiep voi socket permission neu FE dung no nhu access token.
3. `RecordingSchema` khong co `audio_url`, trong khi controller/report doc dung `audio_url`; FE nen dung `file_url` hoac BE nen bo sung field `audio_url`.
4. Route update question chua duoc expose mac du controller co `updateQuestion`.
5. `DELETE /api/v1/users/:id` chua validate ObjectId middleware, neu id sai format co the roi vao `500` thay vi `400`.
