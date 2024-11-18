import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function GenerateContract({ bid, clientName }) {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { booking_id, attendees, estimated_bid_price: totalAmount } = bid;
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleGeneratePDF = () => {
    generatePDF();
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    number_of_guests: numberofguests,
  } = eventData;
  const deposit = (totalAmount * 0.5).toFixed(2);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    // Title - Centered
    doc.setFontSize(14);
    const title = "CATERING SERVICE AGREEMENT";
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, 10);

    // Agreement intro text
    doc.setFontSize(12);
    const introText = `FOOD CATERING SERVICE AGREEMENT (“Agreement”) dated ${eventDate} (the “Effective Date”) between Cydney Thompson (the “Caterer”), and ${clientName} (the “Client”) for the purpose of catering services in consideration of the mutual obligations specified in this Agreement, the parties, intending to be legally bound hereby, agree to the following:`;
    const introTextLines = doc.splitTextToSize(introText, 180); // Adjust text wrapping width
    doc.text(introTextLines, 10, 20);

    // Section 1: Services
    let yPosition = 50;
    doc.setTextColor(0, 0, 255);
    doc.text("1. Services", 10, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    const serviceText = [
      `Event title: ${eventTitle || "N/A"}`,
      `Address: ${address || "N/A"}`,
      `Date: ${eventDate}`,
      `Start and End Time: ${startTime || "N/A"} - ${endTime || "N/A"}`,
      "The food service to include client choice menu.",
      `Attendees: The Caterer agrees to provide Services for an estimated ${
        numberofguests || "N/A"
      } individuals for the EVENT. If this number of attendees should increase, the amount of the total fee shall be reflected in this agreement.`,
      "Menu: This shall include all requests made by the client and will be completed no sooner than 10 days prior to the Event. If any changes are needed that increases the costs for the Caterer, the Total Fee shall review.",
    ];

    serviceText.forEach((text) => {
      const lines = doc.splitTextToSize(text, 180); // Adjust wrapping width
      doc.text(lines, 10, yPosition);
      yPosition += lines.length * 7;
    });

    // Section 2: Calculation of Fees
    doc.setTextColor(0, 0, 255);
    doc.text("2. Calculation of Fees", 10, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    const feeText = [
      `In exchange for food service provided, the client agrees to pay the caterer a flat fee of $${totalAmount}.`,
      `Deposit: As part of this agreement, the caterer requires the client to pay 50% of full fee ($${deposit}) at the signing of this contract.`,
    ];

    feeText.forEach((text) => {
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, yPosition);
      yPosition += lines.length * 7;
    });

    // Section 3: Event Changes
    doc.setTextColor(0, 0, 255);
    doc.text("3. Event Changes", 10, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    const changesText = [
      "After signing the agreement, changes to the event by the client can be made no sooner than 5 days prior to the Event.",
      "If there is a change or cancellation of the event by the client sooner than the cancellation period, then the deposit is refundable and $100 is nonrefundable.",
      "If changes or cancellation of the event is made after the cancellation period, then client forfeits the entire deposit.",
    ];

    changesText.forEach((text) => {
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, yPosition);
      yPosition += lines.length * 7;
    });

    // Section 4: Payment
    doc.setTextColor(0, 0, 255);
    doc.text("4. Payment", 10, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    const paymentText = [
      "The Client will be responsible to pay the caterer for the total amount by event date.",
      "Methods of payment include: -Cash -Cash App -Apple Pay -Zelle",
    ];

    paymentText.forEach((text) => {
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, yPosition);
      yPosition += lines.length * 7;
    });

    // Section 5: Miscellaneous
    doc.setTextColor(0, 0, 255);
    doc.text("5. MISCELLANEOUS", 10, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    const miscellaneousText = [
      "Independent Contractor: It is agreed that the Caterer will be considered an independent contractor for the purpose of this agreement, they maintain their own independent entity.",
      "Additional Services: Any additional service (“Additional Services”) must be requested by the Client in writing and are subject to rejection by the caterer should said request be impossible or inconvenient to meet. Should a request for additional services be accepted, the client agrees to pay for all fees charged by the Caterer for such.",
      "Additional Terms/Conditions:",
      "• Client to ensure the area is clean and prepared for Caterer upon arrival.",
      "• Caterer can provide to-go/Tupperware upon early notification to caterer (5 days).",
      "• Client to provide cutlery, tableware as needed, unless given 5-day notice to caterer to provide.",
    ];

    // Adding indentation for bulleted points
    miscellaneousText.forEach((text, index) => {
      if (text.startsWith("•")) {
        doc.text(text, 20, yPosition); // Indent bullet points
      } else {
        const lines = doc.splitTextToSize(text, 180);
        doc.text(lines, 10, yPosition);
      }
      yPosition += 10;
    });

    // Add a new page before Section 6
    doc.addPage();
    yPosition = 30;

    // Section 6: Indemnification / Release
    doc.setTextColor(0, 51, 153);
    doc.text("6. Indemnification / Release", 15, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    const indemnificationText = [
      "Caterer agrees to take all necessary precautions to prevent injury to any persons or damage to property during the term of this Agreement.",
      "The caterer will not be held liable for direct, indirect, incidental, or consequential damages (including but not limited to damages for lost profits or increased expenses) arising from any cause, including personal injuries, physical illness, or damage to property.",
    ];

    indemnificationText.forEach((line) => {
      const lines = doc.splitTextToSize(line, 180);
      doc.text(lines, 15, yPosition);
      yPosition += lines.length * 7;
    });

    // Footer
    // const footer = `Signed by: ${clientName} (Client) - ${eventDate}`;
    // doc.text(footer, 10, doc.internal.pageSize.height - 10);

    // Save the document
    doc.save(`${clientName}_Catering_Contract.pdf`);
  };

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Generate Contract
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Please review the information and generate the contract PDF for{" "}
              <span className="font-semibold text-blue-500">{clientName}</span>.
            </p>
            <button
              onClick={handleGeneratePDF}
              className="w-full mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Generate PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
