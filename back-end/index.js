const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend Monev Running...");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tahun", require("./routes/tahun"));
app.use("/api/program", require("./routes/program"));
app.use("/api/kegiatan", require("./routes/kegiatan"));
app.use("/api/subkegiatan", require("./routes/subkegiatan"));
app.use("/api/output", require("./routes/output"));
app.use("/api/periode", require("./routes/periode"));
app.use("/api/monitoring", require("./routes/monitoring"));
app.use("/api/events", require("./routes/events"));
app.use("/api/reporting-window", require("./routes/reporting-window"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
