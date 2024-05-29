import api from "../services/api";

/**
 * Retrieves a list of autocomplete suggestions for tags based on the given query.
 * @param query - The query string to search for tags.
 * @returns A Promise that resolves to the autocomplete suggestions.
 */
export const autocompleteTags = (query: string) => {
  return api.get(`/tags/autocomplete?query=${query}`);
};

/**
 * Retrieves the top tags from the server.
 * @returns {Promise<any>} A promise that resolves with the top tags.
 */
export const getTopTags = () => {
  return api.get('/tags/top_tags?limit=6');
}

/**
 * Converts text to tags by making a POST request to the '/tags/convertTextToTags' endpoint.
 * @param data - The data object containing the text and the number of top tags to retrieve.
 * @returns A Promise that resolves to the response of the API call.
 */
export const convertTextToTags = (data: { text: string, topTagsCount: number }) => {
  return api.post('/tags/convertTextToTags', data);
}