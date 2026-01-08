from django.urls import path
from .views import (
    list_todos,
    get_todo,
    add_todo,
    update_todo,
    delete_todo
)

urlpatterns = [
    path('todos/', list_todos),                    # GET all
    path('todos/<int:pk>/', get_todo),             # GET one
    path('todos/add/', add_todo),                  # POST
    path('todos/update/<int:pk>/', update_todo),   # PUT
    path('todos/delete/<int:pk>/', delete_todo),   # DELETE
]
