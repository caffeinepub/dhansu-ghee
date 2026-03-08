# Dhansu Ghee

## Current State
A ghee e-commerce store with:
- Public storefront (home, product, about, contact)
- Shopping cart with Stripe checkout
- Admin panel at `/admin` with Internet Identity login and token-based admin access
- Backend authorization using a token system where the first caller with the correct CAFFEINE_ADMIN_TOKEN becomes admin

**Bug**: The `access-control.mo` `initialize` function only assigns admin role to unregistered principals. If a user logs in with Internet Identity and gets registered as a regular `#user` (because they logged in before entering the token, or entered the wrong token first), they can never become admin -- the function skips already-registered users entirely.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `access-control.mo` `initialize` function: Change logic so that providing the CORRECT admin token always upgrades the caller to admin, regardless of whether they are already registered. Wrong or missing token still only registers new users as `#user`.

### Remove
- Nothing

## Implementation Plan
1. Regenerate backend Motoko code with the fixed initialize logic:
   - If `userProvidedToken == adminToken`: always assign `#admin` role (works for both new and existing users)
   - If token is wrong/empty: only register if not already registered (assign `#user` to new users, skip existing users)
2. No frontend changes needed -- the existing admin token form already works correctly once the backend fix is in place
