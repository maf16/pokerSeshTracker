import registration
from django.contrib.auth.decorators import login_required
from django.dispatch import receiver
from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET, require_POST
from models import Player, Session


@login_required(login_url='reg/login')
@require_GET
def index(request):
    ctx = {
        'isAuthenticated': request.user.is_authenticated,
        'user': request.user,
        'sessions': request.user.player.session_set.all()
    }
    return render(request, 'tracker/home.html', ctx)


@receiver(registration.signals.user_registered)
def register_new_player(sender, **kwargs):
    player = Player(user=kwargs['user'])
    player.save()


@require_POST
def submit_session(request):
    request.user.player.session_set.create(profit=request.POST['profit'], stake_level=request.POST['stakeLevel'],
                                           game_type=request.POST['gameType'], casino_name=request.POST['casinoName'],
                                           session_length=request.POST['sessionLength'],
                                           date_played=request.POST['sessionDate'])
    return redirect(index)


@require_GET
def view_session(request, session_id):
    # TODO: do not display unowned sessions to other users
    ctx = {
        'isAuthenticated': request.user.is_authenticated,
        'user': request.user,
        'session': request.user.player.session_set.get(id=session_id),
    }
    return render(request, 'tracker/session.html', ctx)


@require_POST
def amend_session(request, session_id):
    try:
        session = Session.objects.get(id=session_id)
        session.stake_level = request.POST['stakeLevel']
        session.game_type = request.POST['gameType']
        session.casino_name = request.POST['casinoName']
        session.session_length = request.POST['sessionLength']
        session.profit = request.POST['profit']
        session.date_played = request.POST['sessionDate']
        session.save()
    except Session.DoesNotExist:
        # TODO: error page session does not exists
        pass
    return redirect(index)


@require_GET
def remove_session(request, session_id):
    try:
        session = Session.objects.get(id=session_id)
        session.delete()
    except Session.DoesNotExist:
        # TODO: error page session does not exists
        pass
    return redirect(index)
