/**
 * FireLives Premium Payment API - Backend Example
 * 
 * This file contains example backend API endpoints for handling
 * premium subscriptions with Stripe, PayPal, Apple Pay, and Google Pay
 */

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const router = express.Router();

// ============================================
// STRIPE INTEGRATION
// ============================================

/**
 * Create Stripe Checkout Session
 * POST /api/stripe/create-checkout
 */
router.post('/stripe/create-checkout', async (req, res) => {
    try {
        const { planId, userId } = req.body;
        
        // Map plan IDs to Stripe Price IDs
        const stripePriceIds = {
            'fyre': 'price_FYRE_MONTHLY',
            'pro': 'price_PRO_MONTHLY',
            'plus': 'price_PLUS_MONTHLY',
            'family': 'price_FAMILY_MONTHLY'
        };
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: stripePriceIds[planId],
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/premium`,
            client_reference_id: userId,
            metadata: {
                planId: planId,
                userId: userId
            },
            subscription_data: {
                metadata: {
                    planId: planId,
                    userId: userId
                }
            }
        });
        
        res.json({ 
            success: true, 
            sessionId: session.id,
            url: session.url 
        });
        
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 */
router.post('/stripe/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle different event types
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            await handleSuccessfulPayment(session);
            break;
            
        case 'customer.subscription.updated':
            const subscription = event.data.object;
            await updateSubscriptionStatus(subscription);
            break;
            
        case 'customer.subscription.deleted':
            const canceledSub = event.data.object;
            await handleSubscriptionCancellation(canceledSub);
            break;
            
        case 'invoice.payment_failed':
            const failedInvoice = event.data.object;
            await handlePaymentFailure(failedInvoice);
            break;
    }
    
    res.json({received: true});
});

/**
 * Cancel Stripe Subscription
 * POST /api/stripe/cancel-subscription
 */
router.post('/stripe/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });
        
        res.json({ 
            success: true, 
            subscription 
        });
        
    } catch (error) {
        console.error('Stripe cancellation error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============================================
// PAYPAL INTEGRATION
// ============================================

// Configure PayPal environment
const paypalEnvironment = new paypal.core.LiveEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);

/**
 * Create PayPal Subscription
 * POST /api/paypal/create-subscription
 */
router.post('/paypal/create-subscription', async (req, res) => {
    try {
        const { planId, userId } = req.body;
        
        // Map plan IDs to PayPal Plan IDs
        const paypalPlanIds = {
            'fyre': 'P-FYRE-PLAN-ID',
            'pro': 'P-PRO-PLAN-ID',
            'plus': 'P-PLUS-PLAN-ID',
            'family': 'P-FAMILY-PLAN-ID'
        };
        
        const request = new paypal.subscriptions.SubscriptionsCreateRequest();
        request.requestBody({
            plan_id: paypalPlanIds[planId],
            custom_id: userId,
            application_context: {
                brand_name: 'FireLives',
                locale: 'en-US',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'SUBSCRIBE_NOW',
                return_url: `${process.env.FRONTEND_URL}/premium/success`,
                cancel_url: `${process.env.FRONTEND_URL}/premium`
            }
        });
        
        const response = await paypalClient.execute(request);
        
        res.json({ 
            success: true, 
            subscriptionId: response.result.id,
            approvalUrl: response.result.links.find(link => link.rel === 'approve').href
        });
        
    } catch (error) {
        console.error('PayPal subscription error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Verify PayPal Subscription
 * POST /api/paypal/verify-subscription
 */
router.post('/paypal/verify-subscription', async (req, res) => {
    try {
        const { subscriptionId, userId } = req.body;
        
        const request = new paypal.subscriptions.SubscriptionsGetRequest(subscriptionId);
        const response = await paypalClient.execute(request);
        
        if (response.result.status === 'ACTIVE') {
            // Save subscription to database
            await saveSubscription({
                userId: userId,
                planId: response.result.plan_id,
                paymentMethod: 'paypal',
                paymentId: subscriptionId,
                status: 'active'
            });
            
            res.json({ 
                success: true, 
                subscription: response.result 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                error: 'Subscription not active' 
            });
        }
        
    } catch (error) {
        console.error('PayPal verification error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Cancel PayPal Subscription
 * POST /api/paypal/cancel-subscription
 */
router.post('/paypal/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        
        const request = new paypal.subscriptions.SubscriptionsCancelRequest(subscriptionId);
        request.requestBody({
            reason: 'User requested cancellation'
        });
        
        await paypalClient.execute(request);
        
        res.json({ 
            success: true 
        });
        
    } catch (error) {
        console.error('PayPal cancellation error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============================================
// APPLE PAY INTEGRATION
// ============================================

/**
 * Create Apple Pay Session
 * POST /api/apple-pay/session
 */
router.post('/apple-pay/session', async (req, res) => {
    try {
        const { validationURL } = req.body;
        
        // You need Apple Pay merchant certificate
        const merchantSession = await fetch(validationURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                merchantIdentifier: process.env.APPLE_MERCHANT_ID,
                displayName: 'FireLives',
                initiative: 'web',
                initiativeContext: process.env.FRONTEND_DOMAIN
            }),
            // Add your Apple Pay certificate here
            cert: process.env.APPLE_PAY_CERT,
            key: process.env.APPLE_PAY_KEY
        });
        
        const session = await merchantSession.json();
        res.json(session);
        
    } catch (error) {
        console.error('Apple Pay session error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Process Apple Pay Payment
 * POST /api/apple-pay/process
 */
router.post('/apple-pay/process', async (req, res) => {
    try {
        const { payment, planId, userId } = req.body;
        
        // Process payment token with your payment processor (e.g., Stripe)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: getPlanPrice(planId) * 100, // Convert to cents
            currency: 'usd',
            payment_method_data: {
                type: 'card',
                card: {
                    token: payment.token.paymentData
                }
            },
            confirm: true
        });
        
        if (paymentIntent.status === 'succeeded') {
            // Create subscription
            await saveSubscription({
                userId: userId,
                planId: planId,
                paymentMethod: 'apple',
                paymentId: paymentIntent.id,
                status: 'active'
            });
            
            res.json({ 
                success: true,
                status: ApplePaySession.STATUS_SUCCESS 
            });
        } else {
            res.json({ 
                success: false,
                status: ApplePaySession.STATUS_FAILURE 
            });
        }
        
    } catch (error) {
        console.error('Apple Pay processing error:', error);
        res.status(500).json({ 
            success: false,
            status: ApplePaySession.STATUS_FAILURE,
            error: error.message 
        });
    }
});

// ============================================
// GOOGLE PAY INTEGRATION
// ============================================

/**
 * Process Google Pay Payment
 * POST /api/google-pay/process
 */
router.post('/google-pay/process', async (req, res) => {
    try {
        const { paymentToken, planId, userId } = req.body;
        
        // Process payment token with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: getPlanPrice(planId) * 100,
            currency: 'usd',
            payment_method_data: {
                type: 'card',
                card: {
                    token: paymentToken
                }
            },
            confirm: true
        });
        
        if (paymentIntent.status === 'succeeded') {
            // Create subscription
            await saveSubscription({
                userId: userId,
                planId: planId,
                paymentMethod: 'google',
                paymentId: paymentIntent.id,
                status: 'active'
            });
            
            res.json({ 
                success: true,
                paymentIntent 
            });
        } else {
            res.status(400).json({ 
                success: false,
                error: 'Payment failed' 
            });
        }
        
    } catch (error) {
        console.error('Google Pay processing error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

/**
 * Get User Subscription
 * GET /api/subscription/:userId
 */
router.get('/subscription/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Query database for active subscription
        const subscription = await db.query(
            'SELECT * FROM subscriptions WHERE user_id = ? AND status = "active" ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        
        if (subscription.length > 0) {
            res.json({ 
                success: true, 
                subscription: subscription[0] 
            });
        } else {
            res.json({ 
                success: true, 
                subscription: null 
            });
        }
        
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Update Subscription Plan
 * POST /api/subscription/update
 */
router.post('/subscription/update', async (req, res) => {
    try {
        const { userId, newPlanId, currentSubscriptionId } = req.body;
        
        // Update subscription based on payment method
        // This is a simplified example
        
        res.json({ 
            success: true,
            message: 'Subscription updated successfully' 
        });
        
    } catch (error) {
        console.error('Update subscription error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function handleSuccessfulPayment(session) {
    const userId = session.client_reference_id;
    const planId = session.metadata.planId;
    const subscriptionId = session.subscription;
    
    await saveSubscription({
        userId: userId,
        planId: planId,
        paymentMethod: 'stripe',
        paymentId: subscriptionId,
        status: 'active'
    });
    
    // Send confirmation email
    await sendSubscriptionEmail(userId, planId);
}

async function updateSubscriptionStatus(subscription) {
    await db.query(
        'UPDATE subscriptions SET status = ? WHERE payment_id = ?',
        [subscription.status, subscription.id]
    );
}

async function handleSubscriptionCancellation(subscription) {
    await db.query(
        'UPDATE subscriptions SET status = "cancelled", end_date = NOW() WHERE payment_id = ?',
        [subscription.id]
    );
}

async function handlePaymentFailure(invoice) {
    const subscriptionId = invoice.subscription;
    
    // Notify user about payment failure
    await sendPaymentFailureEmail(subscriptionId);
}

async function saveSubscription(data) {
    await db.query(
        'INSERT INTO subscriptions (user_id, plan_id, payment_method, payment_id, status, start_date) VALUES (?, ?, ?, ?, ?, NOW())',
        [data.userId, data.planId, data.paymentMethod, data.paymentId, data.status]
    );
}

function getPlanPrice(planId) {
    const prices = {
        'fyre': 4.99,
        'pro': 9.99,
        'plus': 14.99,
        'family': 19.99
    };
    return prices[planId] || 0;
}

async function sendSubscriptionEmail(userId, planId) {
    // Implement email sending logic
    console.log(`Sending subscription confirmation to user ${userId} for plan ${planId}`);
}

async function sendPaymentFailureEmail(subscriptionId) {
    // Implement email sending logic
    console.log(`Sending payment failure notification for subscription ${subscriptionId}`);
}

module.exports = router;
