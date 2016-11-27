from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET


@require_GET
def index(request):
    if request.user.is_authenticated:
        return redirect('user/', {'isAuthenticated': request.user.is_authenticated})
    else:
        return render(request, 'land/index.html', {'isAuthenticated': request.user.is_authenticated})
