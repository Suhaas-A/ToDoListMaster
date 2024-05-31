from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from .models import Tasks
from Api.models import Users
from .serializers import TaskSerializer
from rest_framework.permissions import IsAuthenticated
import json
from datetime import datetime, MINYEAR, MAXYEAR, timedelta

# Create your views here.
class CreateListTask(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sorts = self.request.headers['Sort'].split(',')
        filters = json.loads(self.request.headers['Filter'])

        create_range = None
        start_create_date = (datetime.strptime(filters['rangeStartCreateDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['rangeStartCreateDate'] is not None else None
        end_create_date = (datetime.strptime(filters['rangeEndCreateDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['rangeEndCreateDate'] is not None else None
        create_date = (datetime.strptime(filters['createDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['createDate'] is not None else None
        print(sorts)

        if create_date != None:
            create_range = (create_date, create_date)
        elif start_create_date != None and end_create_date == None:
            create_range = (start_create_date, datetime(MAXYEAR, 12, 31))
        elif start_create_date == None and end_create_date != None:
            create_range = (datetime(MINYEAR, 1, 1), end_create_date)
        elif start_create_date != None and end_create_date != None:
            create_range = (start_create_date, end_create_date)

        due_range = None
        start_due_date = (datetime.strptime(filters['rangeStartDueDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['rangeStartDueDate'] is not None else None
        end_due_date = (datetime.strptime(filters['rangeEndDueDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['rangeEndDueDate'] is not None else None
        due_date = (datetime.strptime(filters['dueDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['dueDate'] is not None else None

        if due_date != None:
            due_range = (due_date, due_date)
        elif start_due_date != None and end_due_date == None:
            due_range = (start_due_date, datetime(MAXYEAR, 12, 31))
        elif start_due_date == None and end_due_date != None:
            due_range = (datetime(MINYEAR, 1, 1), end_due_date)
        elif start_due_date != None and end_due_date != None:
            due_range = (start_due_date, end_due_date)
        
        completion_range = None
        start_completion_date = (datetime.strptime(filters['rangeStartCompletionDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['rangeStartCompletionDate'] is not None else None
        end_completion_date = (datetime.strptime(filters['rangeEndCompletionDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['rangeEndCompletionDate'] is not None else None
        completion_date = (datetime.strptime(filters['completionDate'], '%Y-%m-%dT%H:%M:%S.%fZ').date() + timedelta(days=1)) if filters['completionDate'] is not None else None

        if completion_date != None:
            completion_range = (completion_date, completion_date)
        elif start_completion_date != None and end_completion_date == None:
            completion_range = (start_completion_date, datetime(MAXYEAR, 12, 31))
        elif start_completion_date == None and end_completion_date != None:
            completion_range = (datetime(MINYEAR, 1, 1), end_completion_date)
        elif start_completion_date != None and end_completion_date != None:
            completion_range = (start_completion_date, end_completion_date)
        
        return Tasks.objects.filter(
            user = self.request.user,
            name__in = filters['name'] if (None not in filters['name'] and len(filters['name']) > 0) else list(Tasks.objects.values_list('name', flat=True)),
            fulfilled__in = [filters['fulfilled']] if filters['fulfilled'] is not None else [True, False],
            create_date__range = create_range if create_range is not None else (datetime(MINYEAR, 1, 1), datetime(MAXYEAR, 12, 31)),
            due_date__range = due_range if due_range is not None else (datetime(MINYEAR, 1, 1), datetime(MAXYEAR, 12, 31)),
            completion_date__range = completion_range if completion_range is not None else (datetime(MINYEAR, 1, 1), datetime(MAXYEAR, 12, 31))
        ).all().order_by(*sorts if not '' in sorts else ['id'])

    def post(self, request):
        data = request.data

        user = self.request.user
        name = data['name']
        due_date = data['due_date']

        Tasks.save(
            Tasks(
                name = name,
                due_date = due_date,
                user = user
            )
        )

        return HttpResponse('Created Task Successfully')

class ViewUpdateDeleteTask(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tasks.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated]
