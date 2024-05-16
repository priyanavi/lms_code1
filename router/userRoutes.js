// routes/userRoutes.js
const { Router } = require('express');
const router = Router();
const path = require('path');
const nodemailer = require('nodemailer');
const userModel = require('../model/usermodel');
const otpGenerator = require('otp-generator');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

router.post('/', async (req, res) => {
    const { username, password, email, phone, role } = req.body;

    try {
        // Check if the user is already registered as a student
        const isStudentRegistered = await userModel.isStudentRegistered(email);
        if (isStudentRegistered) {
            // If the student is already registered, redirect to the login page
            return res.redirect('/login?registered=true');
        }

        // Check if the user is already registered as an admin
        const isAdminRegistered = await userModel.isAdminRegistered(email);
        if (isAdminRegistered) {
            // If the admin is already registered, redirect to the login page
            return res.redirect('/login?registered=true');
        }

        // If the user is not registered as either student or admin, store the user details
        if (role === 'admin') {
            await userModel.insertAdmin(username, password, email, phone);
        } else {
            await userModel.insertStudent(username, password, email, phone);
        }

        // Redirect to the login page after successful registration
        res.redirect('/login');
    } catch (error) {
        console.error('Error:', error);
        res.send('Error registering user. Please try again.');
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/login', async (req, res) => {
    const { username, email } = req.body;

    try {
        // Check if the email exists in the student database
        const isStudentRegistered = await userModel.isStudentRegistered( email);
        
        // Check if the email exists in the admin database
        const isAdminRegistered = await userModel.isAdminRegistered( email);

        // Check if the username exists in the student database
        const isStudentUsernameRegistered = await userModel.isStudentRegistered( username);
        
        // Check if the username exists in the admin database
        const isAdminUsernameRegistered = await userModel.isAdminRegistered(username);

        // If email or username exists in either student or admin database, proceed to OTP page
        if ((isStudentRegistered || isAdminRegistered) || (isStudentUsernameRegistered || isAdminUsernameRegistered)) {
            // Redirect to the OTP page
            res.redirect(`/verify-otp?username=${username}&email=${email}`);
        } else {
            // Display alert indicating that the user is not registered
            return res.send('<script>alert("You are not registered."); window.location="/login";</script>');
        }
    } catch (error) {
        console.error('Error:', error);
        res.send('Error logging in. Please try again.');
    }
});

// Function to generate OTP
const generateOTP = () => {
    return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  };

  
  // Function to send OTP to the user's email
const sendOtpToEmail = async (email, otp) => {
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'priyadharshini1632@gmail.com', // Replace with your Gmail email
          pass: 'ymcq ddkz ivif dfrr' // Replace with your Gmail password
        }
      });
  
      let info = await transporter.sendMail({
        from: '"LMS" <priyadharshini1632@gmail.com>', // Replace with your name and Gmail email
        to: email,
        subject: 'OTP for Login',
        text: `Your OTP is ${otp}`
      });
      return otp;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };




router.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-login.html'));
});
router.post('/admin-login', async (req, res) => {
    const { username, email } = req.body;

    try {
        // Generate OTP
        const otp = generateOTP();
        console.log(`OTP sent to ${email}: ${otp}`);

        // Save OTP to the database
        await userModel.insertOTP(username, email, otp);

        // Send OTP to the user's email
        await sendOtpToEmail(email, otp);

        // Redirect to verify OTP page
        res.redirect(`/verify-otp?username=${username}`);
    } catch (error) {
        console.error('Error:', error);
        res.send('Error logging in. Please try again.');
    }
});

router.get('/user-login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

// POST route to send OTP to user's email and initiate OTP verification
router.post('/user-login', async (req, res) => {
    const { username, email } = req.body;

    try {
        // Generate OTP
        const otp = generateOTP();
        console.log(`OTP generated for ${username}: ${otp}`);

        // Save OTP to the database
        await userModel.insertOTP(username, email, otp);

        // Send OTP to the user's email
        await sendOtpToEmail(email, otp);

        // Redirect to verify OTP page
        res.redirect(`/verify-otp?username=${username}&email=${email}`);
    } catch (error) {
        console.error('Error:', error);
        res.send('Error logging in. Please try again.');
    }
});

router.post('/verify-otp', async (req, res) => {
    const { username, email, OTP } = req.body;

    try {
        // Retrieve the stored OTP from the database for the provided username and email
        const storedOTP = await userModel.getStoredOTP(username, email);
        console.log(`storedotp ${storedOTP}`)

        // Check if the stored OTP is null (no OTP found for the user)
        if (storedOTP === null) {
            // If no OTP is found, send an error response
            return res.send('<script>alert("No OTP found. Please generate a new OTP."); window.location="/verify-otp";</script>');
        }

        // Check if the stored OTP matches the OTP entered by the user
        if (OTP === storedOTP) {

            return res.redirect('/home?verified=true');
        } else {
            // If OTPs do not match, send an error response
            return res.redirect('/verify-otp?error=true');
            // return res.send('<script>alert("Entered OTP is incorrect. Please try again.");window.location="/verify-otp";</script>');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.send('<script>alert("Error verifying OTP. Please try again later.");</script>');
    }
});



router.post('/home', async (req, res) => {
    res.redirect('/home');
});

router.get('/verify-otp', (req, res) => {
   
    res.sendFile(path.join(__dirname, '..', 'views', 'verify-otp.html'));
});
router.get('/home(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','home.html'))
})

router.get('/about(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','about.html'))
})
router.get('/contact(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','contact.html'))
})
router.post('/contact(.html)?', (req, res) => {
    const formData = req.body;
    res.send('send message successfully');
});
router.get('/courses(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','courses.html'))
})

router.get('/login(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
})
router.get('/playlist_html(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','playlist_html.html'))
})
router.get('/profile(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','profile.html'))
})
router.get('/register(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','register.html'))
})
router.get('/teacher_profile(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','teacher_profile.html'))
})
router.get('/teachers(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','teachers.html'))
})
router.get('/update(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','update.html'))
})
router.get('/watch-video(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','watch-video.html'))
})
router.get('/playlist_css(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','playlist_css.html'))
})


router.get('/playlist_js(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','playlist_js.html'))
})
router.get('/playlist_python(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','playlist_python.html'))
})
router.get('/playlist_c(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','playlist_c.html'))
})
router.get('/playlist_java(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','playlist_java.html'))
})
router.get('/payment(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','payment.html'))
})
router.post('/payment', async (req, res) => {
    const { Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV, Course } = req.body;

    try {
        // Check if the selected course is valid
        const validCourses = ['HTML', 'CSS', 'JavaScript', 'Python', 'C', 'Java'];
        if (!validCourses.includes(Course)) {
            throw new Error('Invalid course selected');
        }

        const memberCount = await userModel.getMemberCount(Course);

        // Check if the member count exceeds 10
        if (memberCount >= 5) {
            throw new Error('Maximum number of members reached for this course.');
        }

        // Insert user details based on the selected course
        switch (Course) {
            case 'HTML':
                await userModel.insertHTML(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV);
                break;
               
            case 'CSS':
                await userModel.insertCSS(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV);
                break;
            case 'JavaScript':
                await userModel.insertJavaScript(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV);
                break;
            case 'Python':
                await userModel.insertPython(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV);
                break;
            case 'C':
                await userModel.insertC(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV);
                break;
            case 'Java':
                await userModel.insertJava(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV);
                break;
            default:
                throw new Error('Invalid course selected');
        }
        
        await sendPaymentSuccessEmail(Email);
        
        // Redirect to the payment success page
        res.redirect('/payment_s');
    } catch (error) {
        console.error('Error inserting user details:', error);
        res.status(400).send('Invalid course selected. Please select a valid course.');
    }
});

async function sendPaymentSuccessEmail(email) {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            // host: 'smtp.example.com',
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service: 'gmail',
            auth: {
                user: 'priyadharshini1632@gmail.com',
                pass: 'ymcq ddkz ivif dfrr'
            }
        });

        // Setup email data
        const mailOptions = {
            from: 'priyadharshini1632@gmail.com',
            to: email,
            subject: 'Payment Confirmation',
            text: 'Your payment was successful. Thank you for your purchase!'
        };

        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

router.post('/payment_s',(req,res)=>{
    res.redirect('/payment_s')
})

router.get('/payment_s', (req, res) => {
    // Redirect to the payment success page
    res.sendFile(path.join(__dirname, '..', 'views', 'payment_s.html'));
});




router.get('/course_html(.html)?', (req, res) => {
    // Redirect to the payment success page
    res.sendFile(path.join(__dirname, '..', 'views', 'course_html.html'));
});



router.get('/course_css(.html)?', (req, res) => {
    // Redirect to the payment success page
    res.sendFile(path.join(__dirname, '..', 'views', 'course_css.html'));
});

router.get('/course_js(.html)?', (req, res) => {
    // Redirect to the payment success page
    res.sendFile(path.join(__dirname, '..', 'views', 'course_js.html'));
});
router.get('/course_python(.html)?', (req, res) => {
    // Redirect to the payment success page
    res.sendFile(path.join(__dirname, '..', 'views', 'course_python.html'));
});
router.get('/course_c(.html)?', (req, res) => {
    // Redirect to the payment success page
    res.sendFile(path.join(__dirname, '..', 'views', 'course_c.html'));
});
router.get('/course_java(.html)?', (req, res) => {
    // Redirect to the payment success page
    res.sendFile(path.join(__dirname, '..', 'views', 'course_java.html'));
});



module.exports=router;