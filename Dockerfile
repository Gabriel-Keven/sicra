FROM php:8.2-apache

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    libicu-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP
# ADICIONADO: mysqli, que era a extensão que faltava
RUN docker-php-ext-install pdo pdo_mysql mysqli zip intl

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar o arquivo de configuração do Apache
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Habilitar mod_rewrite do Apache
RUN a2enmod rewrite

# Resolver o problema de "dubious ownership" do Git
RUN git config --global --add safe.directory /var/www/html

# Definir o diretório de trabalho
WORKDIR /var/www/html

# Copiar os arquivos da aplicação
COPY . .

# Instalar as dependências do Composer
RUN composer install --no-interaction --no-plugins --no-scripts

# Ajustar permissões
RUN chown -R www-data:www-data /var/www/html/writable

# Expor a porta
EXPOSE 80