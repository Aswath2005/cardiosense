/**
 * CardioSense - Supabase Connection Test
 * 
 * Run this in browser console to verify Supabase is working:
 * 1. Open DevTools (F12)
 * 2. Go to Console tab
 * 3. Copy and paste this entire code
 * 4. Press Enter
 * 
 * It will try to fetch from Supabase and show you any errors
 */

(async () => {
  console.log('🧪 Starting Supabase connection test...\n');

  try {
    // Test 1: Check if API route exists
    console.log('Test 1: Testing /api/predict endpoint...');
    const testData = {
      patientData: {
        age: 50,
        sex: 1,
        cp: 0,
        trestbps: 120,
        chol: 200,
        fbs: 0,
        restecg: 0,
        thalach: 150,
        exang: 0,
        oldpeak: 1.0,
        slope: 1,
        ca: 0,
        thal: 3,
      },
      userId: null, // No user logged in
    };

    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    console.log(`  Status: ${response.status} ${response.statusText}`);

    const result = await response.json();
    console.log('  Response:', result);

    if (response.ok) {
      console.log('✅ API endpoint working!\n');
    } else {
      console.error('❌ API returned error:', result.error);
    }

    // Test 2: Check Supabase browser client
    console.log('Test 2: Checking Supabase browser client...');
    
    // Import the supabase client from your app
    const { supabase } = await import('/lib/supabase.ts');
    
    console.log('  Supabase client initialized:', !!supabase);
    console.log('  Supabase URL:', supabase?.supabaseUrl);
    
    // Test 3: Try a simple query (no auth required)
    console.log('\nTest 3: Testing Supabase table access...');
    const { data, error } = await supabase
      .from('predictions')
      .select('COUNT(*)', { count: 'exact' });

    if (error) {
      console.error('❌ Error querying table:', error);
    } else {
      console.log('✅ Table accessible!');
      console.log('  Total predictions in database:', data?.length || 0);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  console.log('\n✅ Tests complete!');
})();
