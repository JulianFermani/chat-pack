import axios from 'axios';

import { originPlacesFetcher } from './origin-places-fetcher.service';

jest.mock('axios');

describe('originPlacesFetcher', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('parses places from html response and builds message text', async () => {
    mockedAxios.get.mockResolvedValue({
      data: `
        <html>
          <script>
            const localidades_cordoba = [
              {"id":"1","nombre":"Cordoba Centro","desc_publica":"Centro"},
              {"id":"2","nombre":"Nueva Cordoba","desc_publica":"Nueva Cordoba"}
            ];
          </script>
        </html>
      `,
    } as any);

    const result = await originPlacesFetcher('cookie-123', 'https://example.com');

    expect(mockedAxios.get).toHaveBeenCalledWith('https://example.com', {
      headers: expect.objectContaining({
        Cookie: 'PHPSESSID=cookie-123',
      }),
    });
    expect(result.places).toEqual({
      'Cordoba Centro': '1',
      'Nueva Cordoba': '2',
    });
    expect(result.messageText).toMatch(/\. Cordoba Centro/);
    expect(result.messageText).toMatch(/\. Nueva Cordoba/);
  });

  it('throws when places block is missing in html response', async () => {
    mockedAxios.get.mockResolvedValue({ data: '<html></html>' } as any);

    await expect(
      originPlacesFetcher('cookie-123', 'https://example.com'),
    ).rejects.toThrow('No se pudieron encontrar las localidades en la respuesta');
  });
});
