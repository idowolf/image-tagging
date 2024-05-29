import api from "../services/api";

/**
 * Uploads an image using the provided form data.
 * @param formData - The form data containing the image to upload.
 * @returns A Promise that resolves to the response from the server.
 */
export const uploadImage = (formData: FormData) => {
  return api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Searches for images based on the provided tags, page number, and page size.
 * @param data - An object containing the search parameters.
 * @param data.tags - A set of tags to search for.
 * @param data.pageNumber - The page number of the search results.
 * @param data.pageSize - The number of results per page.
 * @returns A Promise that resolves to the search results.
 */
export const searchImages = (data: { tags: Set<string>, pageNumber: number, pageSize: number }) => {
  return api.post('/images/search', { tags: Array.from(data.tags), pageNumber: data.pageNumber, pageSize: data.pageSize });
};