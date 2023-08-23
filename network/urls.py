
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # path("profile/all", views.profileall, name="all"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("profile1", views.profile1, name="profile1"),
    path("following", views.postfollowing, name="following"),
    path("profileafter", views.profileafter, name="profileafter"),

    # API Routes
    path("getprofile/<str:profilename>", views.getprofile, name="getprofile"),
    path("posts/all", views.allpost, name="allpost"),
    path("updatepost", views.updatepost, name="updatepost"),
    path("likepost", views.likepost, name="likepost"),
    path("post/<str:user_request>", views.postuser, name="postuser"),
    path("posts/create", views.createpost, name="createpost"),
    path("getloggeduser", views.getloggeduser, name="getloggeduser"),
    path("followuser", views.followuser, name="followuser"),
    path("getpostsfollowing", views.getpostsfollowing, name="getpostsfollowing"),
    path("posts/test", views.test, name="test")

]
