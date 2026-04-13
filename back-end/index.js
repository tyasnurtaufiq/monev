const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes (harus di atas static files)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tahun", require("./routes/tahun"));
app.use("/api/program", require("./routes/program"));
app.use("/api/kegiatan", require("./routes/kegiatan"));
app.use("/api/subkegiatan", require("./routes/subkegiatan"));
app.use("/api/output", require("./routes/output"));
app.use("/api/belanja", require("./routes/belanja"));
app.use("/api/periode", require("./routes/periode"));
app.use("/api/monitoring", require("./routes/monitoring"));
app.use("/api/events", require("./routes/events"));
app.use("/api/reporting-window", require("./routes/reporting-window"));

// Serve front-end build (production)
const distPath = path.join(__dirname, "../front-end/dist");
app.use(express.static(distPath));

// SPA fallback — semua route non-API diarahkan ke index.html
app.get("{*path}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
