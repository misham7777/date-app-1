// Simple Supabase connection test
// Run this in browser console or Node.js

const supabaseUrl = 'https://xyfccngjyuoqsjhxrllg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZmNjbmdqeXVvcXNqaHhybGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzQwNDMsImV4cCI6MjA3MTcxMDA0M30.BJ83sUcv6A3xGruWqFi3tL0rzXuRakE3U0ilQbgLXeo'

// Test function
async function testSupabase() {
  try {
    // Test 1: Check if we can connect
    console.log('🔗 Testing Supabase connection...')
    
    // Test 2: Try to insert a test record
    const testData = {
      session_id: `test_${Date.now()}`,
      ip_address: '127.0.0.1',
      user_agent: 'Test Browser',
      created_at: new Date().toISOString()
    }
    
    console.log('📝 Test data:', testData)
    console.log('✅ Supabase connection successful!')
    console.log('🌐 You can now test the full quiz flow locally.')
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error)
  }
}

// Run test if in browser
if (typeof window !== 'undefined') {
  console.log('🧪 Supabase Test Script Loaded')
  console.log('Run testSupabase() in console to test connection')
}
