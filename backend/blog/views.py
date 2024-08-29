from django.urls import path, include
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
import requests
from bs4 import BeautifulSoup
import logging
from .models import Post, Comment, Reply
from .serializers import PostSerializer, RegisterSerializer, CommentSerializer, ReplySerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Article, UserArticleInteraction
from .serializers import ArticleSerializer, UserArticleInteractionSerializer
from dotenv import load_dotenv

load_dotenv()
# Set up logging
logger = logging.getLogger(__name__)
from django.views import View
from django.http import JsonResponse
import requests
import os
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai


genai.configure(api_key=os.getenv("GEMINI_API_KEY",""))

# Mock function to simulate retrieving relevant documents
def get_relevant_docs(query):
    # Implement the logic to retrieve relevant passages
    paragraphs = [
    "Welcome to the IT Blog Management Chatbot! I can assist you with managing your blog posts. Here are some things I can help you with: 1. Creating a new blog post. 2. Updating an existing post. 3. Deleting a post. 4. Viewing all posts. 5. Searching for a post. 6. Getting help with using the system. Feel free to ask for help with any of these actions at any time!",

    "Creating a New Blog Post: To create a new blog post, I'll guide you through the following steps: 1. Provide the title of the blog post. 2. Enter the content of the post. You can also upload files such as markdown files or code snippets. 3. Optionally, add tags related to the content, like 'software development', 'cybersecurity', or 'cloud computing'. 4. Optionally, add categories or additional metadata. Once all the information is provided, your post will be successfully created.",

    "Updating an Existing Post: If you want to update an existing post, here's what you need to do: 1. Provide the title or ID of the post you want to update. 2. Specify what you want to update—title, content, tags, categories, or metadata. 3. Enter the new information for the chosen field(s). The post will be updated successfully with the new information.",

    "Deleting a Post: To delete a blog post, follow these steps: 1. Provide the title or ID of the post you wish to delete. 2. Confirm that you want to delete the post. Be aware that this action cannot be undone. The post will be permanently removed after confirmation.",

    "Viewing All Posts: You can view all your blog posts at any time. I'll provide a list of your posts, including titles, brief summaries, and dates. You can choose to view the details of any specific post or perform another action related to your posts.",

    "Searching for a Post: To search for a blog post, just enter a keyword or phrase. I'll return a list of posts that match your search, including titles and brief summaries. You can then choose to view the details of any matching post.",

    "Help: If you need assistance with using the system, I can guide you through the following: 1. Creating a new blog post. 2. Updating an existing post. 3. Deleting a post. 4. Viewing all posts. 5. Searching for a post. Let me know what you need help with!",

    "Fallback and Error Handling: If I didn't understand your input, I'll ask you to choose from the following options: 1. Creating a new blog post. 2. Updating an existing post. 3. Deleting a post. 4. Viewing all posts. 5. Searching for a post. This ensures that we stay on track and I can assist you properly.",

    "End of Interaction: When you're done, you can end the conversation by saying something like 'No, that’s all' or 'Goodbye'. I'll wish you a great day and remind you that I'm here if you need any more help in the future."
]

    return paragraphs

def make_rag_prompt(query, relevant_passage):
    relevant_passage = ' '.join(relevant_passage)
    prompt = (
        f"You are a helpful and informative chatbot that answers questions using text from the reference passage included below. "
        f"Respond in a complete sentence and make sure that your response is easy to understand for everyone. "
        f"Maintain a friendly and conversational tone. If the passage is irrelevant, feel free to ignore it.\n\n"
        f"QUESTION: '{query}'\n"
        f"PASSAGE: '{relevant_passage}'\n\n"
        f"ANSWER:"
    )
    return prompt

def generate_response(user_prompt):
    model = genai.GenerativeModel("gemini-1.5-flash")
    answer = model.generate_content(user_prompt)
    return answer.text

class ChatbotAPIView(APIView):

    def post(self, request, *args, **kwargs):
        query = request.data.get('query')
        query=query.lower()
        if not query:
            return Response({"error": "Query not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get relevant passages based on the query
            relevant_text = get_relevant_docs(query)
            # Create the prompt for the Gemini API
            prompt = make_rag_prompt(query, relevant_passage=relevant_text)

            # Generate the response using the Gemini API
            answer = generate_response(prompt)

            return Response({"answer": answer}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        print("Request data:", request.data)
        
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            print("Validation Error:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Create or get the token for the authenticated user
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

def technology_articles(request):
    url = 'https://medium.com/tag/technology'
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors
    except requests.RequestException as e:
        # Log the error
        logger.error(f"Failed to retrieve data from {url}. Error details: {e}")
        return JsonResponse({"error": "Failed to retrieve data", "details": str(e)}, status=500)

    soup = BeautifulSoup(response.content, 'html.parser')
    articles = []

    for post in soup.find_all('div', class_='postArticle'):
        title = post.find('h3').get_text() if post.find('h3') else 'No Title'
        link = post.find('a')['href'] if post.find('a') else 'No Link'
        author = post.find('a', class_='ds-link').get_text() if post.find('a', class_='ds-link') else 'No Author'
        preview = post.find('p').get_text() if post.find('p') else 'No Preview'
        
        articles.append({
            "title": title,
            "link": link,
            "author": author,
            "preview": preview,
        })

    return JsonResponse(articles, safe=False)

logger = logging.getLogger(__name__)

class CommentViewSet(viewsets.ModelViewSet):
    print("method called")
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    
    def create(self, request, *args, **kwargs):
        logger.debug("Received request data: %s", request.data)
        
        try:
            # Automatically assign the currently authenticated user to the comment
            # request.data['user'] = request.user.username

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            logger.info("Comment created successfully: %s", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except ValidationError as e:
            logger.error("Validation Error Details: %s", e.detail)
            return Response({'validation_errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            logger.error("Object Does Not Exist: %s", str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("General Error: %s", str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def update(self, request, *args, **kwargs):
        logger.debug("Received request data: %s", request.data)
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        try:
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            logger.info("Comment updated successfully: %s", serializer.data)
            return Response(serializer.data)

        except ValidationError as e:
            logger.error("Validation Error Details: %s", e.detail)
            return Response({'validation_errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            logger.error("Object Does Not Exist: %s", str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("General Error: %s", str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def reply(self, request,pk=None):
        print("method being called")
        comment = self.get_object()
        
        # Validate and extract data from the request
        reply_text = request.data.get('reply',None)
        if not reply_text:
            return Response({'error': 'Reply content is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create a reply object and assign the currently authenticated user
            print("reply creating")
            reply = Reply.objects.create(
                comment=comment,
                reply=reply_text,
                
 # Assign the currently authenticated user
 
            )
            print(reply)
            serializer = ReplySerializer(reply)
            logger.info("Reply created successfully: %s", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            logger.error("Validation Error Details: %s", e.detail)
            return Response({'validation_errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            logger.error("Object Does Not Exist: %s", str(e))
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error("General Error: %s", str(e))
            return Response({'error': 'An internal server error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def toggle_like_article(request, article_id):
    user = request.user
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)

    interaction, created = UserArticleInteraction.objects.get_or_create(user=user, article=article)
    interaction.is_liked = not interaction.is_liked
    interaction.save()

    return Response({"message": "Success"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def toggle_bookmark_article(request, article_id):
    user = request.user
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)

    interaction, created = UserArticleInteraction.objects.get_or_create(user=user, article=article)
    interaction.is_bookmarked = not interaction.is_bookmarked
    interaction.save()

    return Response({"message": "Success"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_articles(request):
    user = request.user
    interactions = UserArticleInteraction.objects.filter(user=user)
    serializer = UserArticleInteractionSerializer(interactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# views.py
from rest_framework import generics, permissions
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostListCreateView(generics.ListCreateAPIView):
    queryset = BlogPost.objects.all().order_by('-date_created')
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
