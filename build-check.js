#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para SPA...\n');

const checks = [
  {
    name: 'Archivo index.html',
    path: './index.html',
    required: true
  },
  {
    name: 'Configuración Netlify',
    path: './public/_redirects',
    required: false
  },
  {
    name: 'Configuración Vercel',
    path: './vercel.json',
    required: false
  },
  {
    name: 'Configuración Apache',
    path: './public/.htaccess',
    required: false
  },
  {
    name: 'Configuración Nginx',
    path: './nginx.conf',
    required: false
  },
  {
    name: 'Variables de entorno',
    path: './.env',
    required: true
  }
];

let allGood = true;

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  const status = exists ? '✅' : (check.required ? '❌' : '⚠️');
  const message = exists ? 'OK' : (check.required ? 'FALTA (REQUERIDO)' : 'No encontrado (opcional)');
  
  console.log(`${status} ${check.name}: ${message}`);
  
  if (check.required && !exists) {
    allGood = false;
  }
});

console.log('\n🔧 Variables de entorno requeridas:');
const envVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

if (fs.existsSync('./.env')) {
  const envContent = fs.readFileSync('./.env', 'utf8');
  envVars.forEach(envVar => {
    const hasVar = envContent.includes(envVar);
    console.log(`${hasVar ? '✅' : '❌'} ${envVar}`);
    if (!hasVar) allGood = false;
  });
} else {
  console.log('❌ Archivo .env no encontrado');
  allGood = false;
}

console.log('\n📋 Resumen:');
if (allGood) {
  console.log('✅ Todo parece estar configurado correctamente para SPA');
  console.log('\n🚀 Comandos recomendados:');
  console.log('   npm run build    # Construir para producción');
  console.log('   npm run preview  # Probar build localmente');
} else {
  console.log('❌ Se encontraron problemas que deben resolverse');
  console.log('\n📖 Para más información sobre deployment de SPA:');
  console.log('   - Netlify: https://docs.netlify.com/routing/redirects/');
  console.log('   - Vercel: https://vercel.com/guides/deploying-react-with-vercel');
  console.log('   - Apache: https://router.vuejs.org/guide/essentials/history-mode.html');
}

console.log('');
process.exit(allGood ? 0 : 1);