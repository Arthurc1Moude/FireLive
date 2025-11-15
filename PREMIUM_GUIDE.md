# 🔥 FireLives Premium Subscription System

## 📋 Overview

Complete premium subscription system with 4 tiers and real payment API integration support.

---

## 💎 Premium Plans

### 1. **Fyre+ ($4.99/month)** 🔥
**Entry-level premium experience**

Features:
- ✅ Ad-free listening
- ✅ High quality audio (128kbps)
- ✅ Unlimited skips
- ✅ Offline mode (10 stations)
- ✅ Basic support

**Target Audience:** Casual listeners who want ad-free experience

---

### 2. **Pro+ ($9.99/month)** ⚡ [MOST POPULAR]
**Professional audio experience**

Features:
- ✅ Everything in Fyre+
- ✅ Ultra HD audio (320kbps)
- ✅ Unlimited offline stations
- ✅ Exclusive content
- ✅ Priority support
- ✅ Custom playlists

**Target Audience:** Music enthusiasts and daily users

---

### 3. **Plus+ ($14.99/month)** 💎
**Premium audiophile experience**

Features:
- ✅ Everything in Pro+
- ✅ Lossless audio (FLAC)
- ✅ Early access to new features
- ✅ Concert livestreams
- ✅ Artist meet & greets
- ✅ Premium support 24/7

**Target Audience:** Audiophiles and super fans

---

### 4. **Family+ ($19.99/month)** 👨‍👩‍👧‍👦
**Complete family solution**

Features:
- ✅ Everything in Plus+
- ✅ Up to 6 accounts
- ✅ Family mix playlists
- ✅ Parental controls
- ✅ Individual profiles
- ✅ Shared family library

**Target Audience:** Families and groups

---

## 💳 Payment Methods

### Supported Payment Providers:

1. **Stripe** 💳
   - Credit/Debit cards
   - Most popular payment gateway
   - PCI compliant
   - Supports 135+ currencies

2. **PayPal** 🅿️
   - PayPal balance
   - Credit/Debit cards via PayPal
   - Trusted by millions
   - Buyer protection

3. **Apple Pay** 🍎
   - One-tap payment
   - Secure with Face ID/Touch ID
   - iOS/macOS native
   - No card details shared

4. **Google Pay** 🔵
   - One-tap payment
   - Android native
   - Secure tokenization
   - Fast checkout

---

## 🔧 API Integration Guide

### 1. Stripe Integration

#### Setup:
```bash
npm install @stripe/stripe-js
```

#### Frontend Code:
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_live_YOUR_PUBLISHABLE_KEY');

// Create checkout session
const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        planId: selectedPlan.id,
        userId: user.id,
        priceId: 'price_XXXXX' // Stripe Price ID
    })
});

const session = await response.json();
await stripe.redirectToCheckout({ sessionId: session.id });
```

#### Backend (Node.js):
```javascript
const stripe = require('stripe')('sk_live_YOUR_SECRET_KEY');

app.post('/api/create-checkout-session', async (req, res) => {
    const { planId, userId, priceId } = req.body;
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: priceId,
            quantity: 1,
        }],
        mode: 'subscription',
        success_url: 'https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://yourdomain.com/premium',
        client_reference_id: userId,
        metadata: { planId }
    });
    
    res.json({ id: session.id });
});

// Webhook to handle successful payments
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_YOUR_WEBHOOK_SECRET');
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Update user subscription in database
        updateUserSubscription(session.client_reference_id, session.metadata.planId);
    }
    
    res.json({received: true});
});
```

---

### 2. PayPal Integration

#### Setup:
```bash
npm install @paypal/checkout-server-sdk
```

#### Frontend Code:
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&vault=true&intent=subscription"></script>

<div id="paypal-button-container"></div>

<script>
paypal.Buttons({
    createSubscription: function(data, actions) {
        return actions.subscription.create({
            'plan_id': 'P-XXXXX' // PayPal Plan ID
        });
    },
    onApprove: function(data, actions) {
        // Save subscription ID to backend
        fetch('/api/paypal-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subscriptionID: data.subscriptionID,
                userId: user.id
            })
        });
    }
}).render('#paypal-button-container');
</script>
```

#### Backend (Node.js):
```javascript
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal environment
const environment = new paypal.core.LiveEnvironment(
    'YOUR_CLIENT_ID',
    'YOUR_CLIENT_SECRET'
);
const client = new paypal.core.PayPalHttpClient(environment);

app.post('/api/paypal-subscription', async (req, res) => {
    const { subscriptionID, userId } = req.body;
    
    // Verify subscription with PayPal
    const request = new paypal.subscriptions.SubscriptionsGetRequest(subscriptionID);
    const response = await client.execute(request);
    
    if (response.result.status === 'ACTIVE') {
        // Update user subscription in database
        await updateUserSubscription(userId, response.result.plan_id);
        res.json({ success: true });
    }
});
```

---

### 3. Apple Pay Integration

#### Frontend Code:
```javascript
// Check if Apple Pay is available
if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
    const paymentRequest = {
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS'],
        total: {
            label: selectedPlan.name,
            amount: selectedPlan.price.toString()
        }
    };
    
    const session = new ApplePaySession(3, paymentRequest);
    
    session.onvalidatemerchant = async (event) => {
        const merchantSession = await fetch('/api/apple-pay-session', {
            method: 'POST',
            body: JSON.stringify({ validationURL: event.validationURL })
        }).then(r => r.json());
        
        session.completeMerchantValidation(merchantSession);
    };
    
    session.onpaymentauthorized = async (event) => {
        const result = await fetch('/api/process-apple-pay', {
            method: 'POST',
            body: JSON.stringify({
                payment: event.payment,
                planId: selectedPlan.id
            })
        }).then(r => r.json());
        
        session.completePayment(result.status);
    };
    
    session.begin();
}
```

---

### 4. Google Pay Integration

#### Setup:
```html
<script src="https://pay.google.com/gp/p/js/pay.js"></script>
```

#### Frontend Code:
```javascript
const paymentsClient = new google.payments.api.PaymentsClient({
    environment: 'PRODUCTION'
});

const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA']
        },
        tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
                gateway: 'stripe',
                'stripe:version': '2020-08-27',
                'stripe:publishableKey': 'pk_live_YOUR_KEY'
            }
        }
    }],
    merchantInfo: {
        merchantId: 'YOUR_MERCHANT_ID',
        merchantName: 'FireLives'
    },
    transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: selectedPlan.price.toString(),
        currencyCode: 'USD'
    }
};

const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
// Process payment token with your backend
```

---

## 🗄️ Database Schema

### Subscriptions Table:
```sql
CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_id VARCHAR(50) NOT NULL, -- 'fyre', 'pro', 'plus', 'family'
    status VARCHAR(20) NOT NULL, -- 'active', 'cancelled', 'expired'
    payment_method VARCHAR(20), -- 'stripe', 'paypal', 'apple', 'google'
    payment_id VARCHAR(255), -- External payment/subscription ID
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_subscription ON subscriptions(user_id, status);
CREATE INDEX idx_payment_id ON subscriptions(payment_id);
```

### Plans Table:
```sql
CREATE TABLE plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_period VARCHAR(20) DEFAULT 'monthly',
    features JSON,
    stripe_price_id VARCHAR(255),
    paypal_plan_id VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Security Best Practices

1. **Never store payment details**
   - Use tokenization from payment providers
   - Store only payment method IDs

2. **Webhook verification**
   - Always verify webhook signatures
   - Use HTTPS for webhook endpoints

3. **PCI Compliance**
   - Use certified payment providers
   - Never handle raw card data

4. **Subscription validation**
   - Verify subscription status on every request
   - Implement server-side checks

5. **Rate limiting**
   - Limit payment attempts
   - Prevent abuse

---

## 📊 Analytics & Tracking

### Key Metrics to Track:

1. **Conversion Rate**
   - Free to paid conversion
   - Plan upgrade rate

2. **Churn Rate**
   - Monthly cancellations
   - Reasons for cancellation

3. **Revenue Metrics**
   - MRR (Monthly Recurring Revenue)
   - ARPU (Average Revenue Per User)
   - LTV (Lifetime Value)

4. **Popular Plans**
   - Most subscribed plan
   - Upgrade/downgrade patterns

---

## 🧪 Testing

### Test Cards (Stripe):
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

### PayPal Sandbox:
- Use PayPal sandbox accounts
- Test subscription flows

### Apple Pay:
- Use Safari on iOS/macOS
- Test with sandbox merchant ID

### Google Pay:
- Use TEST environment
- Test with test cards

---

## 🚀 Deployment Checklist

- [ ] Set up production payment API keys
- [ ] Configure webhook endpoints
- [ ] Set up SSL certificates
- [ ] Test all payment flows
- [ ] Set up subscription management
- [ ] Configure email notifications
- [ ] Set up analytics tracking
- [ ] Test cancellation flows
- [ ] Set up customer support
- [ ] Create refund policy
- [ ] Legal compliance (terms, privacy)
- [ ] Set up monitoring/alerts

---

## 📞 Support

For payment integration support:
- **Stripe:** https://stripe.com/docs
- **PayPal:** https://developer.paypal.com
- **Apple Pay:** https://developer.apple.com/apple-pay
- **Google Pay:** https://developers.google.com/pay

---

## 🎯 Next Steps

1. Choose your payment provider(s)
2. Set up merchant accounts
3. Implement backend API endpoints
4. Test payment flows thoroughly
5. Deploy to production
6. Monitor and optimize

---

**Built with ❤️ for FireLives Premium**
