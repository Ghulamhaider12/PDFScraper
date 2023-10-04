const express = require("express");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const PORT = 3000;

app.get("/download-pdfs", async (req, res) => {
  try {
    // Get API URL from query parameters
    const apiUrl = req.query.apiUrl;
    const baseFileUrl = req.query.baseFileUrl;

    if (!apiUrl || !baseFileUrl) {
      return res.status(400).send("apiUrl and baseFileUrl are required.");
    }

    // Fetch data from API
    const { data: pdfDataArray } = await axios.get(apiUrl);

    // Download and save each PDF
    for (const pdfData of pdfDataArray) {
      const pdfUrl = `${baseFileUrl}${pdfData.caseFileName}`;
      const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });

      // Ensure the directory exists
      await fs.ensureDir("downloaded_pdfs");

      // Save PDF to local directory
      const filePath = path.join(
        __dirname,
        "downloaded_pdfs",
        pdfData.caseFileName
      );
      await fs.writeFile(filePath, response.data);
      console.log(`PDF saved: ${pdfData.caseFileName}`);
    }

    res.send("PDFs downloaded successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
