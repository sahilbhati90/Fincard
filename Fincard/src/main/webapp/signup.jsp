<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sign Up Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0f172a, #1e3a8a);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  .card {
      position: absolute;
      width: 280px;
      height: 160px;
      border-radius: 16px;
      color: white;
      padding: 20px;
      font-size: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      animation: float 6s ease-in-out infinite, rotate 20s linear infinite;
      opacity: 0.15;
      background-size: 400% 400%;
      z-index: 0;
    }

    .card:nth-child(1) {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      top: 10%;
      left: 5%;
      animation-delay: 0s;
    }

    .card:nth-child(2) {
      background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
      top: 40%;
      left: 60%;
      animation-delay: 2s;
    }

    .card:nth-child(3) {
      background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
      top: 70%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    @keyframes rotate {
      0% {
        transform: rotateY(0deg) scale(1);
      }
      100% {
        transform: rotateY(360deg) scale(1);
      }
    }

    .login-container {
      background-color: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 400px;
    }

    .signup-container {
      background-color: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 400px;
    }

    .signup-form h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #1e3a8a;
    }

    .input-group {
      margin-bottom: 1rem;
    }

    .input-group label {
      display: block;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #0f172a;
    }

    .input-group input {
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 1rem;
      transition: border 0.3s ease;
    }

    .input-group input:focus {
      outline: none;
      border-color: #1e3a8a;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #1e3a8a;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    button:hover {
      background-color: #0f172a;
    }

    .login-text {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #333;
    }

    .login-text a {
      color: #1e3a8a;
      text-decoration: none;
    }

    .login-text a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
<div class="card">
    <div>GOLD CARD</div>
    <div>1234 5678 9012 3456</div>
    <div>MOHIT</div>
  </div>
  <div class="card">
    <div>SILVER CARD</div>
    <div>2345 6789 0123 4567</div>
    <div>SAHIL</div>
  </div>
  <div class="card">
    <div>BLACK METAL</div>
    <div>3456 7890 1234 5678</div>
    <div>PRIYANSHU</div>
  </div>
  <div class="signup-container">
    <form class="signup-form" action="RegistrationServlet" method="post">
      <h2>Create Your FinCard Account</h2>
      <div class="input-group">
        <label for="fullname">Full Name</label>
        <input type="text" id="fullname" name="name" placeholder="Enter your full name" required />
      </div>
      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Create a password" required />
      </div>
      <div class="input-group">
        <label for="confirmpassword">Confirm Password</label>
        <input type="password" id="confirmpassword" name="confirmpassword" placeholder="Re-enter your password" required />
      </div>
      <button type="submit">Sign Up</button>
      <p class="login-text">Already have an account? <a href="login.jsp">Login here</a></p>
    </form>
  </div>
</body>
</html>
    