import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function GenerateContract({ bid, clientName }) {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { booking_id, attendees, estimated_bid_price: totalAmount } = bid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(
          `http://127.0.0.1:5000/bookings/${booking_id}`
        );
        const event = await eventResponse.json();
        setEventData(event);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [booking_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!eventData) {
    return <div>Error: Missing event data</div>;
  }

  const {
    event_location: address,
    event_type: eventTitle,
    requested_date: eventDate,
    start_time: startTime,
    end_time: endTime,
  } = eventData;
  const deposit = (totalAmount * 0.5).toFixed(2); // Calculate 50% deposit

  const doc = new jsPDF();

  // Set font for general text
  doc.setFont("times", "normal");
  doc.setFontSize(12);

  // Title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("CATERING SERVICE AGREEMENT", 10, 10);

  doc.setFontSize(12);
  doc.text(
    `FOOD CATERING SERVICE AGREEMENT (“Agreement”) dated ${eventDate} (the “Effective Date”) between Cydney Thompson (the “Caterer”), and ${clientName} (the “Client”) for the purpose of catering services in consideration of the mutual obligations specified in this Agreement, the parties, intending to be legally bound hereby, agree to the following:`,
    10,
    20
  );

  // Section 1: Services
  doc.setTextColor(0, 0, 255); // Set color to light blue for section numbers
  doc.text("1. Services", 10, 30);
  doc.setTextColor(0, 0, 0); // Reset color to black

  doc.text(`Event title: ${eventTitle || "N/A"}`, 20, 40);
  doc.text(`Address: ${address || "N/A"}`, 20, 50);
  doc.text(`Date: ${eventDate}`, 20, 60);
  doc.text(
    `Start and End Time: ${startTime || "N/A"} - ${endTime || "N/A"}`,
    20,
    70
  );
  doc.text("The food service to include client choice menu.", 20, 80);
  doc.text(
    `Attendees: The Caterer agrees to provide Services for an estimated ${
      attendees || "N/A"
    } individuals for the event. If this number of attendees should increase, the amount of the total fee shall be reflected in this agreement.`,
    20,
    90
  );

  doc.text(
    `Menu: This shall include all requests made by the client and will be completed no sooner than 10 days prior to the Event. If any changes are needed that increases the costs for the Caterer, the Total Fee shall review.`,
    20,
    100
  );

  // Section 2: Calculation of Fees
  doc.setTextColor(0, 0, 255); // Set color to light blue for section numbers
  doc.text("2. Calculation of Fees", 10, 120);
  doc.setTextColor(0, 0, 0); // Reset color to black

  doc.text(
    `In exchange for food service provided, the client agrees to pay the caterer a flat fee of $${totalAmount} (“The total Amount”).`,
    20,
    130
  );
  doc.text(
    `Deposit: As part of this agreement, the caterer requires the client to pay 50% of full fee ($${deposit}) at the signing of this contract.`,
    20,
    140
  );

  // Save the generated contract as a PDF
  doc.save("Catering_Service_Agreement.pdf");

  return (
    <div>
      {/* Button to trigger the contract generation */}
      <button onClick={() => doc.save("Catering_Service_Agreement.pdf")}>
        Generate Contract
      </button>
    </div>
  );
}
