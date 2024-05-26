import axios from 'axios';

export const generateTagsFromText = async (text: string, topTags: string[]): Promise<string[]> => {
    try {
        const response = await axios.post('http://localhost:5001/relevant-tags', {
            free_text: text,
            top_tags: topTags
        });
        const relevantTags = response.data.relevant_tags;
        return relevantTags;
    } catch (error) {
        console.error('Error generating tags:', error);
        throw error;
    }
};
