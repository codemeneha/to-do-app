from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Todo
from .serializers import TodoSerializer


# --------------------
# READ – Get all todos
# --------------------
@api_view(['GET'])
def list_todos(request):
    todos = Todo.objects.all()
    serializer = TodoSerializer(todos, many=True)
    return Response(serializer.data)


# --------------------
# READ – Get single todo
# --------------------
@api_view(['GET'])
def get_todo(request, pk):
    try:
        todo = Todo.objects.get(pk=pk)
    except Todo.DoesNotExist:
        return Response(
            {"error": "Todo not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = TodoSerializer(todo)
    return Response(serializer.data)


# --------------------
# CREATE – Add todo
# --------------------
@api_view(['POST'])
def add_todo(request):
    serializer = TodoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------
# UPDATE – Edit todo
# --------------------
@api_view(['PUT'])
def update_todo(request, pk):
    try:
        todo = Todo.objects.get(pk=pk)
    except Todo.DoesNotExist:
        return Response(
            {"error": "Todo not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = TodoSerializer(todo, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------
# DELETE – Remove todo
# --------------------
@api_view(['DELETE'])
def delete_todo(request, pk):
    try:
        todo = Todo.objects.get(pk=pk)
    except Todo.DoesNotExist:
        return Response(
            {"error": "Todo not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    todo.delete()
    return Response(
        {"message": "Todo deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )
