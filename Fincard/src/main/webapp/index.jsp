<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fincard Credit Card</title>
  <style>

  body {
    margin: 0;
    font-family: 'Helvetica Neue', sans-serif;
    background-color: #fff;
    color: #000;
  }

  html {
    overflow-y: scroll; /* Always show vertical scrollbar */
  }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 50px;
    background-color: rgba(15, 65, 167, 0.918);
    border-bottom: 1px solid #00000000;
    box-shadow: 0 4px 6px rgba(1, 6, 12, 0.981); /* Add shadow to the navigation bar */
  }

  .topbar .logo {
    height: 60px;
  }

  nav ul {
    list-style: none;
    display: flex;
    gap: 50px;
  }

  nav a {
    text-decoration: none;
    color: #0d0d0d;
    font-weight: bold;
    transition: color 0.3s ease, transform 0.2s ease; /* Smooth transition */
  }

  nav a:hover {
    color: #1219e875; /* Change color on hover */
    transform: scale(1.1); /* Slightly enlarge on hover */
  }

  nav a:active {
    color: #0021b3; /* Darker shade for active state */
    transform: scale(1); /* Reset scale on click */
  }

  .btn {
    background-color: #000000;
    color: white;
    font-weight: bold;
    padding: 10px 18px;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transition */
  }

  .btn:hover {
    background-color: #1e42e5; /* Change background color on hover */
    transform: scale(1.1); /* Slightly enlarge on hover */
  }

  .btn:active {
    background-color: #0056b3; /* Darker shade for active state */
    transform: scale(1); /* Reset scale on click */
  }

  
  </style>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="topbar">
   
    <img src="Images/Fin_Card-removebg-preview.png" alt="FinCard logo" class="logo"><a href="index.html"></a>
    <nav>
      <ul>
        <li><a href="index.jsp">Home</a></li>
        <li><a href="aboutus.html">About Us</a></li>
        <li><a href="offers.html">Offers</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li><a href="Contactus.html">Contact Us</a></li>
      </ul>
    </nav>
    <a href="login.jsp" id="auth-btn" class="btn">Login</a>
  </header>

  <section class="hero">
    <div class="text-content">
      <h1>Say Hello to <br><span class="highlight">Fincard Credit Card</span></h1>
      <h3>Our Banking Partners:</h3>
<div class="partners">
    <img src="Images/Bobcard.png" alt="BOBCARD">
    <img src="Images/SBI.png" alt="State Bank of India">
    <img src="Images/PNB.png" alt="Punjab National Bank">
    <img src="Images/Axis.png" alt="Axis Bank">
    <img src="Images/HDFC.png" alt="HDFC Bank">
    
  </div>
      
      <p>Credit card. Built for trust.<br>
      Backed by the principles of simplicity, transparency, and giving back control to the user.</p>
      <a href="cards.html" class="btn">Apply Now</a>
      <div class="app-links">
       
      </div>
    </div>
    <div class="card-image">
     <img src="Images/FINCARD-removebg-preview.png" alt="FinCard View">
      
    </div>
  </section>

  <!-- New Section: No Hidden Fees -->
  <section class="fees-section">
    <h2><span class="gradient-text">No Hidden Fees.</span></h2>
    <p>No Joining Fees.</p>
    <p>No Annual Fees.</p>
    <p>No Rewards Redemption Fees.</p>
  </section>
  <!-- Section: It's Metal -->
<section class="feature-section">
    <div class="feature-text">
      <img src="Images/cards.png" alt="Metal Icon" class="feature-icon">
      <h2>It's<span class="bold">Metal</span></h2>
      <p>
        A credit card that is exclusive and exquisitely crafted with metal, because you deserve only the best.
        Why settle for plastic cards anymore when you can have the premium feel of a Metal Fincard Credit Card?
      </p>
    </div>
    <div class="feature-image">
      <img src="Images/Metal-removebg-preview.png" alt="Metal OneCard">
    </div>
  </section>
  
  <!-- Section: 5X Rewards -->
  <section class="feature-section reverse">
    <div class="feature-text">
      <img src="Images/Reward.png" alt="Rewards Icon" class="feature-icon">
      <h2><span class="bold">5X rewards</span> on your top spends</h2>
      <p>
        5X rewards on Top 2 spend categories. Points are credited instantly and never expire.
        Just swipe right to redeem. No more rounding off, get even fractional points.
      </p>
    </div>
    <div class="feature-image">
      <img src="Images/rewards.png" alt="Rewards App Screen">
    </div>
  </section>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Support</a>
      </div>
      <p>&copy; 2023 Fincard. All rights reserved.</p>
    </div>
  </footer>
  <script>
    // Check login status from localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
    const authBtn = document.getElementById("auth-btn");
  
    if (isLoggedIn) {
      authBtn.textContent = "My Account";
      authBtn.href = "account.html"; // Replace with your actual account page
    } else {
      authBtn.textContent = "Login";
      authBtn.href = "login.jsp";
    }
    // For logout button
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
}

  </script>
  
</body>
</html>
