from django.shortcuts import render
import requests
from django.http import JsonResponse

# Create your views here.
api_key = "your api key"


def get_weather(request):

    city = request.GET.get('city')
    units = request.GET.get('unit')

    response = requests.get(f"https://api.openweathermap.org/data/2.5/weather?appid={api_key}&q={city}&units={units}")

    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data)
    else:
        print(f"Error: {response.status_code}")
        return JsonResponse({'error': 'Failed to retrieve weather data.'}, status=500)

def get_forecast(request):

    city = request.GET.get('city')
    units = request.GET.get('unit')

    response = requests.get(f"https://api.openweathermap.org/data/2.5/forecast?appid={api_key}&q={city}&units={units}")

    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data)
    else:
        print(f"Error: {response.status_code}")
        return JsonResponse({'error': 'Failed to retrieve weather data.'}, status=500)
    

def home(request):
    return render(request, 'weather/index.html')