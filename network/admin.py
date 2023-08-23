from django.contrib import admin

from .models import User, Like, Post, Follower


class PostAdmin(admin.ModelAdmin):
    list_display = ("pk", "timepost")


class UserAdmin(admin.ModelAdmin):
    list_display = ("pk", "username")


class LikeAdmin(admin.ModelAdmin):
    list_display = ("pk",)


class FollowerAdmin(admin.ModelAdmin):
    list_display = ("pk",)


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Like, LikeAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Follower, FollowerAdmin)