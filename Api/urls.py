from django.urls import path
from .views import CreateListTask, ViewUpdateDeleteTask

urlpatterns = [
    path('create_list_task/', CreateListTask.as_view(), name='CREATE_LIST_TASK'),
    path('view_update_delete/<int:pk>/', ViewUpdateDeleteTask.as_view(), name='VIEW_UPDATE_DELETE_TASK'),
]
