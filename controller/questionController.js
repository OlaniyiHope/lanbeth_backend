import Question from "../models/questionModel.js";

// Create a new question
// export const createQuestion = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const {
//       questionType,
//       questionTitle,
//       options,
//       correctAnswer,
//       possibleAnswers,
//       mark,
//       examId,
//       onscreenMarking,
//     } = req.body;

//     let questionData = {
//       questionType,
//       questionTitle,
//       mark,
//       exam: examId,
//       session: sessionId,
//     };

//     if (questionType === "multiple_choice") {
//       // For multiple-choice questions
//       questionData.options = options.map((option) => ({
//         option: option.option,
//         isCorrect: option.isCorrect,
//       }));
//     } else if (questionType === "true_false") {
//       // For True/False questions
//       questionData.correctAnswer = correctAnswer;
//     } else if (questionType === "fill_in_the_blanks") {
//       // For Fill In The Blanks questions
//       questionData.possibleAnswers = possibleAnswers;
//     } else if (questionType === "theory") {
//       // For Theory questions
//       questionData.onscreenMarking = onscreenMarking;
//     }
//     const question = new Question(questionData);

//     await question.save();
//     res.json({ message: "Question saved successfully" });
//   } catch {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// Create a new question (single or multiple)
export const createQuestion = async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Ensure we always work with an array
    const questions = Array.isArray(req.body) ? req.body : [req.body];

    for (const q of questions) {
      const {
        questionType,
        questionTitle,
        options,
        correctAnswer,
        possibleAnswers,
        mark,
        examId,
        onscreenMarking,
      } = q;

      let questionData = {
        questionType,
        questionTitle,
        mark,
        exam: examId,
        session: sessionId,
      };

      if (questionType === "multiple_choice") {
        questionData.options = options.map(option => ({
          option: option.option,
          isCorrect: option.isCorrect,
        }));
      } 
      else if (questionType === "true_false") {
        questionData.correctAnswer = correctAnswer;
      } 
      else if (questionType === "fill_in_the_blanks") {
        questionData.possibleAnswers = possibleAnswers;
      } 
      else if (questionType === "theory") {
        questionData.onscreenMarking = onscreenMarking;
      }

      // Save each question
      const question = new Question(questionData);
      await question.save();
    }

    res.json({ message: "Questions saved successfully" });

  } catch (err) {
    console.error("Error saving questions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const duplicateQuestions = async (req, res) => {
  try {
    const { fromExamId, toExamId } = req.params;

    // Get all questions from source exam
    const originalQuestions = await Question.find({ exam: fromExamId });
    if (originalQuestions.length === 0) {
      return res.status(404).json({ message: "No questions found to duplicate" });
    }

    // Duplicate each question
    const duplicated = originalQuestions.map(q => {
      const newQ = q.toObject();
      delete newQ._id; // remove old ID
      newQ.exam = toExamId; // assign new exam ID
      return newQ;
    });

    // Insert duplicated questions
    await Question.insertMany(duplicated);

    res.json({
      message: "Questions duplicated successfully",
      count: duplicated.length,
    });

  } catch (err) {
    console.error("Error duplicating questions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve questions for a specific exam
export const getQuestions = async (req, res) => {
  try {
    const examId = req.params.examId; // You can obtain the examId from the route params

    const questions = await Question.find({ exam: examId });

    res.json(questions);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller to create multiple questions
export const createMultipleQuestions = async (req, res) => {
  const { sessionId } = req.params;
  const { questions } = req.body; // Expect an array of question objects in the request body

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

        let data = {
          questionType,
          questionTitle,
          mark,
          exam: examId,
          session: sessionId,
        };

        if (questionType === "multiple_choice") {
          data.options = options.map((option) => ({
            option: option.option,
            isCorrect: option.isCorrect,
          }));
        } else if (questionType === "true_false") {
          data.correctAnswer = correctAnswer;
        } else if (questionType === "fill_in_the_blanks") {
          data.possibleAnswers = possibleAnswers;
        } else if (questionType === "theory") {
          data.onscreenMarking = onscreenMarking;
        }

        const question = new Question(data);
        return question.save();
      })
    );

    res.status(201).json({
      message: `${savedQuestions.length} questions saved successfully`,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error("Error saving questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a question by ID
export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Use Mongoose to find and remove the question by ID
    const deletedQuestion = await Question.findByIdAndRemove(questionId);

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
    const question = await Question.findById(questionId);

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
    const question = await Question.findById(questionId);
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
