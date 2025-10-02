FROM php:8.2-apache

# Instalar dependências e extensões do PHP necessárias para o CI4
RUN apt-get update && apt-get install -y libicu-dev git unzip \
    && docker-php-ext-install intl mysqli pdo pdo_mysql

# Habilitar mod_rewrite do Apache e configurar para usar a pasta /public
RUN a2enmod rewrite \
    && sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && echo "<Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>" > /etc/apache2/conf-available/ci4.conf \
    && a2enconf ci4

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar os arquivos do projeto para dentro do container
COPY . .

# Ajustar permissões
RUN chown -R www-data:www-data /var/www/html
