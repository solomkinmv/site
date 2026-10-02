import {MetadataRoute} from 'next';

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Maksym Solomkin',
        short_name: 'Maksym Solomkin',
        description: 'Personal website of Maksym Solomkin',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/logo-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
        ],
    }
}
