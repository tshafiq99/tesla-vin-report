export const metadata = {
    title: {
        default: 'Tesla VIN Report - Comprehensive VIN Decoder & Analysis',
        template: '%s | Tesla VIN Report'
    },
    description: 'Get comprehensive Tesla VIN reports with battery insights, vehicle configuration, performance specs, and internet research. Decode your Tesla VIN to unlock detailed vehicle information.',
    keywords: [
        'Tesla VIN',
        'VIN decoder',
        'Tesla VIN check',
        'Tesla vehicle report',
        'VIN analysis',
        'Tesla battery health',
        'Tesla VIN lookup',
        'Tesla specifications',
        'VIN decoder Tesla',
        'Tesla vehicle information'
    ],
    authors: [{ name: 'Tesla VIN Report' }],
    creator: 'Tesla VIN Report',
    publisher: 'Tesla VIN Report',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        title: 'Tesla VIN Report - Comprehensive VIN Decoder & Analysis',
        description: 'Get comprehensive Tesla VIN reports with battery insights, vehicle configuration, performance specs, and internet research.',
        siteName: 'Tesla VIN Report',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tesla VIN Report - Comprehensive VIN Decoder & Analysis',
        description: 'Get comprehensive Tesla VIN reports with battery insights, vehicle configuration, performance specs, and internet research.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // Add your verification codes here when available
        // google: 'your-google-verification-code',
        // yandex: 'your-yandex-verification-code',
    },
};

export default function RootLayout({ children }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Tesla VIN Report',
        description: 'Comprehensive Tesla VIN decoder and analysis tool providing detailed vehicle reports with battery insights, performance specs, and internet research.',
        url: baseUrl,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        featureList: [
            'Tesla VIN Decoding',
            'Battery Health Analysis',
            'Vehicle Configuration Details',
            'Performance Specifications',
            'Internet Research Insights',
            'Comprehensive Vehicle Reports'
        ]
    };

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="canonical" href={baseUrl} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <meta name="theme-color" content="#E31937" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    @media print {
                        body {
                            background: white;
                        }
                        button {
                            display: none !important;
                        }
                        @page {
                            margin: 1cm;
                        }
                    }
                `}</style>
            </head>
            <body style={{ fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                {children}
            </body>
        </html>
    );
}
