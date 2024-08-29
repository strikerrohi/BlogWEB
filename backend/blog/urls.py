from django.urls import path, include
from . import views
from .views import RegisterView, LoginView, technology_articles, CommentViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import toggle_like_article, toggle_bookmark_article, get_user_articles
from .views import BlogPostListCreateView
from .views import ChatbotAPIView

# Define the router and register the CommentViewSet
router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('posts/', views.PostList.as_view(), name='post_list'),
    path('posts/<int:pk>/', views.PostDetail.as_view(), name='post_detail'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('rest_framework.urls')),  # REST framework's built-in auth views
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('technology/', technology_articles, name='technology_articles'),
    path('', include(router.urls)),  # Include the router URLs
    path('toggle-like-article/<str:article_id>/', toggle_like_article, name='toggle_like_article'),
    path('toggle-bookmark-article/<int:article_id>/', toggle_bookmark_article, name='toggle_bookmark_article'),
    path('get-user-articles/', get_user_articles, name='get_user_articles'),
    path('/posts/', BlogPostListCreateView.as_view(), name='blogpost-list-create'),
    path('chatbot/', ChatbotAPIView.as_view(), name='chatbot'),

]

