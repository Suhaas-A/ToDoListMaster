from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Users(AbstractUser):
    username = models.CharField(max_length=255, unique=True, null=False)
    password = models.CharField(max_length=255, unique=False, null=False)
    email = models.EmailField(max_length=255, unique=True, null=False)

    USERNAME_FIELD = 'username'
