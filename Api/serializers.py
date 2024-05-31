from rest_framework import serializers
from .models import Tasks

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = ['id', 'name', 'create_date', 'due_date', 'fulfilled', 'completion_date', 'user']
