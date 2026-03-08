// Test using Supabase JS SDK auth.admin API for wizard data
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gyamsjmrrntwwcqljene.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YW1zam1ycm50d3djcWxqZW5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk1NDU5OCwiZXhwIjoyMDc1NTMwNTk4fQ.NH4Ssu6Rs00vD2GU5oAoakBUmp2NXdttgmmJTikU1WE',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  console.log('=== Testing Supabase JS SDK Methods ===\n');

  // 1. Test profiles read (we know this works)
  console.log('1️⃣ profiles read (known working)...');
  const { data: profiles, error: profileErr } = await supabase
    .from('profiles')
    .select('id, name')
    .limit(1);
  console.log(`   Result: ${profileErr ? '❌ ' + profileErr.message : '✅ ' + JSON.stringify(profiles?.[0])}`);

  if (!profiles?.[0]) return;
  const userId = profiles[0].id;

  // 2. Test auth.admin.listUsers
  console.log('\n2️⃣ auth.admin.listUsers...');
  const { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
  console.log(`   Result: ${usersErr ? '❌ ' + usersErr.message : '✅ found ' + usersData.users.length + ' users'}`);

  // 3. Test auth.admin.getUserById
  console.log('\n3️⃣ auth.admin.getUserById...');
  const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(userId);
  if (userErr) {
    console.log(`   ❌ ${userErr.message}`);
  } else {
    console.log(`   ✅ User: ${userData.user?.email}`);
    console.log(`   Metadata keys: ${Object.keys(userData.user?.user_metadata || {}).join(', ')}`);
  }

  // 4. Test auth.admin.updateUserById 
  console.log('\n4️⃣ auth.admin.updateUserById (write wizard_data to app_metadata)...');
  const testData = { wizard: { progress: { current_day: 0, status: 'test' }, days: [] } };
  const { data: updateData, error: updateErr } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: testData,
  });
  if (updateErr) {
    console.log(`   ❌ ${updateErr.message}`);
  } else {
    console.log(`   ✅ Updated! app_metadata.wizard: ${JSON.stringify(updateData.user?.app_metadata?.wizard).substring(0, 100)}`);
  }

  // 5. Read back
  console.log('\n5️⃣ Read back...');
  const { data: readBack } = await supabase.auth.admin.getUserById(userId);
  console.log(`   wizard data: ${JSON.stringify(readBack.user?.app_metadata?.wizard).substring(0, 100)}`);

  // 6. Clean up
  console.log('\n6️⃣ Cleaning up...');
  const { app_metadata } = readBack.user || {};
  if (app_metadata) {
    delete app_metadata.wizard;
    await supabase.auth.admin.updateUserById(userId, { app_metadata });
    console.log('   ✅ Cleaned');
  }

  console.log('\n=== End ===');
}

main().catch(e => console.error(e));
