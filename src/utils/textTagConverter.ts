import axios from 'axios';
import Tag from '../models/Tag';

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

export const autocomplete = async (query: string): Promise<string[]> => {
    try {
        const tags = await Tag.find({ name: { $regex: new RegExp(`^${query}`, 'i') } }).limit(10);
        return tags.map(tag => tag.name);
    } catch (error) {
        console.error('Error autocompleting tags:', error);
        throw error;
    }
}