FROM nginx
RUN rm -rf /usr/share/nginx/html/index.html \
    /etc/nginx/nginx.conf \
    /etc/nginx/conf.d/default.conf

ADD fusion.conf /etc/nginx/conf.d/nginx.conf
ADD /dist/3rdpartylicenses.txt /usr/share/nginx/html/
ADD /dist/browser /usr/share/nginx/html/