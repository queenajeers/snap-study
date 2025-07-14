# app/worker.py


from celery import Celery

# Create Celery instance and configure it
celery_app = Celery("worker")
celery_app.config_from_object("celeryconfig")


import tasks
