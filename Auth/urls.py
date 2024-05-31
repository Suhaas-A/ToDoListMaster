from django.urls import path
from .views import Register, ForgetPassword, ResetPassword
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
     path('register/', Register.as_view(), name='REGISTER'),
     path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('forget_password/', ForgetPassword.as_view(), name='FORGET_PASSWORD'),
     path('reset_password/<int:pk>', ResetPassword.as_view(), name='RESET_PASSWORD'),
]
