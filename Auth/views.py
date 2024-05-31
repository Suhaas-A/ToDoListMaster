from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from .models import Users
from.serializers import UserSerializer, ForgetPasswordSerializer
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
import random

# Create your views here.
class Register(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

    def post(self, request):
        data = request.data

        username = data.get('username')
        password = make_password(data.get('password'))
        email = data.get('email')

        usernames = []
        emails = []
        for user in Users.objects.all():
            usernames.append(user.username)
            emails.append(user.email)

        if username in usernames:
            return HttpResponse('Username already exists')
        
        if email in emails:
            return HttpResponse('Email already exists')
        
        Users.save(
            Users(
                username = username,
                password = password,
                email = email
            )
        )
        return HttpResponse('Registered the account successfully')
    
    def delete(self, request):
        for user in Users.objects.all():
            Users.delete(
                user
            )

        return HttpResponse('deleted all')

class ForgetPassword(generics.GenericAPIView):
    serializer_class = ForgetPasswordSerializer

    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = Users.objects.filter(username = username).first()

        if user is None:
            return HttpResponse('Invalid username')
        
        email = user.email

        otp = '{:05d}'.format(random.randint(0, 9999))

        send_mail(
            'Request for changing your password',
            '',
            'suhaas062010@gmail.com',  # Sender's email address
            [email],  # List of recipient(s)
            html_message=f'''<html>
                <body>
                    <p>
                        Hello, <br>
                        This is your code : <br>
                        <div style="font-size: 35px;">
                            <b><i>{int(otp)}</i></b>
                        </div>
                    </p>
                </body>
            </html>''',
            fail_silently=False,
        )

        return JsonResponse({'otp': otp, 'password': password, 'username': user.id})
    
class ResetPassword(generics.GenericAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

    def patch(self, request, pk):
        password = request.data['password']

        user = Users.objects.filter(id = pk).first()

        user.password = make_password(password)

        user.save()

        return HttpResponse('Successfully updated the password')
