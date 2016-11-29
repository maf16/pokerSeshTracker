from __future__ import unicode_literals

import datetime

import django
from django.contrib.auth.models import User
from django.db import models


STAKE_LEVEL = (
    ('1/1', '1/1'),
    ('1/2', '1/2'),
    ('1/3', '1/3'),
    ('2/5', '2/5'),
    ('5/10', '5/10'),
    ('10/25', '10/25'),
)

GAME_TYPE = (
    ('nlh', 'NLH'),
    ('plo', 'PLO'),
    ('mxg', 'Mixed games'),
)


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class Session(models.Model):
    # session stuff goes here
    stake_level = models.CharField(max_length=5, choices=STAKE_LEVEL, default='1/2')
    game_type = models.CharField(max_length=3, choices=GAME_TYPE, default='nlh')
    casino_name = models.CharField(max_length=50, default='mint')
    # date_played = models.DateTimeField(null=True)
    profit = models.IntegerField(default=0)
    session_length = models.DecimalField(decimal_places=2, max_digits=5, default=3)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
