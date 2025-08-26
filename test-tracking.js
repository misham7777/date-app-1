// Test script to verify database connection and add test data
// Run this in the browser console on your website

import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://xyfccngjyuoqsjhxrllg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZmNjbmdqeXVvcXNqaHhybGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzQwNDMsImV4cCI6MjA3MTcxMDA0M30.BJ83sUcv6A3xGruWqFi3tL0rzXuRakE3U0ilQbgLXeo'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test function to add a sample search
async function testAddSearch() {
  try {
    const { data, error } = await supabase
      .from('searches')
      .insert([{
        session_id: 'test_session_' + Date.now(),
        name: 'Test User',
        email: 'test@example.com',
        search_type: 'partner',
        source_page: 'home',
        user_agent: 'Test Browser',
        current_step: 1,
        total_steps: 3,
        started_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Error adding test search:', error)
      return
    }

    console.log('✅ Test search added successfully:', data)
    return data[0]
  } catch (error) {
    console.error('Error in testAddSearch:', error)
  }
}

// Test function to check if tables exist
async function testCheckTables() {
  try {
    // Check searches table
    const { data: searches, error: searchesError } = await supabase
      .from('searches')
      .select('*')
      .limit(1)

    if (searchesError) {
      console.error('❌ Searches table error:', searchesError)
    } else {
      console.log('✅ Searches table accessible')
    }

    // Check search_answers table
    const { data: answers, error: answersError } = await supabase
      .from('search_answers')
      .select('*')
      .limit(1)

    if (answersError) {
      console.error('❌ Search_answers table error:', answersError)
    } else {
      console.log('✅ Search_answers table accessible')
    }

    // Check search_drop_offs table
    const { data: dropOffs, error: dropOffsError } = await supabase
      .from('search_drop_offs')
      .select('*')
      .limit(1)

    if (dropOffsError) {
      console.error('❌ Search_drop_offs table error:', dropOffsError)
    } else {
      console.log('✅ Search_drop_offs table accessible')
    }

  } catch (error) {
    console.error('Error in testCheckTables:', error)
  }
}

// Run tests
console.log('🧪 Running database connection tests...')
testCheckTables().then(() => {
  console.log('📝 Adding test search...')
  return testAddSearch()
}).then((testSearch) => {
  if (testSearch) {
    console.log('🎉 All tests completed! Check your analytics dashboard now.')
  }
})
