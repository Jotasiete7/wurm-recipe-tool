const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260608_ocr_voting.sql');
const content = fs.readFileSync(sqlPath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('r.') || (line.includes('\br\b') && !line.includes('declare') && !line.includes('for r in'))) {
        console.log(`L${idx + 1}: ${line.trim()}`);
    }
});
