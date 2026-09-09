const fs = require('fs');
let html = fs.readFileSync('/Volumes/DATA/SAASSCHOOL/iziBooking/unzipped_mockup/01-accueil.dc.html', 'utf8');

let match = html.match(/(<div style="min-height:100vh;[\s\S]*?)<\/x-dc>/);
if (!match) { console.log("No match"); process.exit(1); }
let body = match[1];

body = body.replace(/class="/g, 'className="');
body = body.replace(/stroke-width="/g, 'strokeWidth="');
body = body.replace(/stroke-linecap="/g, 'strokeLinecap="');
body = body.replace(/stroke-linejoin="/g, 'strokeLinejoin="');

body = body.replace(/style="([^"]*)"/g, (match, styleString) => {
    let styles = styleString.split(';').filter(s => s.trim() !== '');
    let objStr = styles.map(s => {
        let parts = s.split(':');
        let key = parts[0].trim();
        let val = parts.slice(1).join(':').trim(); // in case value has : like urls
        if(!key || val === undefined) return '';
        key = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        val = val.replace(/"/g, "'");
        return `${key}: "${val}"`;
    }).filter(Boolean).join(', ');
    return `style={{${objStr}}}`;
});

body = body.replace(/<input([^>]*[^/])>/g, '<input$1 />');
body = body.replace(/<img([^>]*[^/])>/g, '<img$1 />');
body = body.replace(/<br>/g, '<br />');
body = body.replace(/<hr>/g, '<hr />');

// Convert image-slot and strip custom attributes
body = body.replace(/<image-slot([^>]*)><\/image-slot>/g, (m, attrs) => {
    let newAttrs = attrs
        .replace(/id="[^"]*"/, '')
        .replace(/shape="[^"]*"/, '')
        .replace(/radius="[^"]*"/, '')
        .replace(/placeholder="[^"]*"/, '')
        .replace(/\s+/g, ' ');
    return `<img${newAttrs} alt="" />`;
});

// extract the styles from head
let styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
let css = styleMatch ? styleMatch[1] : '';

fs.writeFileSync('src/app/page.tsx', `
import Link from "next/link";
import prisma from "@/lib/prisma";
import { SearchBar } from "@/components/public/SearchBar";

export default async function Home() {
  const featuredProviders = await prisma.providerProfile.findMany({
    where: { isVerified: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      mediaLinks: {
        where: { type: "IMAGE" },
        take: 1
      }
    }
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`${css}\` }} />
      ${body}
    </>
  );
}
`);
