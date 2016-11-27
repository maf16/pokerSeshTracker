from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET


@require_GET
def index(request):
    ctx = {
        'isAuthenticated': request.user.is_authenticated,
        'user': request.user,
    }
    return render(request, 'tracker/home.html', ctx)
