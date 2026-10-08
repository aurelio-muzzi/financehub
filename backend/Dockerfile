FROM php:8.4-fpm-alpine

# Instalar dependências de sistema e extensões PHP necessárias para PostgreSQL, bcmath e GD
RUN apk update && apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    oniguruma-dev \
    icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql pgsql bcmath mbstring gd zip intl opcache

# Obter Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configuração otimizada de OPcache
COPY opcache.ini /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini

WORKDIR /var/www/html

# Copiar código da aplicação
COPY . .

# Copiar e configurar script de entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Permissões de armazenamento do Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
