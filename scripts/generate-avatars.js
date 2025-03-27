const fs = require('fs');
const path = require('path');

// Create avatars directory if it doesn't exist
const avatarsDir = path.join(__dirname, '../public/avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Generate SVG avatars
const generateAvatar = (name, color) => `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="${color}"/>
  <text x="50" y="50" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">
    ${name.substring(0, 2).toUpperCase()}
  </text>
</svg>
`;

const avatars = [
  { name: 'DevTeam AI', color: '#4F46E5' },
  { name: 'AI Research Labs', color: '#7C3AED' },
  { name: 'QuantAI Systems', color: '#2563EB' },
  { name: 'ML Forge', color: '#9333EA' }
];

// Generate and save avatars
avatars.forEach(({ name, color }) => {
  const fileName = name.toLowerCase().replace(/\s+/g, '');
  const filePath = path.join(avatarsDir, `${fileName}.svg`);
  fs.writeFileSync(filePath, generateAvatar(name, color));
});

console.log('Generated avatar images in public/avatars/'); 