import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized: Please log in" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { mock, answers } = await req.json();

    if (!mock || !answers || typeof answers !== "object") {
      return new Response(
        JSON.stringify({ message: "Invalid request: Missing or invalid data." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = session.user.id; // Get user ID from session
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const results = [];
    




    // Check if a response already exists for this userId and mock
    const existingResponse = await db.collection("response").findOne({ userId, mock });
    const existingResult = await db.collection("results").findOne({ userId, mock });
    const mockData = await db.collection('mock').findOne({ _id: new ObjectId(mock) });
    const mockName = mockData.examName
    let collection;
    let options;
    if(mockName.toLowerCase().includes("xat")){
      collection= 'xatquestions';
      options = 'xatoptions'
    } else if (mockName.toLowerCase().includes("cat")) {
      collection = "catquestions";
      options = "catoptions";
    } else if (mockName.toLowerCase().includes("cmat")) {
      collection = "cmatquestions";
      options = "cmatoptions";
    } else if (mockName.toLowerCase().includes("gmat")) {
      collection = "gmatquestions";
      options = "gmatoptions";
    }

    for (const questionIds in answers) {
      const userAnswer = answers[questionIds];

      // Fetch the question details
      const question = await db.collection( collection).findOne({ _id: new ObjectId(questionIds) });

      // Fetch the correct answer from the options collection
      const correctOption = await db.collection(options).findOne({ questionId: new ObjectId(questionIds) });

      // Build the result for this question
      if (question && correctOption) {
          if(correctOption.answer === userAnswer){
            results.push({
              questionIds,
              questionText: question.question, // Assuming the question collection has a `text` field
              userAnswer,
              correctAnswer: correctOption.answer,
              correct : true // Assuming the `options` collection has a `value` field
            });
          } else if (userAnswer===''){
            results.push({
              questionIds,
              questionText: question.question, // Assuming the question collection has a `text` field
              userAnswer,
              correctAnswer: correctOption.answer,
              correct : '' // Assuming the `options` collection has a `value` field
            });
          } else if (correctOption.answer !== userAnswer){
            results.push({
              questionIds,
              questionText: question.question, // Assuming the question collection has a `text` field
              userAnswer,
              correctAnswer: correctOption.answer,
              correct : false // Assuming the `options` collection has a `value` field
            });
          }
       
      } else {
        results.push({
          questionIds,
          message: "Question or correct answer not found.",
        });
      }
    }
    const resultDoc = {
      userId,
      mock,
      results,
      submittedAt: new Date()
    }
    console.log(results)  
    if (existingResult) {
      const updateResults = await db.collection("results").updateOne(
        { userId, mock }, // Match the document based on userId and mockId
        {
          $set: {
            results, // Update the results field
            submittedAt: new Date(), // Update the submittedAt timestamp
          },
        }
      );
    
      if (updateResults.modifiedCount > 0) {
        console.log("Results updated successfully.");
      } else {
        console.error("Failed to update results. Check the query or document structure.");
      }
      
    }
    else{
      const insertResult = await db.collection("results").insertOne(resultDoc);
      console.log("Result submitted successfully with ID:", insertResult.insertedId);

    }
    

    if (existingResponse) {
      // Update the existing document
      const updateResult = await db.collection("response").updateOne(
        { userId, mock },
        { $set: { answers, submittedAt: new Date() } }
      );

      if (updateResult.modifiedCount > 0) {
        return new Response(
          JSON.stringify({ message: "Answers updated successfully!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Failed to update the answers." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Insert a new document
      const responseDoc = {
        userId,
        mock,
        answers, // Object containing question IDs as keys and selected options as values
        submittedAt: new Date(),
      };

      const insertResult = await db.collection("response").insertOne(responseDoc);

      if (insertResult.acknowledged) {
        return new Response(
          JSON.stringify({ message: "Answers submitted successfully!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Failed to save the answers." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  } catch (error) {
    console.error("Error in submit-answers API:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
