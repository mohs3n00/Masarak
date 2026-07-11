import { detectIntent, retrieveRelevantDocs } from './src/features/support/services/ragService.ts';

const tests = [
  { msg: "مين انت", expectedIntent: "CONVERSATIONAL", expectedRagDocs: 0 },
  { msg: "بترد ازاي", expectedIntent: "CONVERSATIONAL", expectedRagDocs: 0 },
  { msg: "شكرا", expectedIntent: "CONVERSATIONAL", expectedRagDocs: 0 },
  { msg: "عامل ايه", expectedIntent: "CONVERSATIONAL", expectedRagDocs: 0 },
  { msg: "ازاي اشترك", expectedIntent: "PLATFORM_QUERY", expectedRagDocs: 1 }, // at least 1
  { msg: "فين الامتحانات", expectedIntent: "PLATFORM_QUERY", expectedRagDocs: 1 },
  { msg: "نسيت كلمة المرور", expectedIntent: "PLATFORM_QUERY", expectedRagDocs: 1 },
  { msg: "ازاي ارفع واجب", expectedIntent: "PLATFORM_QUERY", expectedRagDocs: 1 },
];

let allPassed = true;

console.log("=== Running AI Pipeline Regression Tests ===\n");

for (const t of tests) {
  const intent = detectIntent(t.msg);
  let docs: any[] = [];
  if (intent === 'PLATFORM_QUERY') {
    docs = retrieveRelevantDocs(t.msg);
  }

  const intentPassed = intent === t.expectedIntent;
  const ragPassed = (t.expectedRagDocs === 0 && docs.length === 0) || (t.expectedRagDocs > 0 && docs.length > 0);
  
  if (intentPassed && ragPassed) {
    console.log(`✅ PASS | "${t.msg}" -> Intent: ${intent}, Docs: ${docs.length}`);
  } else {
    console.log(`❌ FAIL | "${t.msg}"`);
    console.log(`   Expected Intent: ${t.expectedIntent}, Got: ${intent}`);
    console.log(`   Expected Docs > 0: ${t.expectedRagDocs > 0}, Got Docs: ${docs.length}`);
    if (docs.length > 0) console.log("   Retrieved: ", docs.map(d => d.doc.question));
    allPassed = false;
  }
}

console.log(`\n=== Final Result: ${allPassed ? "ALL PASSED" : "FAILED"} ===`);
if (!allPassed) process.exit(1);
