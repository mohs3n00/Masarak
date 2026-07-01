# Payments & Subscriptions Flow

This document details the backend contract for handling payments, course purchases, subscriptions, and coupons in Masarak. 

*Note: Since the specific payment gateway (e.g., Stripe, Paymob, Moyasar) is yet to be finalized, this architecture abstracts the payment provider via a generic contract.*

---

## Core Concepts

1. **Payment Intent**: A record created in the database *before* sending the user to the payment gateway. Tracks the pending transaction.
2. **Webhook**: The endpoint where the payment provider sends asynchronous success/failure updates.
3. **Enrollment**: Created automatically upon successful payment verification.
4. **Coupons**: Discounts applied to the checkout total before creating the payment intent.

---

## Payment Flow

### Step 1: Initialize Checkout
**Client Action**: User clicks "Pay Now" on a course.
**Endpoint**: `POST /payments/checkout`

**Request Body**:
```json
{
  "courseId": "uuid",
  "couponCode": "SUMMER50" (Optional)
}
```

**Backend Logic**:
1. Validate course exists and user is not already enrolled.
2. Calculate final price (apply coupon logic if provided).
3. Create a `Payment` record in the database with status `PENDING`.
4. Call the external Payment Gateway API to generate a checkout session/URL.
5. Return the Gateway URL to the client.

**Response**:
```json
{
  "paymentId": "uuid",
  "amount": 150.00,
  "currency": "SAR",
  "checkoutUrl": "https://gateway.com/pay/xyz123"
}
```

### Step 2: User Pays
User is redirected to `checkoutUrl`, enters card details, and submits. The gateway handles PCI compliance.

### Step 3: Webhook Verification (Asynchronous)
**External Action**: Payment Gateway calls our backend webhook.
**Endpoint**: `POST /payments/webhook`

**Backend Logic**:
1. Verify the webhook signature to ensure it legitimately came from the provider.
2. Extract the status (Success/Failed) and metadata (our `paymentId`).
3. If `SUCCESS`:
   - Update `Payment` record status to `COMPLETED`.
   - Create an `Enrollment` record linking the `userId` to the `courseId`.
   - Distribute funds logically (e.g., calculate Teacher Revenue share).
   - Fire event `payment.success` to trigger Email Receipt and Notification.
4. If `FAILED`:
   - Update `Payment` record status to `FAILED`.

### Step 4: Client Callback (Synchronous fallback)
**Client Action**: User is redirected from the gateway back to Masarak (`/payment/success?paymentId=...`).
**Endpoint**: `GET /payments/:id/status`

The client polls this endpoint or checks it once upon return to verify if the webhook processed the payment.

---

## Subscription Flow (If Applicable)

If Masarak supports recurring monthly subscriptions to unlock all courses instead of one-time purchases:

1. **Subscribe**: `POST /subscriptions`
   - Creates a recurring billing profile with the gateway.
   - Database creates a `Subscription` record with `currentPeriodEnd`.
2. **Webhook Event (`invoice.paid`)**:
   - Updates `Subscription.status` to `ACTIVE`.
   - Extends `currentPeriodEnd`.
3. **Access Check**:
   - `JwtAuthGuard` or `CourseGuard` checks if user has an `ACTIVE` subscription before allowing video playback.

---

## Coupons Architecture

**Endpoint**: `POST /payments/apply-coupon`
Validates a code and returns the new price to display on the frontend before checkout.

**Database Schema Logic**:
- `code`: Unique string (e.g., `MASARAK2024`).
- `discountType`: `PERCENTAGE` or `FIXED_AMOUNT`.
- `value`: The amount or percentage.
- `maxUses`: Limit total usage.
- `usedCount`: Track usage.
- `expiresAt`: Date constraint.
- `courseId`: (Optional) Restrict coupon to a specific course.
- `teacherId`: (Optional) Teacher who created the coupon.

**Validation Logic**:
- Check expiry date.
- Check `usedCount` < `maxUses`.
- If restricted to course, ensure checkout matches course.

---

## Earnings & Revenue Share (Teacher Dashboard)

When a payment succeeds, the system splits the revenue.
1. Total amount = 100 SAR.
2. Platform Fee = 20%.
3. Teacher Share = 80 SAR.

A record is created in a `TeacherEarning` ledger.
Teachers can request payouts via:
- `POST /teachers/payout-request`
