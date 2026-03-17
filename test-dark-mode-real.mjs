#!/usr/bin/env node

// Este script prueba si el dark mode realmente funciona
// Simulando lo que next-themes hace en el navegador

import http from 'http';
import { JSDOM } from 'jsdom';

const PORT = 3000;

async function testDarkMode() {
  console.log('🧪 Testing Dark Mode - Real Simulation\n');
  console.log('═'.repeat(70));

  try {
    // Fetch the page
    const html = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/es`, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });

    // Fetch the CSS
    const cssMatch = html.match(/href="([^"]*\.css[^"]*)"/);
    if (!cssMatch) {
      console.log('❌ CSS file not found');
      process.exit(1);
    }

    const cssPath = cssMatch[1];
    const css = await new Promise((resolve, reject) => {
      const urlParts = new URL(`http://localhost:${PORT}${cssPath}`);
      http.get(urlParts, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });

    // Create a virtual DOM
    const dom = new JSDOM(html, {
      url: `http://localhost:${PORT}/es`,
      resources: 'usable',
      runScripts: 'dangerously',
    });

    const document = dom.window.document;
    const htmlElement = document.documentElement;

    // Inject CSS as a style tag to simulate how browser loads it
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Get initial computed styles (light mode)
    console.log('\n✓ Initial State (Light Mode):');
    const bodyLight = document.body;
    const bgLight = dom.window.getComputedStyle(bodyLight).backgroundColor;
    const textLight = dom.window.getComputedStyle(bodyLight).color;
    console.log(`  Body BG:   ${bgLight}`);
    console.log(`  Body Text: ${textLight}`);
    console.log(`  .dark class on html: ${htmlElement.classList.contains('dark') ? 'YES' : 'NO'}`);

    // Simulate adding .dark class (what next-themes does)
    console.log('\n✓ Adding .dark class to <html>...');
    htmlElement.classList.add('dark');
    console.log(`  .dark class on html: ${htmlElement.classList.contains('dark') ? 'YES' : 'NO'}`);

    // Get computed styles after adding dark mode
    const bgDark = dom.window.getComputedStyle(bodyLight).backgroundColor;
    const textDark = dom.window.getComputedStyle(bodyLight).color;
    console.log(`  Body BG:   ${bgDark}`);
    console.log(`  Body Text: ${textDark}`);

    // Check if colors changed
    console.log('\n' + '═'.repeat(70));
    console.log('\n📊 RESULTS:\n');

    const bgChanged = bgLight !== bgDark;
    const textChanged = textLight !== textDark;

    console.log(`Background changed: ${bgChanged ? '✅ YES' : '❌ NO'}`);
    console.log(`Text color changed: ${textChanged ? '✅ YES' : '❌ NO'}`);

    if (bgChanged && textChanged) {
      console.log('\n✅ DARK MODE WORKS! Colors change when .dark class is added.\n');
      console.log('The dark mode CSS is now properly configured with class-based selectors.');
      process.exit(0);
    } else {
      console.log('\n❌ DARK MODE NOT WORKING');
      console.log('\nThe .dark class is being added, but styles are not changing.');
      console.log('This could mean:');
      console.log('  1. Tailwind is not compiling with `darkMode: "class"`');
      console.log('  2. CSS selectors are still using @media queries');
      console.log('  3. There is a CSS specificity issue\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testDarkMode();
