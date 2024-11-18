import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"; // Use StandardFonts from pdf-lib

export default function GenerateContract({ bid, clientName }) {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { booking_id, estimated_bid_price: totalAmount, attendees } = bid;
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
  } = eventData;

  const deposit = (totalAmount * 0.5).toFixed(2);

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Use the correct font by embedding StandardFonts.Helvetica
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title - Centered
    const title = "CATERING SERVICE AGREEMENT";
    const titleWidth = font.widthOfTextAtSize(title, 14);
    const titleX = (width - titleWidth) / 2;
    page.drawText(title, { x: titleX, y: height - 30, size: 14, font });

    // Agreement intro text
    const introText = `FOOD CATERING SERVICE AGREEMENT (“Agreement”) dated ${eventDate} (the “Effective Date”) between Cydney Thompson (the “Caterer”), and ${clientName} (the “Client”) for the purpose of catering services in consideration of the mutual obligations specified in this Agreement, the parties, intending to be legally bound hereby, agree to the following:`;
    const introTextLines = wrapText(font, introText, 500);
    let yPosition = height - 60;
    introTextLines.forEach((line) => {
      page.drawText(line, { x: 30, y: yPosition, size: 12, font });
      yPosition -= 15;
    });

    // Section 1: Services
    page.drawText("1. Services", {
      x: 30,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0, 0, 1),
    });
    yPosition -= 15;
    const serviceText = [
      `Event title: ${eventTitle || "N/A"}`,
      `Address: ${address || "N/A"}`,
      `Date: ${eventDate}`,
      `Start and End Time: ${startTime || "N/A"} - ${endTime || "N/A"}`,
      "The food service to include client choice menu.",
      `Attendees: The Caterer agrees to provide Services for an estimated ${
        attendees || "N/A"
      } individuals for the EVENT. If this number of attendees should increase, the amount of the total fee shall be reflected in this agreement.`,
      "Menu: This shall include all requests made by the client and will be completed no sooner than 10 days prior to the Event. If any changes are needed that increases the costs for the Caterer, the Total Fee shall review.",
    ];
    serviceText.forEach((text) => {
      const lines = wrapText(font, text, 500);
      lines.forEach((line) => {
        page.drawText(line, { x: 30, y: yPosition, size: 12, font });
        yPosition -= 15;
      });
    });

    // Section 2: Calculation of Fees
    page.drawText("2. Calculation of Fees", {
      x: 30,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0, 0, 1),
    });
    yPosition -= 15;
    const feeText = [
      `In exchange for food service provided, the client agrees to pay the caterer a flat fee of $${totalAmount}.`,
      `Deposit: As part of this agreement, the caterer requires the client to pay 50% of full fee ($${deposit}) at the signing of this contract.`,
    ];
    feeText.forEach((text) => {
      const lines = wrapText(font, text, 500);
      lines.forEach((line) => {
        page.drawText(line, { x: 30, y: yPosition, size: 12, font });
        yPosition -= 15;
      });
    });

    // Section 3: Event Changes
    page.drawText("3. Event Changes", {
      x: 30,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0, 0, 1),
    });
    yPosition -= 15;
    const changesText = [
      "After signing the agreement, changes to the event by the client can be made no sooner than 5 days prior to the Event.",
      "If there is a change or cancellation of the event by the client sooner than the cancellation period, then the deposit is refundable and $100 is nonrefundable.",
      "If changes or cancellation of the event is made after the cancellation period, then client forfeits the entire deposit.",
    ];
    changesText.forEach((text) => {
      const lines = wrapText(font, text, 500);
      lines.forEach((line) => {
        page.drawText(line, { x: 30, y: yPosition, size: 12, font });
        yPosition -= 15;
      });
    });

    // Section 4: Cancellation Policy
    page.drawText("4. Cancellation Policy", {
      x: 30,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0, 0, 1),
    });
    yPosition -= 15;
    const cancellationText = [
      "The client may cancel this agreement up to 10 days prior to the event for a full refund of the deposit, minus a $100 cancellation fee.",
      "If cancellation occurs within 10 days of the event, the client forfeits the deposit in full.",
    ];
    cancellationText.forEach((text) => {
      const lines = wrapText(font, text, 500);
      lines.forEach((line) => {
        page.drawText(line, { x: 30, y: yPosition, size: 12, font });
        yPosition -= 15;
      });
    });

    const newPage = pdfDoc.addPage();
    const newPageWidth = newPage.getSize().width;
    const newPageHeight = newPage.getSize().height;
    const newPageFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let newPageYPosition = newPageHeight - 30;

    // Section 5: Indemnification
    page.drawText("5. Indemnification", {
      x: 30,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0, 0, 1),
    });
    yPosition -= 15;
    const indemnificationText = [
      "Both the Client and the Caterer agree to indemnify, defend, and hold harmless each other from any claims, damages, or losses arising from the performance of the agreement, except in cases of gross negligence or willful misconduct.",
    ];
    indemnificationText.forEach((text) => {
      const lines = wrapText(font, text, 500);
      lines.forEach((line) => {
        page.drawText(line, { x: 30, y: yPosition, size: 12, font });
        yPosition -= 15;
      });
    });

    // Section 6: Miscellaneous
    page.drawText("6. Miscellaneous", {
      x: 30,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0, 0, 1),
    });
    yPosition -= 15;
    const miscellaneousText = [
      "This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements, whether written or oral.",
      "This Agreement shall be governed by the laws of the state in which the event is held.",
      "Any disputes arising under this Agreement shall be resolved through mediation or binding arbitration.",
    ];
    miscellaneousText.forEach((text) => {
      const lines = wrapText(font, text, 500);
      lines.forEach((line) => {
        page.drawText(line, { x: 30, y: yPosition, size: 12, font });
        yPosition -= 15;
      });
    });

    // Section 7: Signature Section
    page.drawText("7. Signatures", {
      x: 30,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0, 0, 1),
    });
    yPosition -= 15;
    const signatureText = [
      "Caterer: ________________________",
      "Client: ________________________",
      "Date: ________________________",
    ];
    signatureText.forEach((text) => {
      page.drawText(text, { x: 30, y: yPosition, size: 12, font });
      yPosition -= 15;
    });

    // Footer
    const footer = `Signed by: ${clientName} (Client) - ${eventDate}`;
    page.drawText(footer, { x: 30, y: 30, size: 10, font });

    // Save the document
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${clientName}_Catering_Contract.pdf`;
    link.click();
  };

  // Utility function for text wrapping
  const wrapText = (font, text, maxWidth) => {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const width = font.widthOfTextAtSize(currentLine + word, 12);
      if (width < maxWidth) {
        currentLine += word + " ";
      } else {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      }
    });

    if (currentLine.trim()) lines.push(currentLine.trim());
    return lines;
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
