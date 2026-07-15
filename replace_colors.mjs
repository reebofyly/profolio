import fs from 'fs';
import path from 'path';

const templatesDir = path.join(process.cwd(), 'src/app/u/[slug]/templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('Template.tsx'));

const colorMapping = [
  'indigo', 'amber', 'emerald', 'blue', 'pink', 'violet', 'purple'
];

files.forEach(file => {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  colorMapping.forEach(color => {
    const regex = new RegExp(`(bg|text|border|ring|shadow|from|via|to|fill|stroke)-${color}-([0-9]{2,3})(\\/[0-9]{1,3})?`, 'g');
    
    content = content.replace(regex, (match, prefix, shade, opacity) => {
      const shadeNum = parseInt(shade, 10);
      let newClass = `${prefix}-accent`;

      if (prefix === 'bg') {
        if (shadeNum <= 100) {
          return opacity ? `${prefix}-accent${opacity}` : `${prefix}-accent/10`;
        }
      }
      
      return opacity ? `${newClass}${opacity}` : newClass;
    });
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
});
