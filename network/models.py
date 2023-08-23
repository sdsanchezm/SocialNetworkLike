from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    user_username = models.CharField(max_length=100, default=None, blank=True, null=True)
    profilepic = models.CharField(max_length=500, default=None, blank=True, null=True)
    profilecomment = models.CharField(max_length=200, default=None, blank=True, null=True)

    def __str__(self):
        return f"username: {self.username}"

    def serializeProfile(self):
        user1 = User.objects.get(username=self.username)
        # [post.textpost for post in Post.objects.filter(pk__lte=2)]
        userPosts = Post.objects.filter(authorpost=user1)
        return {
            # "id": self.id,
            # "username": self.username,
            # "email": self.email,
            "post": [post.serialize() for post in userPosts]
        }

    def get_following(self):
        user1 = User.objects.get(username=self.username)
        # [post.textpost for post in Post.objects.filter(pk__lte=2)]
        userPosts = Post.objects.filter(authorpost=user1)
        return {
            "post": [post.serialize() for post in userPosts]
        }

class Post(models.Model):
    authorpost = models.ManyToManyField(User, blank=True, related_name="authoruser")
    textpost = models.CharField(max_length=300)
    timepost = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return f"authorpost: {self.authorpost} - timepost: {self.timepost}"

    def serializeProfile(self):
        # like1 = Like.objects.filter().count()
        return {
            "id": self.id,
            "authorpost": [user.username for user in self.authorpost.all()][0],
            "textpost": self.textpost,
            "timepost": self.timepost.strftime("%b %d %Y, %I:%M %p"),
            "likecount": Like.count_likes(self, self.id),
            # "likeduser": Like.is_author_of_like(self, self.authorpost.first().id, self.id)
            "likeduser": Like.user_has_liked(self, self.authorpost.first().id, self.id)
        }

    def serializeAll(self, userid):
        # like1 = Like.objects.filter().count()
        return {
            "id": self.id,
            "authorpost": [user.username for user in self.authorpost.all()][0],
            "textpost": self.textpost,
            "timepost": self.timepost.strftime("%b %d %Y, %I:%M %p"),
            "likecount": Like.count_likes(self, self.id),
            "likeduser": Like.user_has_liked(self, userid, self.id)
        }


class Like(models.Model):
    user_like = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_likes", default=None, blank=True, null=True)
    post_like = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes", default=None, blank=True, null=True)
    liked = models.BooleanField(default=False)

    def __str__(self):
        return f"user: {self.user_like} - post: {self.post_like}"

    def count_likes(self, postid):
        # pa = Post.objects.all()
        px = Post.objects.get(pk=postid)
        like1 = Like.objects.filter(post_like=px, liked__exact=True).count()
        # [user.username for post in pa]
        return like1

    def is_author_of_like(self, userid, postid):
        # pa = Post.objects.all()
        userlike1 = User.objects.get(pk=userid)
        postlike1 = Post.objects.get(pk=postid)
        like1 = Like.objects.filter(post_like=postlike1, user_like=userlike1, liked__exact=True).first()
        if like1 == None:
            return False
        else:
            return True

    def user_has_liked(self, userid, postid):
        userlike1 = User.objects.get(pk=userid)
        postlike1 = Post.objects.get(pk=postid)
        like1 = Like.objects.filter(post_like=postlike1, user_like=userlike1, liked__exact=True).first()
        if like1 == None:
            return False
        else:
            return True


class Follower(models.Model):
    # id = models.AutoField(primary_key=True)
    user_follower = models.ManyToManyField(User, blank=True, related_name="follower")
    user_following = models.ManyToManyField(User, blank=True, related_name="following")

    def __str__(self):
        return f"user_following: {self.user_following} - user_followwers: {self.user_follower}"

    def get_followers_of_user(self, userid):
        user1 = User.objects.get(pk=userid)
        f1 = Follower.objects.filter(user_follower=user1)
        return f1

    def is_following(followerid, followingid):
        follower1 = User.objects.get(pk=followerid)
        following1 = User.objects.get(pk=followingid)
        f1 = Follower.objects.filter(user_follower=follower1, user_following=following1).first()
        if f1 == None:
            return False
        else:
            return True



