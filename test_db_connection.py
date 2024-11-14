# import requests

# # Supabase credentials
# SUPABASE_URL = 'https://fuweslpktjohomwatlme.supabase.co'
# SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1d2VzbHBrdGpvaG9td2F0bG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NjYzNjksImV4cCI6MjA0NjE0MjM2OX0.BIzizQk-tOxf-M0e1UbU4C3J61xE5VvSz5qv7rKtAp0'

# def get_customers():
#     headers = {
#         'apikey': SUPABASE_ANON_KEY,
#         'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
#         'Content-Type': 'application/json',
#     }

#     # Adjust the URL to ensure correct casing of the table name
#     response = requests.get(f'{SUPABASE_URL}/rest/v1/Customers', headers=headers)

#     if response.status_code == 200:
#         print("API connection successful!")
#         customers_data = response.json()
#         print("Customers data:", customers_data)
#     else:
#         print(f"Error connecting to API: {response.status_code} - {response.text}")

# # Call the function to get customer data
# get_customers()


import psycopg2
import os

# Replace these variables with your actual credentials
DB_USER = 'postgres.fuweslpktjohomwatlme'
DB_PASSWORD = 'Olamide321xD$%'  # Use your actual password here
DB_HOST = 'aws-0-us-west-1.pooler.supabase.com'
DB_PORT = '6543'
DB_NAME = 'postgres'

def connect_to_db():
    try:
        # Connect to the database
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        print("Connection successful")
        return conn
    except psycopg2.OperationalError as e:
        print("Connection failed!")
        print(e)

# Call the connection function
if __name__ == '__main__':
    connect_to_db()
