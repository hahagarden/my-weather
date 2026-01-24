export const regionKeys = {
    all: ['regions'] as const,
    search: (query: string) => [...regionKeys.all, 'search', query] as const,
}