from django.urls import path
from. import views
app_name = 'weather'

urlpatterns = [
    path('', views.home, name='home'),
    path('api/weather', views.get_weather, name='get_weather'),
    path('api/getforecast', views.get_forecast, name='getforecast'),
]