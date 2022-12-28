FROM tiangolo/uwsgi-nginx-flask:python3.8

#COPY conf/default.conf /etc/nginx/conf.d/default.conf

COPY ./requirements.txt /tmp

RUN pip install -r /tmp/requirements.txt
RUN mkdir -p /var/www/gedge-web-server/logs

ENV STATIC_PATH /app/apps/web/statics
ENV TEMPLATE_PATH /app/apps/web/templates

COPY ./app /app
