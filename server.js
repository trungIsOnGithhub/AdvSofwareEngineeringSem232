const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const Product = require('./models/productModel')
const User = require('./models/user');
const Exam = require('./models/exam');

const authenticateToken = require('./middleWare/authenticateToken');
const Submit = require('./models/submitModal');

const app = express()
const router = express.Router();

app.use(bodyParser.json());

app.use(express.json())

app.use(cors());

// app.use(authenticateToken);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Cho phép tất cả các domain truy cập API (thay * thành domain của trang web của bạn nếu bạn chỉ muốn cho phép một domain cụ thể)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});

app.get('/',(req, res) => {
    res.send('Hello NODE API')
})

app.get('/blog',(req,res)=>{
    res.send('This is blog')
})

async function hash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
app.post('/register', async (req, res) => {
    const { fullname, email, password, role } = req.body;
  
    // Kiểm tra xem username đã được sử dụng chưa
    const existingUser = await User.findOne({ email });
  
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }
  
    const hashedPassword = await hash(password);
  
    const user = new User({ fullname, email, password: hashedPassword, role });
  
    try {
      await user.save();
      res.status(201).json({ message: 'User registered successfully',user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Login endpoint
async function compare(passwordInput, userPassword) {
  return await bcrypt.compare(passwordInput, userPassword);
}
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request' });
    }

    const secret = '33e63cdbf2c1b7c12bdef634d08f82bedc42a252963dfade0401af3c354cf3fa'
    // console.log(secret)
    // const user = await User.findOne({ email });
  
    // if (!user) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }
  
    // if (!(await compare(password, user.password))) {
    //   return res.status(401).json({ 'error': 'Invalid credentials' });
    // }
  
    const token = jwt.sign({  email: email }, secret);
    // console.log(token)
    res.status(200).json({ token   });
  });

// Middleware for token authentication


app.get('/users',authenticateToken, async (req, res) => {
    try {
      // Lấy tất cả người dùng từ cơ sở dữ liệu
      const users = await User.find({}, { _id: 0, password: 0 }); // Loại bỏ _id và password từ kết quả truy vấn
  
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving users' });
    }
  });

// API to get user profile
app.get('/profile', authenticateToken, (req, res) => {
    const { username } = req.user; // Lấy thông tin người dùng từ token
    console.log(username)
    res.json({ username });
  });


app.get('/hello',authenticateToken,(req,res)=>{
    res.send('hello')
})
// API to update user profile
app.put('/profile', authenticateToken, async (req, res) => {
    const { username } = req.user;
    const { email } = req.body;
  
    try {
      const updatedUser = await User.findOneAndUpdate({ username }, {email}, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error updating profile' });
    }
  });

app.post('/exams', async (req, res) => {
    try {
      const { examName, questions } = req.body;
      // console.log(examName)
      // console.log(questions) 
      const exam = new Exam({ examName, questions });
      console.log(exam)
      await exam.save();
      res.status(201).json({ message: 'Exam created successfully',exam });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
app.get('/exams', async(req,res)=>{
  try{
    const exams = await Exam.find()
    res.status(200).json(exams)
  }
  catch(err){
    res.status(500).json({err:'Internal server error'})
  }
})

app.get('/exams/:id', async (req, res) => {
  const examId = req.params.id;

  try {
      const exam = await Exam.findById(examId);

      if (!exam) {
          return res.status(404).json({ message: 'Exam not found' });
      }

      res.json({ exam });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

//put exams
app.put('/exams/:id', async (req, res) => {
  const examId = req.params.id;

  try {
    // Find the exam by ID
    let exam = await Exam.findById(examId);

    if (!exam) {
      // If the exam is not found, return a 404 error
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Update exam details based on the request body
    if (req.body.examName) {
      exam.examName = req.body.examName;
    }

    if (req.body.questions && Array.isArray(req.body.questions)) {
      // Iterate through questions in the request body
      for (const updatedQuestion of req.body.questions) {
        const existingQuestion = exam.questions.find(q => q._id == updatedQuestion._id);

        if (existingQuestion) {
          // Update existing question
          existingQuestion.questionContent = updatedQuestion.questionContent;

          // Update options for the existing question
          if (updatedQuestion.options && Array.isArray(updatedQuestion.options)) {
            existingQuestion.options = updatedQuestion.options;
          }
        } else {
          // Add a new question if it doesn't exist in the current exam
          exam.questions.push(updatedQuestion);
        }
      }
    }

    // Save the updated exam
    exam = await exam.save();

    res.json({ message: 'Exam updated successfully', exam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/exams/:id/questions/:questionId', async (req, res) => {
  const examId = req.params.id;
  const questionId = req.params.questionId;

  try {
      let exam = await Exam.findById(examId);

      if (!exam) {
          return res.status(404).json({ message: 'Exam not found' });
      }

      const questionIndex = exam.questions.findIndex(q => q._id == questionId);

      if (questionIndex === -1) {
          return res.status(404).json({ message: 'Question not found' });
      }

      const updatedQuestion = req.body;

      // Cập nhật nội dung của câu hỏi
      exam.questions[questionIndex] = updatedQuestion;

      // Lưu kỳ thi sau khi cập nhật thông tin
      exam = await exam.save();

      res.json({ message: 'Question updated successfully', exam });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
//api to delete exams by id
app.delete('/exams/:id', async (req, res) => {
  const examId = req.params.id;

  try {
    // Sử dụng Mongoose để tìm và xóa bài kiểm tra theo ID
    const deletedExam = await Exam.findByIdAndDelete(examId);

    if (!deletedExam) {
      // Nếu không tìm thấy bài kiểm tra, trả về lỗi 404
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Trả về thông báo thành công nếu xóa thành công
    res.json({ message: 'Exam deleted successfully', deletedExam });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/exams/:id/questions/:questionId', async (req, res) => {
  const examId = req.params.id;
  const questionIdToDelete = req.params.questionId;

  try {
    // Find the exam by ID
    let exam = await Exam.findById(examId);

    if (!exam) {
      // If the exam is not found, return a 404 error
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Find the index of the question to be deleted
    const questionIndex = exam.questions.findIndex((q) => q._id == questionIdToDelete);

    if (questionIndex === -1) {
      // If the question is not found, return a 404 error
      return res.status(404).json({ message: 'Question not found' });
    }

    // Remove the question from the exam's questions array
    exam.questions.splice(questionIndex, 1);

    // Save the updated exam
    exam = await exam.save();

    res.json({ message: 'Question deleted successfully', exam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/exam/submit', async(req,res)=>{
  try {
    let exam = await Exam.findById(req.body.examId);
    let user = await User.findById(req.body.userId);
    let score = req.body.score;
    const submit = await Submit.create({examId: exam, userId: user, score});
    res.json(submit);
} catch (e) {
    return res.status(500).json(e.message)
}
})

app.get('/exam/:id', async (req, res) => {
  let submits = await Submit.find({examId: req.params.id});
  const r = [];
  for(let i =0; i<submits.length; i++){
        const user = await User.findById(submits[i].userId);
        console.log(user);
        r.push({key: i+1, name: user.fullname, score: submits[i].score, email: user.email, time: submits[i].createdAt});
  }
  console.log(r);
  res.json(r)
})

app.post('/product', async(req,res)=>{
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})
app.get('/products', async(req,res)=>{
    try{
        const product = await Product.find({})
        res.status(200).json(product)
    } catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})

app.get('/products/:id', async(req,res)=>{
    try{
        const {id} = req.params
        const product = await Product.findById(id)
        if(!product)
        {
            return res.status(404).json({message:`cannot find any product with ID: ${id}`})
        }
        res.status(200).json(product)
    } catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})
app.put('/products/:id', async(req,res)=>{
    try{
        const {id} = req.params
        const product = await Product.findByIdAndUpdate(id, req.body)
        if(!product)
        {
            return res.status(404).json({message: `cannot find any product with ID: ${id}`})
        }
        const updateProduct = await Product.findById(id)
        res.status(200).json(updateProduct)
    } catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})
app.delete('/products/:id', async(req,res)=>{
    try{
        const {id} = req.params
        const product = await Product.findByIdAndDelete(id)
        if(!product)
        {
            return res.status(404).json({message: `cannot find any product with ID: ${id}`})
        }
        res.status(200).json(product)
    } catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})
app.listen(5000, ()=>{
    console.log('Node api app is running on port 5000')
})


// connect to mongodb
// mongoose.connect('mongodb+srv://phanhoangphuc03111:phuc1755@cluster0.b576f71.mongodb.net/API-NODE?retryWrites=true&w=majority')
// .then(()=>{
//     console.log('connected to MongoDB')
// }).catch((error)=>{
//     console.log(error)
// })

module.exports = {
  hash,
  compare
}