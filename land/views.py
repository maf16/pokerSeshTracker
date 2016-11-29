from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET


@require_GET
def index(request):
    ctx = {
        'isAuthenticated': request.user.is_authenticated,
        'user': request.user,
    }
    if request.user.is_authenticated:
        return redirect('user/', ctx)
    else:
        return render(request, 'land/index.html', ctx)
