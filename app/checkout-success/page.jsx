'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const vin = searchParams.get('vin');
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (vin && sessionId) {
            // Store payment status in localStorage
            const paymentKey = `payment_${vin}`;
            localStorage.setItem(paymentKey, JSON.stringify({
                paid: true,
                sessionId: sessionId,
                timestamp: Date.now()
            }));
            
            // Ensure report is in sessionStorage (in case it was cleared)
            const reportKey = `report_${vin}`;
            const existingReport = sessionStorage.getItem(reportKey);
            
            // Redirect to final report
            setTimeout(() => {
                // Use replace to avoid back button issues
                window.location.href = `/?vin=${encodeURIComponent(vin)}&paid=true`;
            }, 1500);
        } else {
            setError('Missing payment information');
            setLoading(false);
        }
    }, [vin, sessionId]);

    if (error) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <p style={{ color: '#E31937', fontSize: '18px' }}>{error}</p>
                <button
                    onClick={() => router.push('/')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#E31937',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '40px'
            }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 20px' }}>
                    <circle cx="32" cy="32" r="30" stroke="#E31937" strokeWidth="4" fill="none"/>
                    <path d="M20 32L28 40L44 24" stroke="#E31937" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 600,
                    margin: '0 0 12px 0',
                    color: '#111827'
                }}>Payment Successful!</h1>
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: 0
                }}>Redirecting to your Final Report...</p>
            </div>
        </div>
    );
}

export default function CheckoutSuccess() {
    return (
        <Suspense fallback={
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        }>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
