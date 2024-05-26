import axios from 'axios';

const generateTags = async (imageBase64: string): Promise<string[]> => {
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llava',
            format: 'json',
            prompt: 'You are an assistive AI tool at a mobile game company, aiding graphic designers in finding graphics by tags. Generate 20 or less tags for the attached image describing its contents, such as describing backgrounds, characters, objects and texts, in generic terms. Examples: \'pig\', \'house\', or \'snow\'. No need for tags that apply to all images in this context, such as \'Game\' or \'App\'. Return 20 or less tags as an array, formatted as {"tags": ["tag1", "tag2", ...]}.',
            stream: false,
            images: [imageBase64]
        });
        const tags = JSON.parse(response.data.response).tags;
        return tags;
    } catch (error) {
        console.error('Error generating tags:', error);
        return [];
    }
};

export default generateTags;
