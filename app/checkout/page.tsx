"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { apiPost } from "@/utils/api";
import { useCart } from "../context/cartContext";
import { env } from "process";
import { log } from "console";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!pk) {
  throw new Error("Missing Stripe publishable key");
}

const stripePromise = loadStripe(pk);

function AddressAutocomplete({ onPlaceSelected }: { onPlaceSelected: (place: any) => void }) {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const token = typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    // load google script if not loaded
    const existing = document.getElementById("google-maps-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_FRONTEND_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !inputRef.current) return;
    const google = (window as any).google;
    if (!google) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: [] }, // restrict if you want: ['in']
    });

    autocomplete.setFields(["address_components", "formatted_address", "geometry"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    });

    // cleanup
    return () => google.maps.event.clearInstanceListeners(autocomplete);
  }, [loaded, onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Start typing address..."
      className="w-full px-3 py-2 border rounded focus:outline-none"
    />
  );
}

function CheckoutForm() {

   const { cart =[], clearCart } =  useCart() ?? {};
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [placeData, setPlaceData] = useState<any>(null);
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  // Example: compute amount from cart. For demo use fixed amount
  let amount: number = cart.reduce((sum: number, item: { price: number }) => sum + item.price, 0) * 100; // amount in INR paise? Stripe needs smallest currency unit; we'll use INR -> 5000 = ₹50.00 if currency INR.
  console.log('1 amount',amount);
  amount = parseInt(amount.toFixed(2)); 
  console.log('2 amount',amount);
  
  function parseAddressComponents(place: any) {
    const components = place?.address_components || [];
    const map: Record<string, string> = {};
    components.forEach((c: any) => {
      (c.types || []).forEach((t: string) => {
        map[t] = c.long_name;
      });
    });
    setLine1(map["street_number"] ? `${map["street_number"]} ${map["route"] || ""}`.trim() : place.formatted_address || "");
    setCity(map["locality"] || map["administrative_area_level_2"] || "");
    setPostalCode(map["postal_code"] || "");
    setCountry(map["country"] || "");
    setPlaceData(place);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    // 1) Create PaymentIntent on backend
    const shipping = {
      address: {
        line1,
        city,
        postal_code: postalCode,
        country,
      },
      name: placeData?.name || "Customer",
      phone: placeData?.formatted_phone_number || "",
    };

    try {
      const data:any = {
          amount, // smallest currency unit
          currency: env.CURRENCY || "INR",
          shipping,
          metadata: { email },
          items: cart, // send cart items for server-side amount verification
        };
      const createRes = await apiPost("payments/create-payment-intent", data);

      const { clientSecret,orderId, paymentIntentId } = createRes;

      // 2) Confirm card payment
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not found");
      const payment_method = {
        card,
        billing_details: {
          name: placeData?.name || "Customer",
          email,
          address: {
            line1,
            city,
            postal_code: postalCode, 
            country,
          },
        },
      };  
      console.log('payment_method details--',payment_method);

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: placeData?.name || "Customer",
            email,
            address: {
              line1,
              city,
              postal_code: postalCode,
              country,
            },
          },
        },
        shipping,
      });
      console.log('confirmResult',confirmResult);
      if (confirmResult.error) {
        setStatus("Payment failed: " + confirmResult.error.message);
        setLoading(false);
        return;
      }

      if (confirmResult.paymentIntent && confirmResult.paymentIntent.status === "succeeded") {
        // 3) optionally notify backend and create order record
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: confirmResult.paymentIntent.id,
            amount,
            currency: env.CURRENCY || "INR",
            shipping,
            metadata: { email },
            items: cart, // attach actual cart items here
          }),
        });
        if (clearCart) {
          clearCart();
        }
        setStatus("Payment successful! 🎉");
      } else {
        setStatus("Payment processing: " + confirmResult.paymentIntent?.status);
      }
    } catch (err: any) {
      setStatus("Error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      <label className="block mb-2 text-sm">Email</label>
      <input className="w-full border p-2 rounded mb-4" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label className="block mb-2 text-sm">Address</label>
      <AddressAutocomplete onPlaceSelected={(p) => parseAddressComponents(p)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <input className="border p-2 rounded" placeholder="Address line 1" value={line1} onChange={(e) => setLine1(e.target.value)} required />
        <input className="border p-2 rounded" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
        <input className="border p-2 rounded" placeholder="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>

      <label className="block mt-4 mb-2 text-sm">Card</label>
      <div className="border p-3 rounded mb-4">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-500">Amount</div>
          <div className="text-lg font-bold">₹{(amount / 100).toFixed(2)}</div>
        </div>

        <button
          disabled={!stripe || loading}
          className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay now"}
        </button>
      </div>

      {status && <div className="mt-4 text-center text-sm">{status}</div>}
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50 py-12">
        <CheckoutForm />
      </div>
    </Elements>
  );
}