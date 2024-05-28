import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { generateTags } from '../../src/services/llmService';
import { LLM_SERVER_URL } from '../../src/config/appConfig';

// Create a new instance of axios-mock-adapter
const mock = new MockAdapter(axios);

describe('generateTags', () => {
    const imageBase64 = 'dummyBase64ImageString';
    const apiUrl = `${LLM_SERVER_URL}/api/generate`;
    const prompt = 'You are an assistive AI tool at a mobile game company, aiding graphic designers in finding graphics by tags. Generate 20 or less tags for the attached image describing its contents, such as describing backgrounds, characters, objects and texts, in generic terms. Examples: \'pig\', \'house\', or \'snow\'. No need for tags that apply to all images in this context, such as \'Game\' or \'App\'. Return 20 or less tags as an array, formatted as JSON: {"tags": ["tag1", "tag2", ...]}.';

    afterEach(() => {
        // Reset the mock after each test
        mock.reset();
    });

    it('should return generated tags when API call is successful', async () => {
        const mockTags = ['tag1', 'tag2', 'tag3'];
        const mockResponse = { response: JSON.stringify({ tags: mockTags }) };

        // Mock the API response
        mock.onPost(apiUrl).reply(200, mockResponse);

        const tags = await generateTags(imageBase64);

        expect(tags).toEqual(mockTags);
    });

    it('should return an empty array when API call fails', async () => {
        // Mock a failed API response
        mock.onPost(apiUrl).reply(500);

        const tags = await generateTags(imageBase64);

        expect(tags).toEqual([]);
    });

    it('should call the correct API endpoint with the correct payload', async () => {
        const mockTags = ['tag1', 'tag2', 'tag3'];
        const mockResponse = { response: JSON.stringify({ tags: mockTags }) };

        // Mock the API response
        mock.onPost(apiUrl).reply(200, mockResponse);

        await generateTags(imageBase64);

        expect(mock.history.post.length).toBe(1);
        expect(mock.history.post[0].url).toBe(apiUrl);
        expect(JSON.parse(mock.history.post[0].data)).toEqual({
            model: 'llava',
            format: 'json',
            prompt: prompt,
            stream: false,
            images: [imageBase64]
        });
    });
});
