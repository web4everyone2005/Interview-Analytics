export interface KnowledgeUploader {
  _id: string;
  name: string;
  email: string;
}

export interface KnowledgeDocument {
  id: string;
  _id?: string;
  job_position_id: string | any;
  file_name?: string; // Tương thích code cũ
  title?: string;
  file_url: string;
  mime_type?: string;
  uploaded_by?: string | KnowledgeUploader;
  is_processed: boolean;
  uploaded_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadKnowledgeResponseData {
  document: KnowledgeDocument;
  total_chunks: number;
}
