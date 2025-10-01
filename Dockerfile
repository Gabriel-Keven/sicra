FROM php:8.1-apache

# Instala extensões necessárias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Ativa o mod_rewrite do Apache (necessário para CI4)
RUN a2enmod rewrite

# Copia os arquivos da aplicação para o container
COPY . /var/www/html/

# Permissões (ajuste conforme necessário)
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Substitui a config do Apache para servir a raiz corretamente
COPY apache.conf /etc/apache2/sites-available/000-default.conf
