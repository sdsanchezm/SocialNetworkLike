import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from .models import User, Post, Like, Follower


def index(request):
    if request.user.is_authenticated:
        return render(request, "network/index.html")

    # prompt to sign in if not yet
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")



# RENDER views =======================================


def postfollowing(request):
    if request.method == 'GET':
        # u1 = request.username
        # userprofile = User.objects.get(username=u1)
        return render(request, "network/index.html")

    else:
        return JsonResponse( {"message":"incorrect method."} )


# /profile #sds
@csrf_exempt
def profile(request, username):
    # if not request.user.is_authenticated:
    #     return render (request, "network/error.html", {
    #             "message": "Please Log in, you are not authorized to see this page."
    #         })
    if request.method == 'GET':
        # userprofile = User.objects.get(pk=request.user.id)
        # print(f"profilename: {profilename}")
        try:
            userprofile = User.objects.get(username=username)
        except User.DoesNotExist:
            return render (request, "network/error.html", {
                "message": "User does not exist."
            })
        # post1 = Post.objects.filter(authorpost=userprofile)
        # print(f"posts: {post1}")
        # profileinfo = {
            # 'username': userprofile.username
            # 'posttext': post1
        # }

        # return JsonResponse( userprofile.serializeProfile() )
        userfollower = User.objects.get(pk=request.user.id)
        followingCount = Follower.objects.filter(user_follower=userprofile).count()
        followersCount = Follower.objects.filter(user_following=userprofile).count()
        following_validation = Follower.is_following(request.user.id, userprofile.id)
        p1 = {
            "username1": userprofile.username,
            "userid": userprofile.id,
            "number_followers": followersCount,
            "number_following": followingCount,
            "is_followed": following_validation
        }
        return render(request, "network/profile.html", p1)
        # return HttpResponseRedirect(reverse('polls:results', args=(userid2,)))
        # return HttpResponseRedirect( reverse("profile", args=(userid2,) ) ) 

    if request.method == 'POST':
        userid2 = request.POST["userid2"]
        username2 = request.POST["username2"]
        print(f'userid2: {userid2}')
        print(f'userid2: {username2}')
        print("this is post mi perro")
        
        # return HttpResponseRedirect(reverse('profile', args=(username2,)))
        

    else:
        return JsonResponse( {"message":"incorrect method."} )
        # return render(request, "network/profile.html")

@csrf_exempt
def profile1(request):
    if request.method == 'POST':
        userid2 = request.POST["userid2"]
        username2 = request.POST["username2"]
        print(f'userid2: {userid2}')
        print(f'userid2: {username2}')
        print("this is post mi perro")
        return HttpResponseRedirect(reverse('profile', args=(username2,)))

    else:
        return render(request, "network/error.html", {"message": "error here"})

@csrf_exempt
def postfollowing(request):
    if request.method == 'GET':
        return render(request, "network/index.html")
    else:
        return JsonResponse({"message": "incorrect method."})

# sds
@csrf_exempt
def profileafter(request):
    if request.method == 'POST':
        user_logged = User.objects.get(pk=request.user.id)
        userid2 = request.POST["userid2"]
        print(f'userid2: {userid2}')
        user_to_follow = User.objects.get(pk=userid2)

        print(f'user_to_follow.username: {user_to_follow.username}')

        if request.user.id == userid2:
            return render(request, "network/error.html", {"message": "can not follow themselves"})
        
        flag = False
        try:
            follow_validation = Follower.objects.get(user_follower=user_logged, user_following=user_to_follow)
        except Follower.DoesNotExist:
            flag = True

        if flag  == True:
            follow1 = Follower()
            follow1.save()
            follow1.user_follower.add(user_logged)
            follow1.user_following.add(user_to_follow)

            return HttpResponseRedirect(reverse('profile', args=(user_to_follow.username,)))
            # return HttpResponseRedirect(reverse('profile', args=(user_to_follow.username,))) # profile redirect
            # return render(request, "network/profile.html")
        else:
            follow_validation.delete()
            return HttpResponseRedirect(reverse('profile', args=(user_to_follow.username,)))

        # return JsonResponse({"message":"user unfollowed successfully - (code followuser2)"})
        # return HttpResponseRedirect(reverse("profile")) # profile redirect
        return render(request, "network/profile.html")

    else:
        return render(request, "network/error.html", {"message": "incorrect method"})

# ===================================================
# API views =========================================
# ===================================================

# returns the user that is actually logged in
@csrf_exempt
@login_required
def getloggeduser(request):
    if request.method == 'GET':
        luser1 = request.user.username
        return JsonResponse( {"loggeduser1": luser1} )
    else:
        return JsonResponse( {"message": "wrong method"})

# return all post from everyone
@csrf_exempt
def allpost(request):
    if request.method == 'GET':
        user1 = User.objects.get(pk=request.user.id)
        posts1 = Post.objects.all()
        posts1 = posts1.order_by("-timepost").all()
        # p = Paginator(posts1, 10)
        # print(f"p.count: {p.count}")
        # print(f"p.num_pages: {p.num_pages}")
        return JsonResponse([post1.serializeAll(request.user.id) for post1 in posts1], safe=False)
    else:
        return JsonResponse({"message": "only GET method, sorry mi perro."})

# return the posts that whos author is the logged user [FIX] ==============
@csrf_exempt
@login_required
def postuser(request, user_request):
    if request.method == 'GET':
        user1 = User.objects.get(username=user_request)
        posts1 = Post.objects.filter(authorpost=user1)
        posts1 = posts1.order_by("-timepost").all()
        return JsonResponse([post1.serializeProfile() for post1 in posts1], safe=False)

    else:
        return JsonResponse( {"message":"incorrect method."} )

# The actual logged in user, Likes a specific post 
@csrf_exempt
def likepost(request):
    if request.method == 'POST':
        user1 = User.objects.get(pk=request.user.id)
        data = json.loads(request.body)
        # postidTest = data.get("postid", "")
        postid = data.get("postid", "")
        print(f"postidTestin Likepost: {postid}")
        post1 = Post.objects.get(pk=postid)
        flag = False
        try:
            likevalidate = Like.objects.get(user_like=user1, post_like=post1)
        except Like.DoesNotExist:
            flag = True

        if flag:
            like1 = Like(user_like=user1, post_like=post1, liked=True)
        else:
            likevalidate.liked = not likevalidate.liked
            likevalidate.save()
            return JsonResponse({"message":"done."})

        try:
            like1.save()
        except:
            return JsonResponse({"message":"error saving like."})
        
        return JsonResponse({"message":"post liked."})

    else:
        return JsonResponse( {"message":"incorrect method."} )

# follow from a logged user to an specific user, different from the requester/logged_user
@csrf_exempt
def followuser(request):
    if request.method == 'POST':
        user_logged = User.objects.get(pk=request.user.id)
        data = json.loads(request.body)
        userid = data.get("userid", "")
        user_to_follow = User.objects.get(pk=userid)

        if request.user.id == userid:
            return JsonResponse({"message": "Can not follow themselves - (code followuser0)"})
        
        flag = False
        try:
            follow_validation = Follower.objects.get(user_follower=user_logged, user_following=user_to_follow)
        except Follower.DoesNotExist:
            flag = True

        if flag  == True:
            follow1 = Follower()
            follow1.save()
            follow1.user_follower.add(user_logged)
            follow1.user_following.add(user_to_follow)

            return JsonResponse({"message": "user followed successfully - (code followuser1)"})
            # return HttpResponseRedirect(reverse("profile")) # profile redirect
        else:
            follow_validation.delete()

        return JsonResponse({"message":"user unfollowed successfully - (code followuser2)"})
        # return HttpResponseRedirect(reverse("profile")) # profile redirect

    else:
        return JsonResponse( {"message":"incorrect method. (code followuser3)"} )


# sds
# returns informatiuon of an specific userd 
# This piece is rendered from django, not by reactJs
def getprofile(request, profilename):
    if request.method == 'GET':
        # userprofile = User.objects.get(pk=request.user.id)
        print(f"profilename: {profilename}")
        try:
            userprofile = User.objects.get(username=profilename)
        except User.DoesNotExist:
            return render(request, "network/error.html", {
                "message": "user does not exist."
            })
        # post1 = Post.objects.filter(authorpost=userprofile)
        # print(f"posts: {post1}")
        # profileinfo = {
            # 'username': userprofile.username
            # 'posttext': post1
        # }

        return JsonResponse(userprofile.serializeProfile())
        # return render(request, "network/index.html")

    else:
        return JsonResponse({"message":"incorrect method."})
        # return render(request, "network/profile.html")

# Creates a new post
@csrf_exempt
@login_required
def createpost(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user1 = User.objects.get(pk=request.user.id)
        # print(f"data:", data, "user: ", request.user)
        # print(f"user1: ", user1)
        temp_text = data.get("textpost","")
        post1 = Post(textpost=temp_text)
        post1.save()
        post1.authorpost.add(user1)
        return JsonResponse({"message": "Record saved."})
    elif request.method == 'GET':
        return JsonResponse({"message": "No info here."})
    else:
        return JsonResponse({"error": "Method not supported."})


# Updates an actual post 
@csrf_exempt
@login_required
def updatepost(request):
    if request.method == 'PUT':
        data = json.loads(request.body)

        postid1 = data.get("postid","")
        post1 = Post.objects.get(pk=postid1)
        # print(f"data:", data, "user: ", request.user)
        # print(f"user1: ", user1)
        textpost1 = data.get("textpost","")
        post1.textpost = textpost1
        post1.save()

        return JsonResponse({"message": "Record updated."})
    else:
        return JsonResponse({"error": "Method not supported."})


# returns posts of the users followed by the logged user
@csrf_exempt
def getpostsfollowing(request):
    if request.method == 'GET':
        user1 = User.objects.get(pk=request.user.id)
        f1 = Follower.objects.filter(user_follower=user1)
        posts1 = Post.objects.filter(authorpost__in=[follower.user_following.get() for follower in f1])
        posts1 = posts1.order_by("-timepost").all()
        p = Paginator(posts1, 10)
        print(f"p.count: {p.count}")
        print(f"p.num_pages: {p.num_pages}")
        return JsonResponse([post1.serializeAll(request.user.id) for post1 in posts1], safe=False)
    else:
        return JsonResponse({"message": "only GET method, sorry mi perro."})


# General testing endpoin, no specific information is returned
@csrf_exempt
def test(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        dict1 = {
            "x1": "foo x1",
            "x2": "bar y2",
            "x3": "baz z3"
        }
        if not data:
            return JsonResponse({"message": "not data socio!"})
        print(f"data: {data}")
        # return JsonResponse({"message": "todo good from post!"})
        # return JsonResponse(data)
        return JsonResponse(dict1)
    elif request.method == 'GET':
        # return JsonResponse({"message": "This is get, man."})
        # return render(request, "network/test.html")
        return JsonResponse({"message": "this is json from get, in test"})
    else:
        return JsonResponse({"message": "Method not available."})



