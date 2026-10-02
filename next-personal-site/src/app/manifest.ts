import {MetadataRoute} from 'next';

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Maksym Solomkin',
        short_name: 'Maksym Solomkin',
        description: 'Personal website of Maksym Solomkin',
        start_url: '/',
        display: 'standalone',
        background_color: '#edebe8',
        theme_color: '#edebe8',
        icons: [
            {
                src: '/logo-ms-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
        ],
    }
}
