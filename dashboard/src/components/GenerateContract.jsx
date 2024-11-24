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
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    const addText = (text, x, y, width) => {
      const lines = doc.splitTextToSize(text, width || pageWidth - 2 * margin);
      lines.forEach((line) => {
        if (y + 10 > pageHeight - margin) {
          // Check if we're near the bottom of the page
          doc.addPage();
          y = margin; // Reset y to top margin
        }
        doc.text(line, x, y);
        y += 10; // Line spacing
      });
      return y;
    };

    let yPosition = margin;

    // Title - Centered
    doc.setFontSize(14);
    const title = "CATERING SERVICE AGREEMENT";
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, yPosition);
    yPosition += 20;

    // Agreement intro text
    doc.setFontSize(12);
    const introText = `FOOD CATERING SERVICE AGREEMENT (“Agreement”) dated ${eventDate}  is made between Cydney Thompson (the “Caterer”), and ******Clients Name***** (the “Client”), with an event at ****Event Location****, for the purpose of catering services. In consideration of the mutual obligations specified in this Agreement, the parties, intending to be legally bound hereby, agree to the following:`;

    yPosition = addText(introText, margin, yPosition);

    // Section 1: Services
    doc.setFontSize(12);
    doc.setTextColor(64, 64, 64);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("1. Services", margin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    const serviceText = [
      // `Name: ${name || "N/A"}`,
      `Event title: ${eventTitle || "N/A"}`,
      `Address: ${address || "N/A"}`,
      `Date: ${eventDate}`,
      `Start and End Time: ${startTime || "N/A"} - ${endTime || "N/A"}`,
      `Attendees: The Caterer agrees to provide Services for an estimated count of ${
        numberofguests || "N/A"
      } individuals for the Event. If this number increases, the total fee will be adjusted accordingly.`,
    ];
    `Menu: All requested food items are listed below. Any changes that increase the costs for the Caterer will be reflected in the total fee. Finalized menu items must be confirmed no later than 10 days prior to the Event.

        FOOD ITEMS:
        Steak and egg hash, stuffed French toast, fruit tray, and mock mimosas
        Chicken gyros with a Greek salad
        Chili lime shrimp wontons
        Charcuterie board
        Pan-seared fish with sweet potato mash and broccolini
        Mocktails: Faux-jitos
        Peach cobbler with ice cream`;
    serviceText.forEach((text) => {
      yPosition = addText(text, margin, yPosition);

      // return y + sectionSpacing;
    });

    // Section 2: Calculation of Fees
    doc.setFontSize(12);
    doc.setTextColor(64, 64, 64);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("2. Calculation of Fees", margin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    const feeText = [
      `In exchange for food service provided, the client agrees to pay the caterer a flat fee of $${totalAmount}.`,
      `Deposit: As part of this agreement, the caterer requires the client to pay 50% of the total fee which comes out to be $${deposit}.`,
    ];
    feeText.forEach((text) => {
      yPosition = addText(text, margin, yPosition);
    });

    // Section 3: Event Changes
    doc.setFontSize(12);
    doc.setTextColor(64, 64, 64);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("3. Event Changes", margin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    const changesText = [
      "After signing the agreement, changes to the event by the client can be made no sooner than 5 days prior to the Event.",
      "If there is a change or cancellation of the event by the client sooner than the cancellation period, then the deposit is refundable and $100 is nonrefundable.",
      "If changes or cancellation of the event is made after the cancellation period, then client forfeits the entire deposit.",
    ];

    changesText.forEach((text) => {
      yPosition = addText(text, margin, yPosition);
    });

    // Section 4: Payment
    doc.setFontSize(12);
    doc.setTextColor(64, 64, 64);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("4. Payment", margin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    const paymentText = [
      "The Client will be responsible to pay the caterer for the total amount by the event date.",
      "Methods of payment include: -Cash -Cash App -Apple Pay -Zelle",
    ];

    paymentText.forEach((text) => {
      yPosition = addText(text, margin, yPosition);
    });

    // Section 5: Miscellaneous
    const leftMargin = 20; // 1 inch = ~25 units in jsPDF
    const rightMargin = 180; // Page width - 1 inch
    const lineSpacing = 10; // Double-spacing adjustment
    doc.setFontSize(12);
    doc.setTextColor(64, 64, 64);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("5. Miscellaneous", margin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    const miscellaneousText = [
      "Independent Contractor: It is agreed that the Caterer will be considered an independent contractor for the purpose of this agreement, they maintain their own independent entity.",
      "Additional Services: Any additional service (“Additional Services”) must be requested by the Client in writing and are subject to rejection by the caterer should said request be impossible or inconvenient to meet. Should a request for additional services be accepted, the client agrees to pay for all fees charged by the Caterer for such.",
      "Additional Terms/Conditions:",
      "• Client to ensure the area is clean and prepared for Caterer upon arrival.",
      "• Caterer can provide to-go/Tupperware upon early notification to caterer (5 days).",
      "• Client to provide cutlery, tableware as needed, unless given 5-day notice to caterer to provide.",
    ];

    // Loop through miscellaneousText with proper formatting
    miscellaneousText.forEach((text) => {
      const textWidth = rightMargin - leftMargin; // Width for text wrapping
      const lines = doc.splitTextToSize(text, textWidth);

      if (text.startsWith("•")) {
        // Handle bullet points
        lines.forEach((line, index) => {
          const xOffset = index === 0 ? leftMargin + 5 : leftMargin; // Indent first line
          doc.text(line, xOffset, yPosition); // Add text
          yPosition += lineSpacing; // Line spacing for wrapped lines
        });
      } else {
        // Handle regular text
        lines.forEach((line) => {
          doc.text(line, leftMargin, yPosition); // Add text with normal margin
          yPosition += lineSpacing; // Line spacing
        });
      }

      // Add a new page if content exceeds the page height (A4 size: ~270 units)
      if (yPosition > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPosition = margin; // Reset yPosition for the new page
      }
    });

    //  // Add a new page before Section 6
    //  doc.addPage();
    //  yPosition = 30;

    // Section 6: Indemnification / Release
    doc.setFontSize(12);
    doc.setTextColor(64, 64, 64);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("6. Indemnification/ Release", margin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    const indemnificationText = [
      "Caterer agrees to take all necessary precautions to prevent injury to any persons or damage to property during the term of this Agreement. The caterer will not be held liable for direct, indirect, incidental or consequential damages (including but not limited to damages for lost prots, or increased expenses) with respect to any claim related to this agreement and the services provided Client agrees to take all necessary precautions to prevent injury to any persons or damage to property during the term of this Agreement, and shall indemnify, defend and hold harmless the Caterer, its officers, directors, shareholders, employees, representatives and/or agents from any claim, liability, loss, cost, damage, judgment, settlement or expense (including attorney’s fees) resulting from or arising in any way out of injury (including death) to any person or damage to property arising in any way out of any act, error, omission or negligence on the part of the Caterer or Caterer employees.",
      "This Agreement shall be effective on the date hereof and shall continue until terminated by either party upon 5 business days written notice.",
    ];

    indemnificationText.forEach((text) => {
      yPosition = addText(text, margin, yPosition);
    });

    // Signing Area
    yPosition += 20; // Add extra space before the signing area

    // Check if the signing area fits on the current page
    if (yPosition + 20 > pageHeight - margin) {
      doc.addPage(); // Add a new page if the current one overflows
      yPosition = margin; // Reset yPosition for the new page
    }

    doc.setFontSize(14);
    doc.setTextColor(64, 64, 64);
    doc.setFont("times", "bold");

    doc.text(
      "Client Signature: ________________________  Date: ______________",
      margin,
      yPosition
    );
    yPosition += 15;
    doc.text(
      "Caterer Signature: ______________________  Date: ______________",
      margin,
      yPosition
    );

    // // Footer
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
