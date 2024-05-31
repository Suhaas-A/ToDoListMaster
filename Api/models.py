from django.db import models
from Auth.models import Users

# Create your models here.
class Tasks(models.Model):
    name = models.TextField(unique=False, null=False)
    create_date = models.DateField(auto_now=True)
    due_date = models.DateField(auto_now=False, null=False, unique=False)
    fulfilled = models.BooleanField(default=False)
    completion_date = models.DateField(null=True, unique=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
