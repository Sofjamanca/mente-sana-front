#!/bin/bash

echo "🚀 Desplegando Mente Sana App..."

# Construir el proyecto
echo "📦 Construyendo el proyecto..."
npm run build

# Transferir archivos al VPS (ajusta la IP y usuario)
echo "📤 Subiendo archivos al VPS..."
rsync -avz --delete dist/ usuario@tu-vps-ip:/var/www/mentesana/dist/

# Reiniciar PM2 en el VPS
echo "🔄 Reiniciando aplicación en el VPS..."
ssh usuario@tu-vps-ip "cd /var/www/mentesana && pm2 restart mentesana-app"

echo "✅ Despliegue completado!"
echo "🌐 Tu aplicación está disponible en: https://mentesana.app" 