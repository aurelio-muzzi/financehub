#!/bin/sh
set -e

# Instalar dependências se vendor/autoload.php não existir
if [ ! -f /var/www/html/vendor/autoload.php ]; then
    echo "vendor/autoload.php não encontrado. Executando composer install..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Gerar APP_KEY se não estiver configurado
if [ -f /var/www/html/.env ]; then
    if ! grep -q "^APP_KEY=base64:" /var/www/html/.env 2>/dev/null; then
        echo "Gerando APP_KEY..."
        php artisan key:generate --force
    fi
fi

exec "$@"
