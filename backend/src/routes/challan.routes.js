  import express from "express";
  import PDFDocument from "pdfkit";
  import db from "../db/database.js";
  import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";


  const router = express.Router();
  const API_BASE = "http://localhost:5000";

  /* ================= FETCH LOT DATA ================= */
  router.get("/lot/:lot", (req, res) => {
    const lot = req.params.lot;

    const items = db.prepare(`
      SELECT
        part_number,
        SUM(ai_count) AS quantity
      FROM box_sessions
      WHERE lot_number = ?
        AND status = 'completed'
      GROUP BY part_number
    `).all(lot);

    res.json({
      success: true,
      lot,
      items
    });
  });



  /* ================= GENERATE PDF ================= */
router.post("/pdf", (req, res) => {
  const {
    lot,
    customer,
    transporter,
    courierPartner,
    challanNo,
    pickupDate
  } = req.body;

  const items = db.prepare(`
    SELECT part_number, SUM(ai_count) AS quantity
    FROM box_sessions
    WHERE lot_number = ?
      AND status = 'completed'
    GROUP BY part_number
  `).all(lot);

  const boxCount = db.prepare(`
    SELECT COUNT(*) as count
    FROM box_sessions
    WHERE lot_number = ?
      AND status = 'completed'
  `).get(lot).count;

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Challan_Lot_${lot}.pdf`
  );

  doc.pipe(res);

  /* ========= TITLE ========= */
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("DELIVERY CHALLAN", { align: "center" });

  doc.moveDown(1.5);

  /* ========= META TABLE ========= */
  doc.fontSize(11).font("Helvetica");

  const metaStartY = doc.y;
  const rowGap = 20;

  doc.font("Helvetica-Bold").text("Customer Detail:", 40, metaStartY);
  doc.font("Helvetica").text(customer, 160, metaStartY);

  doc.font("Helvetica-Bold").text("Challan No:", 320, metaStartY);
  doc.font("Helvetica").text(challanNo, 420, metaStartY);

  doc.font("Helvetica-Bold").text("Transporter ID:", 40, metaStartY + rowGap);
  doc.font("Helvetica").text(transporter, 160, metaStartY + rowGap);

  doc.font("Helvetica-Bold").text("Pickup Date:", 320, metaStartY + rowGap);
  doc.font("Helvetica").text(pickupDate, 420, metaStartY + rowGap);

  doc.font("Helvetica-Bold").text("Courier Partner:", 40, metaStartY + rowGap * 2);
  doc.font("Helvetica").text(courierPartner, 160, metaStartY + rowGap * 2);

  doc.font("Helvetica-Bold").text("Lot No:", 320, metaStartY + rowGap * 2);
  doc.font("Helvetica").text(lot, 420, metaStartY + rowGap * 2);

  doc.font("Helvetica-Bold").text("No. of Boxes:", 40, metaStartY + rowGap * 3);
  doc.font("Helvetica").text(boxCount, 160, metaStartY + rowGap * 3);

  doc.moveDown(3);

  /* ========= TABLE HEADER ========= */
  const tableTop = doc.y;
  const colX = [40, 80, 160, 480];
  const rowHeight = 25;

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .rect(40, tableTop, 520, rowHeight)
    .stroke();

  doc.text("Sr No", colX[0] + 5, tableTop + 7);
  doc.text("Part Code", colX[1] + 5, tableTop + 7);
  doc.text("Name of Product / Service", colX[2] + 5, tableTop + 7);
  doc.text("Qty", colX[3] + 5, tableTop + 7);

  /* ========= TABLE ROWS ========= */
  doc.font("Helvetica").fontSize(11);

  items.forEach((item, i) => {
    const y = tableTop + rowHeight * (i + 1);

    doc.rect(40, y, 520, rowHeight).stroke();

    doc.text(i + 1, colX[0] + 5, y + 7);
    doc.text(item.part_number, colX[1] + 5, y + 7);
    doc.text("TESTING OK", colX[2] + 5, y + 7);
    doc.text(item.quantity, colX[3] + 5, y + 7);
  });

  doc.end();
});

import {
  BorderStyle,
  WidthType,
  TextRun,
} from "docx";

const borderedCell = (text, bold = false) =>
  new TableCell({
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold,
            size: 24, // bigger text
          }),
        ],
      }),
    ],
  });

const metaRow = (l1, v1, l2, v2) =>
  new TableRow({
    children: [
      borderedCell(l1, true),
      borderedCell(v1),
      borderedCell(l2, true),
      borderedCell(v2),
    ],
  });

const headerRow = (cells) =>
  new TableRow({
    children: cells.map((c) => borderedCell(c, true)),
  });

const normalRow = (cells) =>
  new TableRow({
    children: cells.map((c) => borderedCell(c)),
  });

router.post("/docx", async (req, res) => {
  const {
    lot,
    customer,
    transporter,
    courierPartner,
    challanNo,
    pickupDate
  } = req.body;

  const items = db.prepare(`
    SELECT part_number, SUM(ai_count) AS quantity
    FROM box_sessions
    WHERE lot_number = ?
      AND status = 'completed'
    GROUP BY part_number
  `).all(lot);

  const boxCount = db.prepare(`
    SELECT COUNT(*) as count
    FROM box_sessions
    WHERE lot_number = ?
      AND status = 'completed'
  `).get(lot).count;

  /* ================= META TABLE ================= */
  const metaTable = new Table({
    width: { size: 100, type: "pct" },
    rows: [
      metaRow("Customer Detail", customer, "Challan No", challanNo),
      metaRow("Transporter ID", transporter, "Pickup Date", pickupDate),
      metaRow("Courier Partner", courierPartner, "Lot No", lot),
      metaRow("No. of Boxes", String(boxCount), "", ""),
    ],
  });

  /* ================= ITEM TABLE ================= */
  const itemRows = [
    headerRow(["Sr No", "Part Code", "Name of Product / Service", "Qty"]),
    ...items.map((item, i) =>
      normalRow([
        String(i + 1),
        item.part_number,
        "TESTING OK",
        String(item.quantity),
      ])
    ),
  ];

  const itemTable = new Table({
    width: { size: 100, type: "pct" },
    rows: itemRows,
  });

  /* ================= DOCUMENT ================= */
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "DELIVERY CHALLAN",
            heading: "Heading1",
            alignment: "center",
          }),

          new Paragraph(""),

          metaTable,

          new Paragraph(""),

          itemTable,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Challan_Lot_${lot}.docx`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );

  res.send(buffer);
});


  export default router;