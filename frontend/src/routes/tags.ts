import api from "../services/api";

export const autocompleteTags = (query: string) => {
  return api.get(`/tags/autocomplete?query=${query}`);
};

export const getTopTags = () => {
  return api.get('/tags/top_tags?limit=6');
}

export const convertTextToTags = (data: { text: string, topTagsCount: number }) => {
  return api.post('/tags/convertTextToTags', data);
}