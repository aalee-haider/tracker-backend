const express = require("express");
const cors = require("cors");
const csvWriter = require("csv-writer");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Create CSV writer
const createCsvWriter = csvWriter.createObjectCsvWriter({
  path: "bot_detections.csv",
  header: [
    { id: "ip", title: "IP" },
    { id: "user_agent", title: "User Agent" },
    { id: "timestamp", title: "Timestamp" },
    { id: "url", title: "URL" },
    { id: "page_content", title: "Page Content" },
    { id: "referrer", title: "Referrer" },
    { id: "keywords", title: "Keywords" },
    { id: "bot_type", title: "Bot Type" },
    { id: "detected", title: "Detected" },
  ],
});

// Helper function to log bot detection to CSV
async function logBotDetection(req, botType, detected) {
  const data = {
    ip: req.ip || req.connection.remoteAddress || "unknown",
    user_agent: req.get("User-Agent") || "",
    timestamp: new Date().toISOString(),
    url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    page_content: "Bot Detection API Endpoint",
    referrer: req.get("Referrer") || req.get("Referer") || "",
    keywords: JSON.stringify([
      "bot",
      "detection",
      "automation",
      botType.toLowerCase(),
    ]),
    bot_type: botType,
    detected: detected,
  };

  try {
    await createCsvWriter.writeRecords([data]);
    console.log("CSV log written successfully");
  } catch (error) {
    console.error("Error writing to CSV:", error);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home page with AI Bot Detection (ChatGPT & Gemini)
app.get("/", async (req, res) => {
  const userAgent = req.get("User-Agent") || "";
  console.log(`User-Agent: ${userAgent}`);
  const isChatGPT =
    userAgent.includes("ChatGPT-User/1.0; +https://openai.com/bot") ||
    userAgent.includes("GPTBot");
  const isGemini = userAgent.includes("Google") || userAgent.includes("Gemini");

  console.log(`Request received from User-Agent: ${userAgent}`);
  console.log(`Is ChatGPT Bot: ${isChatGPT}`);
  console.log(`Is Gemini Bot: ${isGemini}`);

  if (isChatGPT) {
    await logBotDetection(req, "ChatGPT", true);
    res.status(200).json({
      success: true,
      botType: "ChatGPT",
      message: "ChatGPT bot detected successfully!",
      userAgent: userAgent,
      timestamp: new Date().toISOString(),
      endpoint: "Home page (/) - AI Bot Detection Active",
      logged: "Detection logged to CSV file",
    });
  } else if (isGemini) {
    await logBotDetection(req, "Gemini", true);
    res.status(200).json({
      success: true,
      botType: "Gemini",
      message: "Gemini bot detected successfully!",
      userAgent: userAgent,
      timestamp: new Date().toISOString(),
      endpoint: "Home page (/) - AI Bot Detection Active",
      logged: "Detection logged to CSV file",
    });
  } else {
    await logBotDetection(req, "None", false);
    res.status(200).json({
      success: false,
      message: "No AI bot detected",
      userAgent: userAgent,
      timestamp: new Date().toISOString(),
      endpoint: "Home page (/) - AI Bot Detection Active",
      note: "This endpoint detects ChatGPT (ChatGPT-User/1.0; +https://openai.com/bot) and Gemini (Google) user agents",
      logged: "Request logged to CSV file",
    });
  }
});

// Endpoint to view CSV logs
app.get("/logs", (req, res) => {
  try {
    if (fs.existsSync("bot_detections.csv")) {
      const csvContent = fs.readFileSync("bot_detections.csv", "utf8");
      const lines = csvContent.split("\n");
      const header = lines[0];
      const data = lines
        .slice(1)
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const values = line.split(",");
          const record = {};
          header.split(",").forEach((col, index) => {
            record[col] = values[index] || "";
          });
          return record;
        });

      res.status(200).json({
        message: "Bot detection logs",
        totalRecords: data.length,
        data: data,
      });
    } else {
      res.status(200).json({
        message: "No logs found yet",
        totalRecords: 0,
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error reading logs",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}`);
  console.log(
    `AI Bot detection (ChatGPT & Gemini) is active on: http://localhost:${PORT}/`
  );
});

module.exports = app;
