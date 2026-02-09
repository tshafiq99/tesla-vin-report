import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { vin, sessionId } = await request.json();

        if (!vin) {
            return NextResponse.json(
                { error: 'VIN is required' },
                { status: 400 }
            );
        }

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Stripe secret key not configured' },
                { status: 500 }
            );
        }

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Verify the session is paid and matches the VIN
        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { verified: false, error: 'Payment not completed' },
                { status: 403 }
            );
        }

        // Verify the VIN matches the session metadata
        if (session.metadata?.vin !== vin) {
            return NextResponse.json(
                { verified: false, error: 'VIN mismatch' },
                { status: 403 }
            );
        }

        return NextResponse.json({ 
            verified: true,
            sessionId: session.id,
            paymentStatus: session.payment_status
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { verified: false, error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
