export interface KnowledgeUploader {
  _id: string;
  name: string;
  email: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  file_url: string;
  mime_type: string;
  uploaded_by: string | KnowledgeUploader;
  job_position_id: string;
  is_processed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadKnowledgeResponseData {
  document: KnowledgeDocument;
  total_chunks: number;
}
