import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PRODUCT_ID = process.env.STRIPE_PRODUCT_ID;
const PRICE_ID = process.env.STRIPE_PRICE_ID;

export async function POST(request) {
    try {
        const { vin } = await request.json();

        if (!vin) {
            return NextResponse.json(
                { error: 'VIN is required' },
                { status: 400 }
            );
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Stripe secret key not configured' },
                { status: 500 }
            );
        }

        if (!PRODUCT_ID || !PRICE_ID) {
            return NextResponse.json(
                { error: 'Stripe product or price ID not configured' },
                { status: 500 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout-success?vin=${encodeURIComponent(vin)}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?canceled=true`,
            metadata: {
                vin: vin,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
