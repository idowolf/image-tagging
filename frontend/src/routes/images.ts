import api from "../services/api";

export const uploadImage = (formData: FormData) => {
  return api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const searchImages = (data: { tags: Set<string>, pageNumber: number, pageSize: number }) => {
  return api.post('/images/search', { tags: Array.from(data.tags), pageNumber: data.pageNumber, pageSize: data.pageSize });
};