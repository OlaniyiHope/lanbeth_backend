import JambQuestion from "../models/jambquestionModel.js";

// export const createQuestion = async (req, res) => {
//   try {
//     // Ensure req.body is an object, not an array
//     const requestBody = Array.isArray(req.body) ? req.body[0] : req.body;

//     console.log("Request Body:", requestBody); // Debugging Log

//     const {
//       questionType,
//       questionTitle,
//       options,
//       correctAnswer,
//       possibleAnswers,
//       mark,
//       examId,
//       onscreenMarking,
//     } = requestBody;

//     if (!questionType || !questionTitle || !mark || !examId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     let questionData = {
//       questionType,
//       questionTitle,
//       mark,
//       exam: examId,
//     };

//     if (questionType === "multiple_choice") {
//       if (!Array.isArray(options) || options.length === 0) {
//         return res.status(400).json({
//           error: "Options are required for multiple-choice questions",
//         });
//       }

//       questionData.options = options.map((option) => ({
//         option: option.option,
//         isCorrect: option.isCorrect,
//       }));
//     } else if (questionType === "true_false") {
//       if (!correctAnswer) {
//         return res.status(400).json({
//           error: "Correct answer is required for true/false questions",
//         });
//       }
//       questionData.correctAnswer = correctAnswer;
//     } else if (questionType === "fill_in_the_blanks") {
//       if (!Array.isArray(possibleAnswers)) {
//         return res
//           .status(400)
//           .json({ error: "Possible answers must be an array" });
//       }
//       questionData.possibleAnswers = possibleAnswers;
//     } else if (questionType === "theory") {
//       questionData.onscreenMarking = onscreenMarking || "";
//     }

//     console.log("Final Question Data:", JSON.stringify(questionData, null, 2)); // Debugging Log

//     const question = new JambQuestion(questionData);
//     await question.save();

//     res.json({ message: "Question saved successfully" });
//   } catch (error) {
//     console.error("Error saving question:", error); // Log error
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// Retrieve questions for a specific exam

export const createQuestion = async (req, res) => {
  try {
    const requestBody = Array.isArray(req.body) ? req.body[0] : req.body;

    console.log("Request Body:", requestBody);

    const {
      questionType,
      questionTitle,
      options,
      correctAnswer,
      possibleAnswers,
      mark,
      examId,
      subject, // Added subject
      onscreenMarking,
    } = requestBody;

    if (!questionType || !questionTitle || !mark || !examId || !subject) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let questionData = {
      questionType,
      questionTitle,
      mark,
      exam: examId,
      subject, // Added subject
    };

    if (questionType === "multiple_choice") {
      if (!Array.isArray(options) || options.length === 0) {
        return res.status(400).json({
          error: "Options are required for multiple-choice questions",
        });
      }
      questionData.options = options.map((option) => ({
        option: option.option,
        isCorrect: option.isCorrect,
      }));
    } else if (questionType === "true_false") {
      if (!correctAnswer) {
        return res.status(400).json({
          error: "Correct answer is required for true/false questions",
        });
      }
      questionData.correctAnswer = correctAnswer;
    } else if (questionType === "fill_in_the_blanks") {
      if (!Array.isArray(possibleAnswers)) {
        return res
          .status(400)
          .json({ error: "Possible answers must be an array" });
      }
      questionData.possibleAnswers = possibleAnswers;
    } else if (questionType === "theory") {
      questionData.onscreenMarking = onscreenMarking || "";
    }

    console.log("Final Question Data:", JSON.stringify(questionData, null, 2));

    const question = new JambQuestion(questionData);
    await question.save();

    res.json({ message: "Question saved successfully" });
  } catch (error) {
    console.error("Error saving question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const examId = req.params.examId; // You can obtain the examId from the route params

    const questions = await JambQuestion.find({ exam: examId });

    res.json(questions);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller to create multiple questions
// export const createMultipleQuestions = async (req, res) => {
//   const { sessionId } = req.params;
//   const { questions } = req.body; // Expect an array of question objects in the request body

//   if (!Array.isArray(questions) || questions.length === 0) {
//     return res.status(400).json({ message: "No questions provided" });
//   }

//   try {
//     const savedQuestions = await Promise.all(
//       questions.map(async (questionData) => {
//         const {
//           questionType,
//           questionTitle,
//           options,
//           correctAnswer,
//           possibleAnswers,
//           mark,
//           examId,
//           onscreenMarking,
//         } = questionData;

//         let data = {
//           questionType,
//           questionTitle,
//           mark,
//           exam: examId,
//           session: sessionId,
//         };

//         if (questionType === "multiple_choice") {
//           data.options = options.map((option) => ({
//             option: option.option,
//             isCorrect: option.isCorrect,
//           }));
//         } else if (questionType === "true_false") {
//           data.correctAnswer = correctAnswer;
//         } else if (questionType === "fill_in_the_blanks") {
//           data.possibleAnswers = possibleAnswers;
//         } else if (questionType === "theory") {
//           data.onscreenMarking = onscreenMarking;
//         }

//         const question = new JambQuestion(data);
//         return question.save();
//       })
//     );

//     res.status(201).json({
//       message: `${savedQuestions.length} questions saved successfully`,
//       questions: savedQuestions,
//     });
//   } catch (error) {
//     console.error("Error saving questions:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const createMultipleQuestions = async (req, res) => {
  const { sessionId } = req.params;

  // Expect req.body to be an array
  const questions = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "No questions provided" });
  }

  try {
    const savedQuestions = await Promise.all(
      questions.map(async (questionData) => {
        const {
          questionType,
          questionTitle,
          options,
          correctAnswer,
          possibleAnswers,
          mark,
          examId,
          onscreenMarking,
        } = questionData;

        if (!questionType || !questionTitle || !mark || !examId || !sessionId) {
          throw new Error("Missing required fields in one or more questions");
        }

        let data = {
          questionType,
          questionTitle,
          mark,
          exam: examId,
          session: sessionId,
        };

        if (questionType === "multiple_choice") {
          if (!Array.isArray(options) || options.length === 0) {
            throw new Error(
              "Options are required for multiple-choice questions"
            );
          }

          data.options = options.map((option) => ({
            option: option.option,
            isCorrect: option.isCorrect,
          }));
        } else if (questionType === "true_false") {
          if (!correctAnswer) {
            throw new Error(
              "Correct answer is required for true/false questions"
            );
          }
          data.correctAnswer = correctAnswer;
        } else if (questionType === "fill_in_the_blanks") {
          if (!Array.isArray(possibleAnswers)) {
            throw new Error("Possible answers must be an array");
          }
          data.possibleAnswers = possibleAnswers;
        } else if (questionType === "theory") {
          data.onscreenMarking = onscreenMarking || "";
        }

        const question = new JambQuestion(data);
        return question.save();
      })
    );

    res.status(201).json({
      message: `${savedQuestions.length} questions saved successfully`,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error("Error saving questions:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Delete a question by ID
export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Use Mongoose to find and remove the question by ID
    const deletedQuestion = await JambQuestion.findByIdAndRemove(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// questionController.js

// Update a question by ID
export const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const { questionType, questionTitle, options, correctAnswer, mark } =
      req.body;

    // Find the question by ID
    const question = await JambQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update the question's fields
    question.questionType = questionType;
    question.questionTitle = questionTitle;
    question.options = options; // For multiple-choice questions
    question.correctAnswer = correctAnswer; // For True/False questions
    question.mark = mark;

    // Save the updated question
    await question.save();

    res.json({ message: "Question updated successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await JambQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json(question);
  } catch {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the question" });
  }
};
