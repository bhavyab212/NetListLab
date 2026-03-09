import { api, buildQueryString } from '../lib/api';

describe('API Library', () => {
    describe('buildQueryString', () => {
        it('should correctly format query string parameters', () => {
            const params = { type: 'Hardware', limit: 10, search: undefined, focus: null };
            const qs = buildQueryString(params);
            expect(qs).toBe('type=Hardware&limit=10');
        });

        it('should return empty string if no valid params', () => {
            const params = { foo: undefined, bar: null };
            const qs = buildQueryString(params);
            expect(qs).toBe('');
        });
    });

    describe('API Error Handling', () => {
        beforeEach(() => {
            global.fetch = jest.fn();
        });

        it('should throw Error on non-2xx responses', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 404,
                text: async () => JSON.stringify({ error: 'Not found' })
            });

            await expect(api.getProject('invalid-id')).rejects.toThrow();
        });

        it('should use default error message if parsing fails', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: async () => 'Internal Server Error'
            });

            await expect(api.getProject('invalid-id')).rejects.toThrow();
        });
    });
});
