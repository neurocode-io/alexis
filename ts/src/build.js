const fs = require('fs');
const path = require('path');

fs.copyFileSync(path.join('src', 'index.html'), path.join('dist', 'index.html'));
