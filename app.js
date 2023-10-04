// app.js
const express = require("express");
const { downloadPDFs } = require("./scraper");

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/download-pdfs", async (req, res) => {
  const apiUrl = req.query.apiUrl; // Passing API URL as a query parameter
  const baseFileUrl = req.query.baseFileUrl; // Passing base file URL as a query parameter

  if (!apiUrl || !baseFileUrl) {
    return res.status(400).send("API URL and base file URL are required!");
  }

  try {
    await downloadPDFs(apiUrl, baseFileUrl);
    res.send("PDFs downloaded successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while downloading PDFs.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
