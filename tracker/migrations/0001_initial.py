# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-29 02:59
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stake_level', models.CharField(choices=[('1/1', '1/1'), ('1/2', '1/2'), ('1/3', '1/3'), ('2/5', '2/5'), ('5/10', '5/10'), ('10/25', '10/25')], default='1/2', max_length=5)),
                ('game_type', models.CharField(choices=[('nlh', 'NLH'), ('plo', 'PLO'), ('mxg', 'Mixed games')], default='nlh', max_length=3)),
                ('casino_name', models.CharField(default='mint', max_length=50)),
                ('profit', models.IntegerField(default=0)),
                ('session_length', models.DecimalField(decimal_places=2, default=3, max_digits=5)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tracker.Player')),
            ],
        ),
    ]
