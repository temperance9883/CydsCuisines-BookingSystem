from flask import Flask, render_template, request, send_from_directory
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
import html
import os

app = Flask(__name__)

# Function to generate the PDF
def generate_pdf(booking_data):
    c = canvas.Canvas("booking_confirmation.pdf", pagesize=letter)
    c.setFont("Helvetica", 12)

    c.drawString(1 * inch, 10.5 * inch, "Cyd's Cuisines Booking Confirmation")

    y = 10 * inch
    for key, value in booking_data.items():
        c.drawString(1 * inch, y, f"{key}: {value}")
        y -= 0.2 * inch

    c.save()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        booking_data = {
            "Name": request.form["name"],
            "Email": request.form["email"],
            "Event Date": request.form["event_date"],
            "Event Time": request.form["event_time"],
            "Number of Guests": request.form["num_guests"],
            "Menu": request.form["menu"],
            "Deposit": request.form["deposit"],
            "Total Cost": request.form["total_cost"]
        }

        generate_pdf(booking_data)
        return send_from_directory(os.getcwd(), "booking_confirmation.pdf", as_attachment=True)

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)