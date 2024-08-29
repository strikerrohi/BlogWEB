from rest_framework import serializers
from .models import Post
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework import serializers
from .models import Article, UserArticleInteraction

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

from rest_framework import serializers
from .models import Comment, Reply

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ['id', 'reply', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'name', 'email', 'comment', 'created_at', 'replies']


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class UserArticleInteractionSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

    class Meta:
        model = UserArticleInteraction
        fields = ['article', 'is_liked', 'is_bookmarked']

# serializers.py
from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'author', 'date_created']
