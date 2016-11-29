from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class Session(models.Model):
    # session stuff goes here
    profit = models.IntegerField()
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
