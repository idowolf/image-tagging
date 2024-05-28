import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { embedText, getRelevantTags } from '../../src/services/nlpService';
import { NLP_SERVER_URL } from '../../src/config/appConfig';

// Create a new instance of axios-mock-adapter
const mock = new MockAdapter(axios);

describe('nlpService', () => {
    afterEach(() => {
        // Reset the mock after each test
        mock.reset();
    });

    describe('embedText', () => {
        const text = 'test text';
        const apiUrl = `${NLP_SERVER_URL}/embed`;

        it('should return embedding when API call is successful', async () => {
            const mockEmbedding = [0.1, 0.2, 0.3];
            const mockResponse = { embedding: mockEmbedding };

            // Mock the API response
            mock.onPost(apiUrl).reply(200, mockResponse);

            const embedding = await embedText(text);

            expect(embedding).toEqual(mockEmbedding);
        });

        it('should throw an error when API call fails', async () => {
            // Mock a failed API response
            mock.onPost(apiUrl).reply(500);

            await expect(embedText(text)).rejects.toThrow();
        });

        it('should call the correct API endpoint with the correct payload', async () => {
            const mockEmbedding = [0.1, 0.2, 0.3];
            const mockResponse = { embedding: mockEmbedding };

            // Mock the API response
            mock.onPost(apiUrl).reply(200, mockResponse);

            await embedText(text);

            expect(mock.history.post.length).toBe(1);
            expect(mock.history.post[0].url).toBe(apiUrl);
            expect(JSON.parse(mock.history.post[0].data)).toEqual({ text });
        });
    });

    describe('getRelevantTags', () => {
        const text = 'test text';
        const topTags = ['tag1', 'tag2'];
        const apiUrl = `${NLP_SERVER_URL}/relevant-tags`;

        it('should return relevant tags when API call is successful', async () => {
            const mockRelevantTags = ['relevantTag1', 'relevantTag2'];
            const mockResponse = { relevant_tags: mockRelevantTags };

            // Mock the API response
            mock.onPost(apiUrl).reply(200, mockResponse);

            const relevantTags = await getRelevantTags(text, topTags);

            expect(relevantTags).toEqual(mockRelevantTags);
        });

        it('should throw an error when API call fails', async () => {
            // Mock a failed API response
            mock.onPost(apiUrl).reply(500);

            await expect(getRelevantTags(text, topTags)).rejects.toThrow();
        });

        it('should call the correct API endpoint with the correct payload', async () => {
            const mockRelevantTags = ['relevantTag1', 'relevantTag2'];
            const mockResponse = { relevant_tags: mockRelevantTags };

            // Mock the API response
            mock.onPost(apiUrl).reply(200, mockResponse);

            await getRelevantTags(text, topTags);

            expect(mock.history.post.length).toBe(1);
            expect(mock.history.post[0].url).toBe(apiUrl);
            expect(JSON.parse(mock.history.post[0].data)).toEqual({ free_text: text, top_tags: topTags });
        });
    });
});
