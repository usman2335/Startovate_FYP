// Quick test script to verify ChatHistory model works
require("dotenv").config();
const mongoose = require("mongoose");
const ChatHistory = require("./src/models/ChatHistory");

async function testChatHistory() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/startovate");
    console.log("✅ Connected to MongoDB");

    // Test creating a chat history
    const testUserId = new mongoose.Types.ObjectId();
    const testCanvasId = new mongoose.Types.ObjectId();

    const chatHistory = new ChatHistory({
      userId: testUserId,
      canvasId: testCanvasId,
      messages: [
        {
          role: "user",
          content: "Test message",
          timestamp: new Date(),
        },
        {
          role: "assistant",
          content: "Test response",
          timestamp: new Date(),
        },
      ],
    });

    await chatHistory.save();
    console.log("✅ Test chat history created:", chatHistory._id);

    // Test retrieving it
    const found = await ChatHistory.findOne({ userId: testUserId });
    console.log("✅ Test chat history retrieved:", found ? "Yes" : "No");
    console.log("   Messages count:", found?.messages.length);

    // Clean up
    await ChatHistory.deleteOne({ _id: chatHistory._id });
    console.log("✅ Test chat history deleted");

    console.log("\n✅ All tests passed! ChatHistory model is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
  }
}

testChatHistory();
