import { serve } from "npm:@supabase/functions-js@2.1.5";
import Razorpay from "npm:razorpay@2.9.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const razorpay = new Razorpay({
      key_id: Deno.env.get('RAZORPAY_KEY_ID')!,
      key_secret: Deno.env.get('RAZORPAY_KEY_SECRET')!,
    });

    const { total, items, customerEmail, customerName, shippingAddress } = await req.json();

    console.log("Creating Razorpay Order with total:", total);

    const order = await razorpay.orders.create({
      amount: total * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    });

    console.log("Razorpay Order Created:", order);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    // Insert order into Supabase using service role key to bypass RLS
    const response = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        total,
        status: 'pending',
        order_id: order.id,
        customer_email: customerEmail,
        customer_name: customerName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order in database: ${response.statusText}`);
    }

    const supabaseData = await response.json();
    console.log('Inserted order into Supabase:', supabaseData);

    // Insert order items
    const orderItemsResponse = await fetch(`${supabaseUrl}/rest/v1/order_items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(
        items.map((item) => ({
          order_id: supabaseData[0].id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        }))
      ),
    });

    if (!orderItemsResponse.ok) {
      throw new Error(`Failed to create order items in database: ${orderItemsResponse.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true, order_id: order.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});