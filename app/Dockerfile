# Usa a imagem PHP com Apache
FROM php:8.2-apache

# Instala extensões do PHP necessárias para CI4
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilita mod_rewrite do Apache (necessário para CI4)
RUN a2enmod rewrite

# Copia todos os arquivos do projeto para o container
COPY . /var/www/html/

# Define diretório de trabalho
WORKDIR /var/www/html

# Ajusta permissões do writable (logs, cache, sessão)
RUN chown -R www-data:www-data /var/www/html/writable

# Configura DocumentRoot para a pasta public
RUN sed -i 's|/var/www/html|/var/www/html/public|' /etc/apache2/sites-available/000-default.conf
